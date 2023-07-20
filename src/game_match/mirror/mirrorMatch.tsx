import Side from './side';
import {Box, Stack} from '@mui/material';
import {useState} from "react";

export default function MirrorMatch() {
    const [teamAId, setTeamAId] = useState(-1);
    const [scoreA, setScoreA] = useState(0);
    const [stageA, setStageA] = useState(0);

    const [teamBId, setTeamBId] = useState(-1);
    const [scoreB, setScoreB] = useState(0);
    const [stageB, setStageB] = useState(0);

    const updateMatch = (isGameWon: boolean, isStageWon: boolean) => {
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
