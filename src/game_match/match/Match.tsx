import React, {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import {useLocation, useNavigate} from 'react-router-dom';
import Side from './Side';
import {Box, Button, Divider, Stack} from '@mui/material';
import CountUpTimer from "../clock/CountUpTimer";
import {listen} from "@tauri-apps/api/event";
import GameTransitionDialog from "../transitions/GameTransition";

export default function Match() {
    const navigate = useNavigate();

    const location = useLocation();
    const {gameId} = location.state;
    const [maxScore, setMaxScore] = useState(3);

    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [teamAId, setTeamAId] = useState(-1);
    const [teamBId, setTeamBId] = useState(-1);

    const [isLoading, setIsLoading] = useState(true);
    const [canOpenSpectatorWindow, setCanOpenSpectatorWindow] = useState(false);

    const [dialogStatus, setDialogStatus] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")

    useEffect(() => {
        if (gameId == -1) {
            updateContenders()
        }
    }, [gameId]);

    listen(
        'game_won',
        (event) => {
            setDialogStatus(true)
            // @ts-ignore
            setDialogMessage(`Game won by: ${event["payload"]["winner_name"]}`)
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    function handleAccept(){
        setDialogStatus(false)
        navigate('/match-select');
    }

    function updateContenders() {
        invoke('request_contenders', {gameId: gameId})
            .then((contestants: any) => {
                setTeamAId(contestants["team_a_id"] as number);
                setTeamBId(contestants["team_b_id"] as number);
            })
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
            .finally(() => setIsLoading(false));
    }

    function handleOpenSpectatorWindow() {
        invoke('open_spectator_window', {teamAId: teamAId, teamBId: teamBId})
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
        setCanOpenSpectatorWindow(true)
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <Stack>
                <CountUpTimer isMirror={false}/>
                <Divider flexItem/>
                <Stack direction="row">
                    <Side
                        gameId={gameId}
                        teamId={teamAId}
                        score={scoreA}
                        setScore={setScoreA}
                        maxScore={maxScore}
                        setMaxScore={setMaxScore}
                    />
                    <Side
                        gameId={gameId}
                        teamId={teamBId}
                        score={scoreB}
                        setScore={setScoreB}
                        maxScore={maxScore}
                        setMaxScore={setMaxScore}
                    />
                </Stack>
                <Button
                    onClick={handleOpenSpectatorWindow}
                    disabled={canOpenSpectatorWindow}
                >
                    Spectator window
                </Button>
            </Stack>
            <GameTransitionDialog
                isDialogOpen={dialogStatus}
                message={dialogMessage}
                confirmationHandler={handleAccept}
            />
        </Box>
    );
}
