import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {tauri} from "@tauri-apps/api";

function translateColor(color: string): string {
    switch (color) {
        case "blue":
            return 'info.light';
        case "orange":
            return 'warning.light';
        case "pink":
            return 'secondary.light';
        case "red":
            return 'error.light';
        default:
            return 'info.light';
    }
}

// @ts-ignore
export default function Side({ teamId, updateMatch, score, setScore }) {
    const [stage, setStage] = useState(0);
    const [teamName, setTeamName] = useState("");
    const [scoreColor, setScoreColor] = useState("");

    useEffect(() => {
        tauri.promisified({
            cmd: 'listen',
            event: 'mirror_update',
            handler: (payload) => {
                console.log('Received data from backend:', payload);
                if (payload.team_id == teamId){
                    setStage(payload.current_stage)
                    setScore(payload.score_points)
                    setScoreColor(translateColor(payload.score_color))
                    updateMatch(payload.is_stage_won)
                }
            },
        });
    }, [])

    return (
        <Grid2 container spacing={5}>
            <Grid2 xs={12}>
                <Typography variant="h2">POPO {teamName}</Typography>
            </Grid2>

            <Grid2 xs={12}>
                <Typography variant="h6">STAGE</Typography>
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        backgroundColor: 'lime.lime',
                    }}
                >
                    <Typography variant="h3"> {stage}</Typography>
                </Box>
            </Grid2>

            <Grid2 xs>
                <Box
                    sx={{
                        width: 201,
                        height: 190,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        sx={{backgroundColor: scoreColor}}
                    >
                        <Typography variant="h1">{score}</Typography>
                    </Paper>
                </Box>
            </Grid2>
        </Grid2>
    );
}
