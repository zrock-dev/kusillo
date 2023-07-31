import Side from './Side';
import {Box, Divider, Stack} from '@mui/material';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import CountUpTimer from "../../shared/clock/CountUpTimer";
import Grid2 from '@mui/material/Unstable_Grid2';

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
                marginTop: '5%',
                marginLeft: '5%',
                marginRight: '5%',
            }}
        >
            <Stack>
                <CountUpTimer isMirror={true}/>
                <Divider flexItem/>
                <Grid2 container spacing={5} >
                   <Grid2 xs={6}>
                       <Side
                           team={teamA}
                           stageAlign={"right"}
                       />
                   </Grid2>

                    <Grid2 xs={6}>
                        <Side
                            team={teamB}
                            stageAlign={"left"}
                        />
                    </Grid2>
                </Grid2>
            </Stack>
        </Box>
    );
}
