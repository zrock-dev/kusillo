import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Paper, Stack, Typography} from "@mui/material";
import {listen} from '@tauri-apps/api/event'
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import TimeOutDialog from "../../shared/timeout/TimeOutDialog";
import TeamCard from "../../../match_selection/TeamCard";
import {padWithZeros} from "../../../Utils";

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
export default function Side({team, stageAlign, nameAlignment}) {
    const navigate = useNavigate();

    const [stage, setStage] = useState(0)
    const [scoreColor, setScoreColor] = useState("")
    const [score, setScore] = useState(0)

    const [teamId, setTeamId] = useState(-1)
    const [isDialogOpen, setIsOpen] = useState(false)

    useEffect(() => {
        let id = team["id"]
        setTeamId(id)

        invoke('request_game_init_data', {teamId: id})
            .then((payload: any) => {
                setScore(payload["score"] as number)
                setScoreColor(translateColor(payload["score_color"] as string))
            })
            .catch((error => {
                console.error(error)
            }))

    }, [team])

    listen(
        'score_update',
        (event: any) => {
            let payload = event["payload"]
            if (payload["team_id"] == teamId) {
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
            if (payload["team_id"] == teamId) {
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
            let errorMessage = encodeURIComponent(error.message)
navigate(`/error?message=${errorMessage}`)
        })

    return (
        <Box>
            <Stack direction={"column"} spacing={2}>
                <TeamCard
                    teamName={team["name"]}
                    teamColor={team["color"]}
                    alignment={nameAlignment}
                />

                <Stack direction={'column'}>
                    <Typography align={stageAlign} variant="h4">STAGE</Typography>
                    <Typography align={stageAlign} variant="h2">
                        {padWithZeros(stage, 2)}
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        sx={{backgroundColor: scoreColor}}
                    >
                            <span style={{
                                fontSize: 240
                            }}>
                                {padWithZeros(score, 2)}
                            </span>
                    </Paper>
                </Box>
            </Stack>
            <TimeOutDialog
                isDialogOpen={isDialogOpen}
            />
        </Box>
    );
}
