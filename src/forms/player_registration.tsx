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
    Button
} from "@mui/material";
import { useFormik } from "formik";
import { validationSchema } from "./validations/player_schema";
import { Delete } from '@mui/icons-material';

import { invoke } from "@tauri-apps/api/tauri";
import { enqueueSnackbar } from 'notistack';



const PlayerForm = ({ addPlayer, handleCancel }) => {
    const { values, handleBlur, touched, errors, handleSubmit, handleChange } = useFormik({
        initialValues: {
            playerFirstName: '',
            playerLastName: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            addPlayer(values.playerFirstName, values.playerLastName);
            resetForm();
        },
    });

    return (
        <form onSubmit={handleSubmit}>
            <DialogContent>
                <DialogContentText>
                    Fill in the following fields to register a player.
                </DialogContentText>
                <TextField
                    id="playerFirstName"
                    name="playerFirstName"
                    label="Player first name"
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
                    label="Player Last Name"
                    type="text"
                    value={values.playerLastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.playerLastName && Boolean(errors.playerLastName)}
                    helperText={touched.playerLastName && errors.playerLastName}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant="outlined">
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Add Player
                </Button>
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
        <div>
            <Typography variant="h5">Registered Players:</Typography>

            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Add Player
            </Button>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Player Registration</DialogTitle>
                <PlayerForm addPlayer={addPlayerToList} handleCancel={handleCloseDialog} />
            </Dialog>

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
        </div>
    );
}
