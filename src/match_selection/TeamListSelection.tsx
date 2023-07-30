import {
    Box,
    Button,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import ChosenTeamCard from "./TeamCard";

// @ts-ignore
function TeamsList({teams, handler}) {
    return (
        <List sx={{width: '100%', bgcolor: 'background.paper'}}>
            {teams.map((team: any) => {
                const labelId = `checkbox-list-label-${team.id}`;

                return (
                    <ListItem
                        key={team.id}
                    >
                        <ListItemButton onClick={() => {
                            handler(team)
                        }}>
                            <ListItemText id={labelId} primary={`${team.name}`}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    )
}

// @ts-ignore
function TeamListSelection({handleMatchStart}) {
    const defaultTeam = {
        name: "",
        id: -1.
    }

    const defaultTeams = [{}]

    const navigate = useNavigate();

    const [teamA, setTeamA] = useState(defaultTeam);
    const [teamB, setTeamB] = useState(defaultTeam);
    const [teams, setTeams] = useState(defaultTeams)
    const [contestants, setContestants] = useState([]);

    // TODO: since the react is not in strict mode a guardian is not needed
    const hasRequested = useRef(false)
    const [areTeamsLoaded, setAreTeamsLoaded] = useState(false)
    const [canStartMatch, setCanStartMatch] = useState(true);

    useEffect(() => {
        if (!hasRequested.current) {
            hasRequested.current = false;
            invoke('request_teams')
                .then((teams: any) => {
                    setTeams(teams)
                })
                .catch((error) => {
                    console.error(error)
                    navigate("/error")
                })
                .finally(() => {
                    setAreTeamsLoaded(true)
                })
        }
    }, []);

    useEffect(() => {

    }, [contestants]);

    function updateContestants() {
        let teamAValue = contestants[0];
        let teamBValue = contestants[1];

        if (teamAValue !== undefined) {
            setTeamA(teamAValue);
        }

        if (teamBValue !== undefined) {
            setTeamB(teamBValue);
        }
    }

    function handleItemClick(team: never) {
        if (contestants.length < 2) {
            contestants.push(team)
        } else {
            contestants.shift()
            contestants.push(team)
        }

        updateContestants()
        setCanStartMatch(contestants.length < 2)
    }

    if (!areTeamsLoaded) {
        return (
            <Box>
                Loading...
            </Box>
        )
    }

    return (
        <Container
            sx={{
                marginTop: '10px',
            }}
        >
            <Grid2 container>
                <Grid2 xs={6} container>
                    <TeamsList
                        teams={teams}
                        handler={handleItemClick}
                    />
                </Grid2>

                <Grid2 xs={6} container>
                    <Grid2 xs={12}>
                        <ChosenTeamCard teamName={teamA.name}/>
                    </Grid2>
                    <Grid2 xs={12}>
                        <Typography variant={"h3"} align={"center"}>
                            VS
                        </Typography>
                    </Grid2>
                    <Grid2 xs={12}>
                        <ChosenTeamCard teamName={teamB.name}/>
                    </Grid2>
                </Grid2>

                <Grid2 xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            onClick={() => {
                                handleMatchStart(teamA.id, teamB.id)
                            }}
                            variant={"contained"}
                            disabled={canStartMatch}
                        >
                            Start Match
                        </Button>
                    </Box>
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default TeamListSelection
