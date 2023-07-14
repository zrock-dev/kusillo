import * as React from 'react';
import { invoke } from "@tauri-apps/api/tauri";
import {useEffect, useRef, useState} from "react";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import Side from "./side";
import {bool} from "yup";


export default function Match(){
    const [teamAId, setTeamAId] = useState(-1);
    const [teamBId, setTeamBId] = useState(-1);
    const navigate = useNavigate();
    const hasFetchedContenders = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let {team_a_id, team_b_id} = await invoke('request_contenders');
                setTeamAId(team_a_id)
                setTeamBId(team_b_id)
                console.debug(`Fetched match contenders | ${team_a_id} VS ${team_b_id}`)

            }catch (error){
                console.error(error);
                enqueueSnackbar(`${error.toString()}`, {variant: "error"})
                navigate("/error")
            }
        }

        if (!hasFetchedContenders.current){
            fetchData()
            hasFetchedContenders.current = true;
        }
    },[])

    const handleStageUpdate = () => {
        invoke('is_game_won')
            .then((isGameWon) => {
                if (isGameWon){
                    enqueueSnackbar("The game has been won", {variant:"success"})
                    navigate("/")
                }
            })
            .catch((error) => {
                console.error(error);
                enqueueSnackbar(`${error.toString()}`, {variant: "error"})
                // navigate("/error")
            })
    }


    return(
        <Side
            team_id={teamAId}
            handleStageUpdate={handleStageUpdate}
        />
    );
}