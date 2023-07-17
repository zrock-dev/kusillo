import * as React from 'react';
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Typography
} from '@mui/material';

export default function Home() {
    const navigate = useNavigate();

    const handleOnMatch = () => {
        invoke('make_match', {teamAId: 1, teamBId: 2})
            .then(() => (navigate("/match")))
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Typography variant="h2" component="div">
                Kusillo
            </Typography>

            <Button onClick={handleOnMatch}>
                Match
            </Button>
        </Box>
    );
}
