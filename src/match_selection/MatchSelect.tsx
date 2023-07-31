import * as React from 'react';
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Divider,
    Typography
} from '@mui/material';
import TeamListSelection from './TeamListSelection';
import AudienceWindowTrigger from "../windows/operator/utils/AudienceWindowTrigger";

export default function MatchSelect() {
    const navigate = useNavigate();
    const [isGameStarted, setIsGameStarted] = React.useState(false)

    function create_clock() {
        invoke('create_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    function handleMatchStart(contenders: any) {
        setIsGameStarted(true)
        let teamA = contenders["teamA"]
        let teamB = contenders["teamB"]
        invoke('create_new_game', {
            teamAId: teamA.id,
            teamAColor: teamA.color,
            teamBId: teamB.id,
            teamBColor: teamB.color
        })
            .then(() => {
                create_clock()
                navigate("/operator-window")
            })
            .catch((error) => {
                console.error(error)
                navigate("/error")
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

            <AudienceWindowTrigger
                isGameStarted={isGameStarted}
            />
        </Box>
    );
}
