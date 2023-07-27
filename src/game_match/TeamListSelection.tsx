import {Box, Button, Container, List, ListItem, ListItemButton, ListItemText, Stack, Typography} from "@mui/material";
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2";

function ChosenTeamCard({teamName}) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography
                variant={"h2"}
                align={"center"}
            >
                {teamName}
            </Typography>
        </Box>
    )
}

function TeamsList({teams, handler}) {
    return (
        <List sx={{width: '100%', bgcolor: 'background.paper'}}>
            {teams.map((team) => {
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

function TeamListSelection() {
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

    const hasRequested = useRef(false)
    const [areTeamsLoaded, setAreTeamsLoaded] = useState(false)

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

    function handleMatchStart() {
    }

    function handleItemClick(team) {
        if (contestants.length < 2) {
            contestants.push(team)
        } else {
            contestants.shift()
            contestants.push(team)
        }

        updateContestants()
    }

    if (!areTeamsLoaded) {
        return (
            <Box>
                Daddy we are loading
            </Box>
        )
    }

    return (
        <Container
            sx={{
                marginTop: '200px',
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
                        <Typography variant={"h3"} align={"center"}>VS</Typography>
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
                        <Button onClick={handleMatchStart} variant={"contained"}>
                            Start Match
                        </Button>
                    </Box>
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default TeamListSelection
