import * as React from 'react';

import {
    Box,
    Typography
} from '@mui/material';
import {Link} from "react-router-dom";

export default function Home() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Typography variant="h2" component="div">
                Kusillo
            </Typography>
        </Box>
    );
}