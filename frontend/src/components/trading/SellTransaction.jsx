import React, { useState, useEffect, useMemo } from 'react';
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
import { getStockData } from '../../services/api.js';

function SellTransaction({ portfolioId, holdings, open, onClose }) {
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
  // Load unique symbols safely
  // ----------------------------
  useEffect(() => {
    if (!Array.isArray(holdings)) return;

    const seen = new Set();
    const filtered = holdings
      .filter(h => {
        if (!h?.asset.symbol) return false;
        if (seen.has(h.asset.symbol)) return false;
        seen.add(h.asset.symbol);
        return true;
      })
      .sort((a, b) =>
        (a.asset.symbol || "").localeCompare(b.asset.symbol || "")
      );
      
    setSymbolList(filtered);
  }, [holdings]);

  // ----------------------------
  // Load stock data
  // ----------------------------
  useEffect(() => {
    if (!asset?.symbol) return;

    getStockData(asset.symbol)
      .then((response) => {
        const data = response.data || [];
        setStockData(data);

        if (data.length > 0) {
          const timestamps = data
            .map(d => new Date(d.date).getTime())
            .filter(Boolean);
            if (timestamps.length) {
                setMinDate(dayjs(Math.max(Math.min(...timestamps), minDate || 0)));
                setMaxDate(dayjs(Math.max(...timestamps) + 24 * 60 * 60 * 1000)); // Add 1 day to include max date
            }
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
  // SAFE derived values
  // ----------------------------
  const selectedDateStr = selectedDate?.format?.("YYYY-MM-DD") || "";

  const selectedPrice = useMemo(() => {
    const found = stockData.find(d => d.date === selectedDateStr);
    const val = Number(found?.price);
    return Number.isFinite(val) ? val : 0;
  }, [stockData, selectedDateStr]);

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

  const availableShares = useMemo(() => {
    if (!asset?.symbol) return 0;

    return holdings
      .filter(h => h.asset.symbol === asset.symbol)
      .reduce((sum, h) => sum + (Number(h.remaining_shares) || 0), 0);
  }, [holdings, asset]);

  const safeQuantity = Number.isFinite(quantity) ? quantity : 1;
  const clampedQuantity = Math.max(
    1,
    Math.min(safeQuantity, availableShares || 1)
  );

  const totalValue = (selectedPrice * clampedQuantity).toFixed(2);

    const isMarketClosed = (date) => {
      const day = dayjs(date).day();
      return day === 0 || day === 6; // Sunday (0) or Saturday (6)
    };
  

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
        <Tab label="Sell Now" />
        <Tab label="Add Previous Sale" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          {tab === 0 ? "Sell Now" : "Add Previous Sale"}
        </Typography>

        <Autocomplete
          options={symbolList}
          getOptionLabel={(option) =>
            `${option.asset.name} (${option.asset.symbol})`
          }
          renderInput={(params) => (
            <TextField {...params} label="Select Stock" />
          )}
          onChange={(event, newValue) => {
            setAsset(newValue.asset || null);
            setMinDate(newValue.buy_date ? dayjs(newValue.buy_date) : null);
            setQuantity(1);
          }}
        />

        {asset && stockData.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {/* TAB 0 */}
            {tab === 0 && (
              <>
                <Typography>
                  Current Price: ${currentPrice}
                </Typography>

                <TextField
                  label="Quantity"
                  type="number"
                  value={Number.isFinite(quantity) ? quantity : 1}
                  inputProps={{
                    min: 1,
                    max: availableShares || 1
                  }}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (!Number.isFinite(value) || value <= 0) {
                      setQuantity(1);
                      return;
                    }

                    setQuantity(
                      Math.min(value, availableShares || value)
                    );
                  }}
                  sx={{ mt: 2 }}
                />

                <Typography sx={{ mt: 1 }}>
                  Total Value: ${(currentPrice * clampedQuantity).toFixed(2)}
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={availableShares === 0 || isMarketClosed(dayjs())}
                  onClick={async () => {
                    await createTransaction(portfolioId, {
                      asset: asset.id,
                      transaction_type: "SELL",
                      transaction_date: dayjs().format("YYYY-MM-DD"),
                      shares: clampedQuantity,
                      price: currentPrice,
                    });

                    handleClose();
                  }}
                >
                  Confirm Sell
                </Button>
                {isMarketClosed(dayjs()) && (
                  <Typography sx={{ mt: 2, color: "error.main" }}>
                    The market is currently closed. You can only add existing sales on closed days.
                  </Typography>
                )}
              </>
            )}

            {/* TAB 1 */}
            {tab === 1 && (
              <>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography>
                    Price on {selectedDateStr}: ${selectedPrice}
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={(newValue) => {
                        if (newValue) setSelectedDate(newValue);
                      }}
                      shouldDisableDate={isMarketClosed}
                      textField= {{ fullWidth: true }}
                    />
                  </LocalizationProvider>
                </Box>

                <TextField
                  label="Quantity"
                  type="number"
                  value={Number.isFinite(quantity) ? quantity : 1}
                  inputProps={{
                    min: 1,
                    max: availableShares || 1
                  }}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (!Number.isFinite(value) || value <= 0) {
                      setQuantity(1);
                      return;
                    }

                    setQuantity(
                      Math.min(value, availableShares || value)
                    );
                  }}
                  sx={{ mt: 2 }}
                />

                <Typography sx={{ mt: 1 }}>
                  Total Value: ${totalValue}
                </Typography>

                <Button
                  variant="contained"
                  disabled={availableShares === 0 || isMarketClosed(selectedDate)}
                  sx={{ mt: 2 }}
                  onClick={async () => {
                    await createTransaction(portfolioId, {
                      asset: asset.id,
                      transaction_type: "SELL",
                      transaction_date: selectedDateStr,
                      shares: clampedQuantity,
                      price: selectedPrice,
                    });

                    handleClose();
                  }}
                >
                  Confirm Sell
                </Button>
                {isMarketClosed(selectedDate) && (
                  <Typography sx={{ mt: 2, color: "error.main" }}>
                    The market was closed on the selected date. You can only add sales for dates when the market was open.
                  </Typography>
                )}
                {selectedDate && (minDate > selectedDate || maxDate < selectedDate) && (
                  <Typography sx={{ mt: 2, color: "error.main" }}>
                    The selected date is out of range for this stock. Please select a date between {minDate?.format("YYYY-MM-DD")} and {maxDate?.format("YYYY-MM-DD")}.
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Dialog>
  );
}

export default SellTransaction;