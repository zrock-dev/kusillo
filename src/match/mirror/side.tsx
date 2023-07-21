import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Paper, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {listen} from '@tauri-apps/api/event'
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";

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
export default function Side({teamId, updateMatch, score, setScore}) {
    const [stage, setStage] = useState(0);
    const [teamName, setTeamName] = useState("");
    const [scoreColor, setScoreColor] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        console.debug(`Requesting name team name for id: ${teamId}`)
        invoke('request_team_name', {teamId: teamId})
            .then((name: any) => {
                setTeamName(name)
            })
            .catch((error => {
                console.error(error)
            }))
    }, [teamId])

    const matchUpdate = listen('mirror_update', (event_content) => {
        let payload = event_content.payload
        let configuration = payload.configuration

        if (payload.team_id == teamId) {
            setStage(configuration.current_stage)
            setScore(payload.score_points)
            setScoreColor(translateColor(configuration.score_color))
            updateMatch(configuration.is_stage_won)
        }
    })

    matchUpdate.catch((error) => {
        console.error(error);
        navigate('/error');
    })

    return (
        <Grid2 container spacing={5}>
            <Grid2 xs={12}>
                <Typography variant="h2">{teamName}</Typography>
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
