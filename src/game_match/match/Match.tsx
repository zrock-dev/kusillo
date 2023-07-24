import React, {useEffect, useRef, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import {useLocation, useNavigate} from 'react-router-dom';
import Side from './Side';
import {Box, Stack, Button, Divider} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import CountUpTimer from "../timer/CountUpTimer";

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

    useEffect(() => {
        if (!hasFetchedContenders.current) {
            updateContenders()
            hasFetchedContenders.current = true;
        }
    }, []);

    const updateMatch = (isGameWon: boolean, isStageWon: boolean) => {
        if (isGameWon){
            enqueueSnackbar("Game won", {variant: "success"})
            navigate('/');
        }else if (isStageWon){
            resetScores()
        }
    };

    function updateContenders(){
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

    function resetScores(){
        setScoreA(0)
        setScoreB(0)
    }

    function handleOpenSpectatorWindow(){
        invoke('open_spectator_window', {teamAId: teamAId, teamBId: teamBId})
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    function timeOutHandler(){
        console.debug("Out of time")
    }

    return (
        <Box>
            <CountUpTimer timeoutHandler={timeOutHandler}/>
            <Divider flexItem/>
            <Stack direction="row">
                <Side
                    gameId={gameId}
                    teamId={teamAId}
                    updateMatch={updateMatch}
                    score={scoreA}
                    setScore={setScoreA}
                    maxScore={maxScore}
                    setMaxScore={setMaxScore}
                />
                <Side
                    gameId={gameId}
                    teamId={teamBId}
                    updateMatch={updateMatch}
                    score={scoreB}
                    setScore={setScoreB}
                    maxScore={maxScore}
                    setMaxScore={setMaxScore}
                />
            </Stack>
            <Button onClick={handleOpenSpectatorWindow}>
                Spectator window
            </Button>
        </Box>
    );
}
