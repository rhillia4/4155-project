import React, { useState, useEffect } from 'react';
import {
  Tab,
  Tabs,
  Autocomplete,
  Box,
  TextField,
  Dialog,
  Typography,
  Button
} from '@mui/material';

import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useTransactions } from '../../hooks/useTransactions.js';
import { getSymbols, getStockData } from '../../services/api.js';

function BuyTransaction({ portfolioId, open, onClose }) {
  const { createTransaction } = useTransactions();

  const [symbolList, setSymbolList] = useState([]);
  const [asset, setAsset] = useState(null);
  const [stockData, setStockData] = useState([]);

  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(dayjs());

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [quantity, setQuantity] = useState(1);

  const [tab, setTab] = useState(0);

  // ----------------------------
  // Load symbols
  // ----------------------------
  useEffect(() => {
    getSymbols()
      .then((response) => {
        setSymbolList(
          response.data.sort((a, b) => a.symbol.localeCompare(b.symbol))
        );
      })
      .catch((error) => {
        console.error("Error fetching symbol list:", error);
      });
  }, []);

  // ----------------------------
  // Load stock data when asset changes
  // ----------------------------
  useEffect(() => {
    if (!asset) return;

    getStockData(asset.symbol)
      .then((response) => {
        const data = response.data || [];
        setStockData(data);

        if (data.length > 0) {
          const timestamps = data.map(d => new Date(d.date).getTime());
          setMinDate(dayjs(Math.min(...timestamps)));
          setMaxDate(dayjs(Math.max(...timestamps)  + 24 * 60 * 60 * 1000)); // Add 1 day to include max date
        }
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
      });
  }, [asset]);

  const handleClose = () => {
    setAsset(null);
    setStockData([]);
    setSelectedDate(dayjs());
    setQuantity(1);
    setTab(0);

    onClose();
  };

  // ----------------------------
  // Derived selected price (SAFE)
  // ----------------------------
  const selectedDateStr = selectedDate?.format("YYYY-MM-DD");

  const selectedPrice =
    stockData.find(d => d.date === selectedDateStr)?.price ?? 0;

  const currentPrice = useMemo(() => {
    if (!stockData.length) return 0;

    const latest = stockData.reduce((latestItem, current) => {
      return new Date(current.date).getTime() >
        new Date(latestItem.date).getTime()
        ? current
        : latestItem;
    }, stockData[0]);

    const val = Number(latest?.price);
    return Number.isFinite(val) ? val : 0;
  }, [stockData]);

  const totalCost = (selectedPrice * quantity).toFixed(2);

  const isMarketClosed = (date) => {
    const day = dayjs(date).day();
    return day === 0 || day === 6; // Sunday (0) or Saturday (6)
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
    >
      <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
        <Tab label="Buy New" />
        <Tab label="Add Existing" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          {tab === 0 ? "Buy New Position" : "Buy Existing Position"}
        </Typography>

        <Autocomplete
          options={symbolList}
          getOptionLabel={(option) => `${option.name} (${option.symbol})`}
          renderInput={(params) => (
            <TextField {...params} label="Select Stock" />
          )}
          onChange={(event, newValue) => {
            setAsset(newValue || null);
          }}
        />

        {asset && stockData.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {/* ---------------- TAB 0 ---------------- */}
            {tab === 0 && (
              <>
                <Typography>
                  Current Price for {asset.symbol}: ${currentPrice}
                </Typography>

                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setQuantity(value > 0 ? value : 1);
                  }}
                  sx={{ mt: 2 }}
                />

                <Typography sx={{ mt: 1 }}>
                  Total Cost: ${(currentPrice * quantity).toFixed(2)}
                </Typography>

                <Button
                  variant="contained"
                  disabled={isMarketClosed(dayjs())}
                  sx={{ mt: 2 }}
                  onClick={async () => {
                    try {
                      await createTransaction(portfolioId, {
                        asset: asset.id,
                        transaction_type: "BUY",
                        transaction_date: dayjs().format("YYYY-MM-DD"),
                        shares: quantity,
                        price: currentPrice,
                      });

                      handleClose();
                    } catch (err) {
                      console.error("Error creating transaction:", err);
                    }
                  }}
                >
                  Confirm Purchase
                </Button>
              </>
            )}

            {/* ---------------- TAB 1 ---------------- */}
            {tab === 1 && (
              <>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography>
                    Price for {asset.symbol} on {selectedDateStr}:
                    {" $"}
                    {selectedPrice}
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={(newValue) => {
                        if (!newValue) return;
                        setSelectedDate(newValue);
                      }}
                      shouldDisableDate={isMarketClosed}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Box>

                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setQuantity(value > 0 ? value : 1);
                  }}
                  sx={{ mt: 2 }}
                />

                <Typography sx={{ mt: 1 }}>
                  Total Cost: ${totalCost}
                </Typography>

                <Button
                  variant="contained"
                  disabled={isMarketClosed(selectedDate)}
                  sx={{ mt: 2 }}
                  onClick={async () => {
                    try {
                      await createTransaction(portfolioId, {
                        asset: asset.id,
                        transaction_type: "BUY",
                        transaction_date: selectedDateStr,
                        shares: quantity,
                        price: selectedPrice,
                      });

                      handleClose();
                    } catch (err) {
                      console.error("Error creating transaction:", err);
                    }
                  }}
                >
                  Confirm Purchase
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  );
}

export default BuyTransaction;