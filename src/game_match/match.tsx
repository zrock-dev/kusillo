import React, { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Side from './side';

export default function Match() {
    const [teamAId, setTeamAId] = useState(-1);
    const [teamBId, setTeamBId] = useState(-1);
    const navigate = useNavigate();
    const hasFetchedContenders = useRef(false);
    const [isLoading, setIsLoading] = useState(true); // New state variable for loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                let contestants: any = await invoke('request_contenders');
                setTeamAId(contestants.team_a_id);
                setTeamBId(contestants.team_b_id);
                console.debug('Successful contenders request');
            } catch (error) {
                console.error(error);
                enqueueSnackbar(`${error.toString()}`, { variant: 'error' });
                navigate('/error');
            } finally {
                setIsLoading(false); // Mark the loading as complete
            }
        };

        if (!hasFetchedContenders.current) {
            fetchData();
            hasFetchedContenders.current = true;
        }
    }, []);

    const handleStageUpdate = () => {
        invoke('is_game_won')
            .then((isGameWon) => {
                if (isGameWon) {
                    enqueueSnackbar('Game won', { variant: 'success' });
                    navigate('/home');
                }
            })
            .catch((error) => {
                console.error(error);
                enqueueSnackbar(`${error.toString()}`, { variant: 'error' });
                navigate('/error');
            });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <Side teamId={teamAId} handleStageUpdate={handleStageUpdate} />;
}
