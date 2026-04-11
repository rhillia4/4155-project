import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button, Grid } from '@mui/material';
import { use, useEffect } from 'react';
import { getStockData } from '../../services/api';
import { useState } from 'react';
import dayjs from 'dayjs';
function HoldingTable({ holdings }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
                const updatedRows = holdings.sort((a, b) => a.asset.symbol.localeCompare(b.asset.symbol));

        setRows(updatedRows)
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
                        <TableCell>{parseFloat(t.remaining_shares).toFixed(0)}</TableCell>
                        <TableCell>${parseFloat(t.buy_price).toFixed(2)}</TableCell>
                        <TableCell>${parseFloat((t.latest_price)).toFixed(2)}</TableCell>
                        <TableCell>${parseFloat((t.value)).toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default HoldingTable;