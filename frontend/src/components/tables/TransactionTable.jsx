import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

function TransactionTable({ transactions }) {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        if (!transactions?.length) return;
        const updatedRows = transactions.sort((a, b) => a.asset_symbol.localeCompare(b.asset_symbol));
        setRows(updatedRows);
    }, [transactions]);
    return (
        <Box sx={{ width: '100%', height: '100%' }}>
                  
            <TableContainer component={Paper} sx={{ mt: 4, width: '100%' }}>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Shares</TableCell>
                    <TableCell>Price(Per Share)</TableCell>
                    <TableCell>Total Price</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Transaction Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rows?.map((t) => (
                    <TableRow key={t.id}>
                        <TableCell>{t.asset_symbol}</TableCell>
                        <TableCell>{parseFloat(t.shares).toFixed(0)}</TableCell>
                        <TableCell>${parseFloat(t.price).toFixed(2)}</TableCell>
                        <TableCell>${parseFloat(t.shares * t.price).toFixed(2)}</TableCell>
                        <TableCell>{t.transaction_type}</TableCell>
                        <TableCell>{dayjs(t.transaction_date).format('MM/DD/YY')}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default TransactionTable;