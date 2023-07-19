import * as React from 'react';
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography
} from '@mui/material';

export default function Home() {
    const navigate = useNavigate();
    const [gameId, setGameId] = React.useState(-1);
    const hasMadeMatch = React.useRef(false);

    React.useEffect(() => {
        if (!hasMadeMatch.current){
            hasMadeMatch.current = true;
            invoke('make_match', {teamAId: 1, teamBId: 2})
                .then((id) => {
                    setGameId(id as number);
                    console.debug(`Requested game ID: ${id}`)
                })
                .catch((error) => {
                    console.log(error)
                    navigate("/error")
                })
        }
    }, [])

    return (
        <Container>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h2" component="div">
                    Kusillo
                </Typography>
            </Box>
            <Button onClick={() => navigate("/match", {state: {gameId}}) }>
                Match
            </Button>
        </Container>
    );
}
