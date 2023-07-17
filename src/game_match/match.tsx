import * as React from 'react';
import { invoke } from "@tauri-apps/api/tauri";
import {useEffect, useRef, useState} from "react";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import Side from "./side";

export default function Match(){
    const [teamAId, setTeamAId] = useState(-1);
    const [teamBId, setTeamBId] = useState(-1);
    const navigate = useNavigate();
    const hasFetchedContenders = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let object = await invoke('request_contenders');
                let teamBId = object.team_b_id;
                let teamAId = object.team_a_id;
                setTeamAId(teamAId)
                setTeamBId(teamBId)

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
                console.log(`Game won status: ${isGameWon}`)
                if (isGameWon){
                    enqueueSnackbar("The game has been won", {variant:"success"})
                    navigate("/home")
                }
            })
            .catch((error) => {
                console.error(error);
                enqueueSnackbar(`${error.toString()}`, {variant: "error"})
                navigate("/error")
            })
    }


    return(
        <Side
            team_id={teamAId}
            handleStageUpdate={handleStageUpdate}
        />
    );
}