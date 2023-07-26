import * as React from 'react';
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Typography} from '@mui/material';

export default function MatchSelect() {
    const navigate = useNavigate();
    const [gameId, setGameId] = React.useState(-1);
    const hasMadeMatch = React.useRef(false);

    function start_match() {
        invoke('create_new_game', {teamAId: 1, teamBId: 2})
            .then((id) => {
                setGameId(id as number)
            })
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })

        invoke('create_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    React.useEffect(() => {
        if (!hasMadeMatch.current) {
            hasMadeMatch.current = true;
            start_match()
        }
    }, [])

    return (
        <Container>
            <Box sx={{display: 'flex'}}>
                <Typography variant="h2" component="div">
                    Kusillo
                </Typography>
            </Box>
            <Button onClick={() => navigate("/match", {state: {gameId}})}>
                Match
            </Button>
        </Container>
    );
}
