import React, { useState, useEffect, use } from 'react';
import { Autocomplete, Box, TextField, Dialog, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePortfolioContext } from '../../context/PortfolioContext.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import axios from 'axios';

function Transaction({ portfolioId, open, onClose }) {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [symbolList, setSymbolList] = useState([]);
  const { createTransaction } = useTransactions();
  const [asset, setAsset] = useState(null);
  const [stockData, setStockData] = useState([]);

    const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/assets/`)
        .then((response) => {
            setSymbolList(response.data.sort((a, b) => a.symbol.localeCompare(b.symbol)));
        })
        .catch((error) => {
            console.error("Error fetching symbol list:", error);
        })
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        if (asset) {
            axios.get(`${API_BASE_URL}/stock-price/${asset.symbol}/`)
            .then((response) => {
                setStockData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching stock price for symbol:", error);
            })
            .finally(() => setLoading(false));
        }
    }, [asset]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            disableRestoreFocus

        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="h2">
                    Buy Position:
                </Typography>
                <Autocomplete
                    options={symbolList}
                    getOptionLabel={(option) => `${option.name} (${option.symbol})`}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Stock" />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue) {
                        setAsset(newValue);
                        } else {
                        setAsset(null);
                        }
                    }}
                />
                {asset && stockData && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            Current Price for {asset.symbol}: ${stockData[0]?.price}
                        </Typography>
                        <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setQuantity(value > 0 ? value : 1);
                        }}
                        min={1}
                        step={1}
                        sx={{ mt: 2 }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Total Cost: ${(stockData[0]?.price * quantity).toFixed(2)}
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ mt: 2 }}
                            onClick={async () => {
                                try {
                                    await createTransaction(portfolioId, {
                                        transaction_type: "BUY",
                                        shares: quantity,
                                        price: stockData[0]?.price,
                                        asset: asset.id,
                                    });
                                    requestAnimationFrame(() => {                                        
                                        onClose();
                                        // window.location.reload();
                                    });
                                } catch (error) {
                                    console.error("Error creating transaction:", error);
                                }
                            }}
                        >
                            Confirm Purchase
                        </Button>
                    </Box>
                )}

            </Box>
        </Dialog>
    );
}

export default Transaction;