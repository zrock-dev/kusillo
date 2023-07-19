import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Score from "./score";
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";


// @ts-ignore
export default function Side({ gameId, teamId, updateMatch, score, setScore }) {
    const navigate = useNavigate();
    const [stage, setStage] = useState(0);
    const [teamName, setTeamName] = useState("");

    useEffect(() => {
        updateTeamName()
    }, [])

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
        <Grid2 container spacing={2}>
            <Grid2 xs={12}>
                <Typography variant="h2" gutterBottom>{teamName}</Typography>
            </Grid2>

            <Grid2 xs={12}>
                <Typography variant="h6" gutterBottom>STAGE</Typography>
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        backgroundColor: 'lime.lime',
                    }}
                >
                    <Typography variant="h3" gutterBottom>{stage}</Typography>
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
                />
            </Grid2>
        </Grid2>
    );
}
