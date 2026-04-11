import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Grid } from '@mui/material';
import { useState, useEffect } from 'react';

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
                    <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rows?.map((t) => (
                    <TableRow key={t.id}>
                        <TableCell>{t.asset_symbol}</TableCell>
                        <TableCell>{t.shares}</TableCell>
                        <TableCell>${t.price}</TableCell>
                        <TableCell>${(t.shares * t.price)}</TableCell>
                        <TableCell>{t.transaction_type}</TableCell>
                        <TableCell>{t.transaction_date}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default TransactionTable;