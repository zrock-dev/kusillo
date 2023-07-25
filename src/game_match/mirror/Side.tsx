import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Paper, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {listen} from '@tauri-apps/api/event'
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import TimeOutBox from "../timeout/TimeOutBox";
import TimeOutDialog from "../timeout/TimeOutDialog";

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
export default function Side({teamId, updateMatch, score, setScore, stageAlign}) {
    const [stage, setStage] = useState(0);
    const [teamName, setTeamName] = useState("");
    const [scoreColor, setScoreColor] = useState("");
    const navigate = useNavigate();
    const [isDialogOpen, setIsOpen] = useState(false)

    useEffect(() => {
        invoke('request_team_name', {teamId: teamId})
            .then((name: any) => {
                setTeamName(name)
            })
            .catch((error => {
                console.error(error)
            }))
    }, [teamId])

    listen(
        'score_update',
        (event_content) => {
            let payload = event_content.payload
            let configuration = payload.configuration

            if (payload["team_id"] == teamId) {
                setStage(configuration["current_stage"])
                setScore(payload["score_points"])
                setScoreColor(translateColor(configuration["score_color"]))
                updateMatch(configuration["is_stage_won"])
            }
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen("timeout_status", (event) => {
        setIsOpen(event.payload as boolean)
    })
        .catch((error) => {
            console.error(error)
            navigate("/error")
        })

    return (
        <Grid2 container spacing={3}>
            <Grid2 xs={12}>
                <Typography
                    variant="h2"
                    align={"center"}
                >
                    {teamName}
                </Typography>
            </Grid2>

            <Grid2 xs={12} mt={5}>
                <Typography align={stageAlign} variant="h6">STAGE</Typography>
                <Typography align={stageAlign} variant="h3"> {stage}</Typography>
            </Grid2>

            <Grid2 xs={12} mt={5}>
                <Paper
                    sx={{backgroundColor: scoreColor}}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            align={"center"}
                            variant="h1"
                        >
                            {score}
                        </Typography>
                    </Box>
                </Paper>
            </Grid2>

            <Grid2 xs={12}>
                <TimeOutDialog
                    isDialogOpen={isDialogOpen}
                />
            </Grid2>
        </Grid2>
    );
}
