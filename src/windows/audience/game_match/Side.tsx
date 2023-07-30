import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Paper, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {listen} from '@tauri-apps/api/event'
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import TimeOutDialog from "../../shared/timeout/TimeOutDialog";

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
export default function Side({ team, stageAlign }) {
    const navigate = useNavigate();

    const [stage, setStage] = useState(0);
    const [scoreColor, setScoreColor] = useState("");
    const [score, setScore] = useState(0)

    const [teamName, setTeamName] = useState("");
    const [isDialogOpen, setIsOpen] = useState(false)

    useEffect(() => {
        invoke('request_game_init_data', {teamId: team.id})
            .then((payload: any) => {
                setScore(payload["score"] as number)
                setScoreColor(translateColor(payload["score_color"] as string))
            })
            .catch((error => {
                console.error(error)
            }))

        setTeamName(team.name)
    }, [team])

    listen(
        'score_update',
        (event: any) => {
            let payload = event["payload"]
            if (payload["team_id"] == team) {
                setScore(payload["score"] as number)
                setScoreColor(translateColor(payload["score_color"] as string))
            }
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen(
        'stage_update',
        (event: any) => {
            let payload = event["payload"]
            if (payload["team_id"] == team) {
                setStage(payload["stage_number"] as number)
            }
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen(
        'stage_reset',
        () => {
            setScore(0)
            setScoreColor(translateColor("blue"))
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen(
        'game_won',
        () => {
            setStage(0)
            setScore(0)
            setScoreColor(translateColor("blue"))
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen("timeout_status", (event) => {
        let payload = event["payload"] as any
        setIsOpen(payload as boolean)
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
