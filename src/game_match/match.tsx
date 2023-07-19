import React, {useEffect, useRef, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import {useLocation, useNavigate} from 'react-router-dom';
import Side from './side';
import {Box, Stack} from '@mui/material';

export default function Match() {
    const navigate = useNavigate();

    const location = useLocation();
    const {gameId} = location.state;
    const [teamAId, setTeamAId] = useState(-1);
    const [teamBId, setTeamBId] = useState(-1);
    const hasFetchedContenders = useRef(false);

    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!hasFetchedContenders.current) {
            updateContenders()
            hasFetchedContenders.current = true;
        }
    }, []);

    const updateMatch = (isGameWon: boolean, isStageWon: boolean) => {
        if (isGameWon){
            resetScores()
            navigate('/home');
        }else if (isStageWon){
            resetScores()
        }
    };

    function updateContenders(){
        invoke('request_contenders', {gameId: gameId})
            .then((contestants: any) => {
                setTeamAId(contestants.team_a_id as number);
                setTeamBId(contestants.team_b_id as number);
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Box>
            <Stack direction="row" spacing={5}>
                <Side
                    gameId={gameId}
                    teamId={teamAId}
                    updateMatch={updateMatch}
                    score={scoreA}
                    setScore={setScoreA}
                />

                <Side
                    gameId={gameId}
                    teamId={teamBId}
                    updateMatch={updateMatch}
                    score={scoreB}
                    setScore={setScoreB}
                />
            </Stack>
        </Box>
    );
}
