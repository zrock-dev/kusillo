import * as React from 'react';
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import {Box, Container, Typography} from '@mui/material';
import TeamListSelection from "./TeamListSelection";

export default function MatchSelect() {
    const navigate = useNavigate();

    function startClock() {
        invoke('create_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    function handleMatchStart(teamAId: number, teamBId: number) {
        let gameId = -1;
        invoke('create_new_game', {teamAId: teamAId, teamBId: teamBId})
            .then((id) => {
                gameId = id as number
            })
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
            .finally(() => {
                startClock()
                navigate("/match", {state: {gameId}})
            })
    }

    return (
        <Container>
            <Box sx={{display: 'flex'}}>
                <Typography variant="h2" component="div">
                    Match Selection
                </Typography>
            </Box>
            <TeamListSelection
                handleMatchStart={handleMatchStart}
            />
        </Container>
    );
}
