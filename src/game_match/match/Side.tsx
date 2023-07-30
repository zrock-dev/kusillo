import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Score from "./Score";
import {useNavigate} from "react-router-dom";
import TimeOutBox from "../timeout/TimeOutBox";
import {listen} from "@tauri-apps/api/event";
import { invoke } from '@tauri-apps/api/tauri';

// @ts-ignore
export default function Side({ gameId, team}) {
    const navigate = useNavigate()

    const [stage, setStage] = useState(0)
    const [maxScore, setMaxScore] = useState(3)

    const [teamName, setTeamName] = useState("")
    const [teamId, setTeamId] = useState(-1)

    useEffect(() => {
        setTeamId(team["id"])
        setTeamName(team["name"])
        requestMaxScore()
    }, [])

    function requestMaxScore() {
        // TODO: The backend has to make an stage update when the side is being initialized
        invoke('request_game_init_data', {teamId: teamId})
            .then((payload: any) => {
                setMaxScore(payload["max_score"] as number)
            })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    listen(
        'stage_update',
        (event: any) => {
            let payload = event["payload"]

            if (payload["team_id"] == teamId) {
                let set_number = payload["stage_number"] as number
                setStage(set_number)
            }
            setMaxScore(payload["max_score"] as number)
        })
        .catch((error) => {
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
                    }}
                >
                    <Typography variant="h3"> {stage}</Typography>
                </Box>
            </Grid2>

            <Grid2 xs>
                <Score
                    gameId={gameId}
                    teamId={teamId}
                    // TODO: Why can't the Score handle the maxScore itself?
                    maxScore={maxScore}
                />
            </Grid2>
            <Grid2 xs={12}>
                <TimeOutBox/>
            </Grid2>
        </Grid2>
    );
}
