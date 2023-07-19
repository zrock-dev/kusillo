import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
    Button,
    Stack,
    Paper
} from "@mui/material";
import { useFormik } from "formik";
import { validationSchema } from "./validations/player_schema";
import { Delete } from '@mui/icons-material';

import { invoke } from "@tauri-apps/api/tauri";
import { enqueueSnackbar } from 'notistack';
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";


const PlayerForm = ({ addPlayer, handleCancel }) => {
    const { values, handleBlur, touched, errors, handleSubmit, handleChange } = useFormik({
        initialValues: {
            playerFirstName: '',
            playerLastName: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            addPlayer(values.playerFirstName, values.playerLastName);
            enqueueSnackbar(`Player ${values.playerFirstName} added`, {variant: "info"})
            resetForm();
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <DialogContent>
                <DialogContentText>
                    Fill in the following fields to register a player.
                </DialogContentText>
                <Divider/>
                <Box
                    sx={{
                        height: 250,
                        alignItems: 'center',
                    }}
                >
                    <Stack
                        direction="column"
                        justifyContent="space-evenly"
                        spacing={2}
                    >
                        <TextField
                            id="playerFirstName"
                            name="playerFirstName"
                            label="First name"
                            type="text"
                            value={values.playerFirstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.playerFirstName && Boolean(errors.playerFirstName)}
                            helperText={touched.playerFirstName && errors.playerFirstName}
                        />

                        <TextField
                            id="playerLastName"
                            name="playerLastName"
                            label="Last Name"
                            type="text"
                            value={values.playerLastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.playerLastName && Boolean(errors.playerLastName)}
                            helperText={touched.playerLastName && errors.playerLastName}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <Divider/>
            <DialogActions>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={4}
                >
                <Button onClick={handleCancel} variant="outlined">
                    Close
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Add Player
                </Button>
                </Stack>
            </DialogActions>
        </form>
    )
};

export default function PlayerRegistrationList({ id }) {
    const [players, setPlayers] = useState([]);
    const [isDialogOpen, setOpen] = useState(false);

    const addPlayerToList = (firstName, lastName) => {
        invoke('insert_player', {firstName: firstName, lastName: lastName, teamId: id})
            .then((id) => {
                const newPlayer = { id, firstName, lastName };
                setPlayers([...players, newPlayer]);
                handleOpenDialog()
            })
            .catch((error) => {
                enqueueSnackbar(`${error}`, {variant: "error"})
            })
    };

    const handleOpenDialog = () => {
        invoke('can_append_player', {teamId: id})
            .then((canAdd) => {
                if (canAdd == true){
                    setOpen(true);
                }else {
                    setOpen(false)
                    enqueueSnackbar("Max amount of players reached", {variant: "warning"})
                }
            })
            .catch((error) => {
                enqueueSnackbar(`${error}`, {variant: "error"})
            })
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleRemovePlayer = (playerID) => {
        invoke('remove_player', {id: playerID})
            .then((_) => {
                const updatedPlayers = players.filter((player) => player.id !== playerID);
                setPlayers(updatedPlayers);
            })
            .catch((error) => {
                enqueueSnackbar(`${error}`, {variant: "error"})
            })
    };

    return (
        <Grid2>
            <Grid2>
                <Typography variant="h5">Registered Players:</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    Add Player
                </Button>
            </Grid2>

            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={isDialogOpen}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Player Registration</DialogTitle>
                <PlayerForm addPlayer={addPlayerToList} handleCancel={handleCloseDialog} />
            </Dialog>

            <Grid2>
                <Box
                    sx={{
                        height: 500,
                        alignItems: 'center',
                    }}
                >
                    <Paper elevation={24}>
                    <List>
                        {players.map((player) => (
                            <ListItem
                                key={player.id}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleRemovePlayer(player.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`${player.firstName} ${player.lastName}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    </Paper>
                </Box>
            </Grid2>
        </Grid2>
    );
}

