import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Grid } from '@mui/material';
import { useEffect } from 'react';
import { getStockData } from '../../services/api';
import { useState } from 'react';
import dayjs from 'dayjs';
function HoldingTable({ holdings }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!holdings?.length) return;

        const fetchData = async () => {
            const updatedRows = [];

            for (const holding of holdings) {
                if (!holding.asset?.symbol) continue;

                try {
                    const response = await getStockData(holding.asset.symbol);
                    const data = response.data || [];

                    if (data.length === 0) continue;

                    const latest = data.reduce((latestItem, current) => {
                        return new Date(current.date) > new Date(latestItem.date)
                            ? current
                            : latestItem;
                    }, data[0]);

                    const latestPrice = Number(latest.price) || 0;

                    updatedRows.push({
                        ...holding,
                        latest_price: latestPrice
                    });

                } catch (error) {
                    console.error("Error fetching stock data:", error);
                }
            }


            setRows(updatedRows.sort((a, b) => a.asset.symbol.localeCompare(b.asset.symbol)));
        };

        fetchData();
    }, [holdings]);
    
    return (
        <Box sx={{ width: '100%', height: '100%' }}>
                  
            <TableContainer component={Paper} sx={{ mt: 4, width: '100%' }}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Shares</TableCell>
                    <TableCell>Buy Price(Per Share)</TableCell>
                    <TableCell>Current Price(Per Share)</TableCell>
                    <TableCell>Total Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rows?.map((t) => (
                    <TableRow key={t.id}>
                        <TableCell>{t.asset.symbol}</TableCell>
                        <TableCell>{t.remaining_shares}</TableCell>
                        <TableCell>${t.buy_price}</TableCell>
                        <TableCell>${t.latest_price}</TableCell>
                        <TableCell>${(t.remaining_shares * t.latest_price)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default HoldingTable;