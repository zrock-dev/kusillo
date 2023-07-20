import Side from './side';
import {Box, Stack} from '@mui/material';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";

export default function MirrorMatch() {
    const navigate = useNavigate();
    const [teamAId, setTeamAId] = useState(-1);
    const [scoreA, setScoreA] = useState(0);
    const [teamBId, setTeamBId] = useState(-1);
    const [scoreB, setScoreB] = useState(0);

    useEffect(() => {
        invoke('request_latest_contenders')
            .then((contenders: any) => {
                console.debug(`Requested contenders`, contenders)
                setTeamAId(contenders.team_a_id)
                setTeamBId(contenders.team_b_id)
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

    return (<Box>
        <Stack direction="row" spacing={5}>
            <Side
                teamId={teamAId}
                updateMatch={updateMatch}
                score={scoreA}
                setScore={setScoreA}
            />

            <Side
                teamId={teamBId}
                updateMatch={updateMatch}
                score={scoreB}
                setScore={setScoreB}
            />
        </Stack>
    </Box>);
}
