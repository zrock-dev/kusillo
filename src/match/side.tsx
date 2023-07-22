import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Score from "./score";
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import TimeOutBox from "./timeout/TimeOutBox";

// @ts-ignore
export default function Side({gameId, teamId, updateMatch, score, setScore, maxScore, setMaxScore}) {
    const navigate = useNavigate();
    const [stage, setStage] = useState(0);
    const [teamName, setTeamName] = useState("");

    useEffect(() => {
        updateTeamName()
    }, [])


    useEffect(() => {
        invoke('request_max_score', {gameId: gameId})
            .then((score: any) => {
                setMaxScore(score)
            })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }, [stage])

    function updateTeamName() {
        invoke('request_team_name', {teamId: teamId})
            .then((name: any) => {
                setTeamName(name)
            })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

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
                    setStage={setStage}
                    updateMatch={updateMatch}
                    score={score}
                    setScore={setScore}
                    maxScore={maxScore}
                />
            </Grid2>
            <Grid2 xs={12}>
                <TimeOutBox/>
            </Grid2>
        </Grid2>
    );
}
