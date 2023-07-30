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
    const [teamA, setTeamA] = useState(undefined);
    const [teamB, setTeamB] = useState(undefined);

    const [isLoading, setIsLoading] = useState(true);
    const [canOpenSpectatorWindow, setCanOpenSpectatorWindow] = useState(false);

    const [gameDialogStatus, setGameDialogStatus] = useState(false)
    const [gameDialogMessage, setGameDialogMessage] = useState("")


    useEffect(() => {
        if (gameId == -1) {
            updateContenders()
        }
    }, [gameId]);

    listen(
        'game_won',
        (event) => {
            setGameDialogStatus(true)
            // @ts-ignore
            setGameDialogMessage(`Game won by: ${event["payload"]["winner_name"]}`)
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    function handleAccept(){
        setGameDialogStatus(false)
        navigate('/match-select');
    }

    function updateContenders() {
        invoke('request_contenders', {gameId: gameId})
            .then((contestants: any) => {
                setTeamA(contestants["team_a"]);
                setTeamB(contestants["team_b"]);
            })
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
            .finally(() => setIsLoading(false));
    }

    function handleOpenSpectatorWindow() {
        invoke('open_spectator_window', {gameId: gameId})
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
                        team={teamA}
                    />
                    <Side
                        gameId={gameId}
                        team={teamB}
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
                isDialogOpen={gameDialogStatus}
                message={gameDialogMessage}
                confirmationHandler={handleAccept}
            />
        </Box>
    );
}
