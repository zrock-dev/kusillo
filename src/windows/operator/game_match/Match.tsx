import React, {useEffect, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import {useNavigate} from 'react-router-dom';
import Side from './Side';
import {Box, Button, Divider, Stack} from '@mui/material';
import CountUpTimer from "../../shared/clock/CountUpTimer";
import StartMatchDialog from "../utils/StartMatchDialog";

export default function Match() {
    const navigate = useNavigate();

    const [teamA, setTeamA] = useState(undefined);
    const [teamB, setTeamB] = useState(undefined);
    const [gameId, setGameId] = useState(-1)

    const [isLoading, setIsLoading] = useState(true);

    const [isAudienceWindowOpen, setIsAudienceWindowOpen] = useState(false);
    const [isMatchStartDialogOpen, setIsMatchStartDialogOpen] = useState(true)

    useEffect(() => {
        updateContenders()
    }, [gameId]);

    function updateContenders() {
        invoke('request_latest_contenders')
            .then((contestants: any) => {
                setGameId(contestants["game_id"])
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
        invoke('open_spectator_window')
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })

        setIsAudienceWindowOpen(true)
    }

    function handleStartMatch() {
        setIsMatchStartDialogOpen(false)
        startClock()
    }

    function startClock() {
        invoke('start_clock')
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <StartMatchDialog
                open={isMatchStartDialogOpen}
                setOpen={setIsMatchStartDialogOpen}
                continueHandler={handleStartMatch}
            />
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
                    disabled={isAudienceWindowOpen}
                >
                    Open Spectator Window
                </Button>
            </Stack>
        </Box>
    );
}
