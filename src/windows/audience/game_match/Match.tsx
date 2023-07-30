import Side from './Side';
import {Box, Divider, Stack} from '@mui/material';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import CountUpTimer from "../../shared/clock/CountUpTimer";

export default function Match() {
    const navigate = useNavigate();
    const [teamA, setTeamA] = useState(undefined);
    const [teamB, setTeamB] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

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
            .finally(() => setIsLoading(false));
    }, [])

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                        team={teamA}
                        stageAlign={"left"}
                    />

                    <Side
                        team={teamB}
                        stageAlign={"right"}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}
