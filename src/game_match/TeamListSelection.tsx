import {
    Box,
    Button,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon, ListItemText,
    Stack,
    Typography
} from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Grid2 from "@mui/material/Unstable_Grid2";

function ChosenTeamCard({ teamName }){
    return(
        <Box
            sx={{
                width: 297,
                height: 81,
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

function TeamsList({ teams, handler}){
    return(
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {teams.map((team) => {
                const labelId = `checkbox-list-label-${team.id}`;

                return (
                    <ListItem
                        key={team.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="comments">
                                <CommentIcon />
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton role={undefined} onClick={handler(team)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    // checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${team.name}`} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    )
}

function TeamListSelection(){
    const defaultTeam = {
        name: "",
        id: -1.
    }

    const defaultTeams = [{}]

    const navigate = useNavigate();
    const [teamA, setTeamA] = useState(defaultTeam);
    const [teamB, setTeamB] = useState(defaultTeam);
    const [teams, setTeams] = useState(defaultTeams)

    function fetchTeams(): any{
       invoke('request_teams')
           .then((teams: any) => {
               setTeams(teams)
           })
           .catch((error) => {
               console.error(error)
               navigate("/error")
           })
    }

    function handleMatchStart(){}

    function handleItemClick(team) {
        if (teamA.id === -1) {
            setTeamA(team);
        } else if (teamB.id === -1) {
            setTeamB(team);
        }
    }

    return(
        <Box>
            <Grid2>
               <Grid2 xs={6}>
                   <TeamsList
                       teams={teams}
                       handler={handleItemClick}
                   />
               </Grid2>
                <Grid2 xs={6}>
                    <Stack>
                        <ChosenTeamCard teamName={ teamA.name }/>
                        <Typography variant={"h1"}>VS</Typography>
                        <ChosenTeamCard teamName={ teamB.name }/>
                    </Stack>

                    <Button onClick={handleMatchStart}>
                       Start Match
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    )
}