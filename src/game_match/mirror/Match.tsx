import Side from './Side';
import {Box, Divider, Stack} from '@mui/material';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import CountUpTimer from "../clock/CountUpTimer";

export default function Match() {
    const navigate = useNavigate();
    const [teamAId, setTeamAId] = useState(-1);
    const [scoreA, setScoreA] = useState(0);
    const [teamBId, setTeamBId] = useState(-1);
    const [scoreB, setScoreB] = useState(0);

    useEffect(() => {
        invoke('request_latest_contenders')
            .then((contenders: any) => {
                setTeamAId(contenders["team_a_id"])
                setTeamBId(contenders["team_b_id"])
            })
            .catch((error) => {
                console.error(error);
                navigate('/error');
            })
    }, [])

    const updateMatch = (isStageWon: boolean) => {
        if (isStageWon) {
            setScoreA(0)
            setScoreB(0)
        }
    };

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
                        teamId={teamAId}
                        updateMatch={updateMatch}
                        score={scoreA}
                        setScore={setScoreA}
                        stageAlign={"left"}
                    />

                    <Side
                        teamId={teamBId}
                        updateMatch={updateMatch}
                        score={scoreB}
                        setScore={setScoreB}
                        stageAlign={"right"}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}
