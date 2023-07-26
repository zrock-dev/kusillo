import React, {useEffect, useRef, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import {useLocation, useNavigate} from 'react-router-dom';
import Side from './Side';
import {Box, Button, Divider, Stack} from '@mui/material';
import CountUpTimer from "../clock/CountUpTimer";
import {listen} from "@tauri-apps/api/event";
import {enqueueSnackbar} from "notistack";

export default function Match() {
    const navigate = useNavigate();

    const location = useLocation();
    const {gameId} = location.state;
    const [maxScore, setMaxScore] = useState(3);
    const hasFetchedContenders = useRef(false);

    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [teamAId, setTeamAId] = useState(-1);
    const [teamBId, setTeamBId] = useState(-1);

    const [isLoading, setIsLoading] = useState(true);
    const [canOpenSpectatorWindow, setCanOpenSpectatorWindow] = useState(false);

    useEffect(() => {
        if (!hasFetchedContenders.current) {
            updateContenders()
            hasFetchedContenders.current = true;
        }
    }, []);

    listen(
        'reset_stage',
        (_) => {
            resetScores()
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen(
        'game_won',
        (_) => {
            resetScores()
            enqueueSnackbar("Game won", {variant: "success"})
            navigate('/match-select');
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

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

    function resetScores() {
        setScoreA(0)
        setScoreB(0)
    }

    function handleOpenSpectatorWindow() {
        invoke('open_spectator_window', {teamAId: teamAId, teamBId: teamBId})
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
        setCanOpenSpectatorWindow(true)
    }

    function start_clock() {
        invoke('start_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
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
        </Box>
    );
}
