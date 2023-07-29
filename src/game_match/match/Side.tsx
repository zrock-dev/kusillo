import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Score from "./Score";
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import TimeOutBox from "../timeout/TimeOutBox";
import {listen} from "@tauri-apps/api/event";
import SetTransitionDialog from "../transitions/SetTransition";

// @ts-ignore
export default function Side({ gameId, teamId, score, setScore, maxScore, setMaxScore }) {
    const navigate = useNavigate()
    const [stage, setStage] = useState(0)
    const [teamName, setTeamName] = useState("")

    const [confirmationDialogStatus, setConfirmationDialogStatus] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")

    useEffect(() => {
        initTeamData()
    }, [])

    function initTeamData() {
        invoke('request_game_init_data', {teamId: teamId})
            .then((payload: any) => {
                setTeamName(payload["team_name"] as string)
                setMaxScore(payload["max_score"] as number)
            })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    listen(
        'stage_update',
        (event) => {
            let payload = event["payload"]
            // @ts-ignore
            if (payload["team_id"] == teamId) {
                // @ts-ignore
                setStage(payload["stage_number"] as number)
                // @ts-ignore
                setMaxScore(payload["max_score"] as number)

                setConfirmationDialogStatus(true)
                setDialogMessage(`Team ${teamName} has won the set #${stage}`)
            }
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    function handleCancel(){
        setConfirmationDialogStatus(false)
        navigate('/match-select');
    }

    function handleAccept(){
        setConfirmationDialogStatus(false)
    }

    return (
        <Grid2 container spacing={5}>
            <SetTransitionDialog
                isDialogOpen={confirmationDialogStatus}
                message={dialogMessage}
                confirmationHandler={handleAccept}
                cancelHandler={handleCancel}
            />
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
