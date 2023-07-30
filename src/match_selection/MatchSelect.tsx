import * as React from 'react';
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Divider,
    Typography
} from '@mui/material';
import TeamListSelection from './TeamListSelection';

export default function MatchSelect() {
    const navigate = useNavigate();

    function create_clock() {
        invoke('create_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    function handleMatchStart(contenders: any) {
        let teamA = contenders["teamA"]
        let teamB = contenders["teamB"]
        invoke('create_new_game', {
            teamAId: teamA.id,
            teamAColor: teamA.color,
            teamBId: teamB.id,
            teamBColor: teamB.color
        })
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
            .finally(() => {
                create_clock()
                navigate("/operator-window")
            })
    }

    return (
        <Box>
            <Typography variant="h2" align={"center"}>
                Match Selection
            </Typography>
            <Divider/>

            <TeamListSelection
                handleMatchStart={handleMatchStart}
            />
        </Box>
    );
}
