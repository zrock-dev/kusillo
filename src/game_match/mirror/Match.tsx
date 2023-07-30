import Side from './Side';
import {Box, Divider, Stack} from '@mui/material';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import CountUpTimer from "../clock/CountUpTimer";

export default function Match() {
    const navigate = useNavigate();
    const [teamA, setTeamA] = useState(undefined);
    const [teamB, setTeamB] = useState(undefined);

    useEffect(() => {
        invoke('request_latest_contenders')
            .then((contenders: any) => {
                setTeamA(contenders["team_a"])
                setTeamB(contenders["team_b"])
            })
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
    }, [])


    return (
        <Box
            sx={{
                marginTop: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Stack>
                <CountUpTimer isMirror={true}/>
                <Divider flexItem/>
                <Stack direction="row" spacing={5}>
                    <Side
                        teamId={teamA}
                        stageAlign={"left"}
                    />

                    <Side
                        teamId={teamB}
                        stageAlign={"right"}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}
