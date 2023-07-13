import React, {useEffect, useRef, useState} from 'react';
import { useFormik } from 'formik';
import {validationSchema} from "./validations/team_schema";
import Grid2 from "@mui/material/Unstable_Grid2";
import PlayerRegistrationList from "./player_registration";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import {
    Button,
    MenuItem,
    Select,
    Typography,
    TextField, Container, Stack
} from '@mui/material';

import { enqueueSnackbar } from 'notistack';


export default function TeamRegistrationForm() {
    const navigate = useNavigate();
    const [teamIdentifier, setTeamIdentifier] = useState(-1);
    const hasRequested = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id: number = await invoke('create_team');
                setTeamIdentifier(id);
            } catch (error) {
                enqueueSnackbar(`${error}`, {variant: "error"})
                navigate("/error")
            }
        };

        if (hasRequested.current){
            hasRequested.current = false;
            fetchData();
        }
    }, []);

    async function submitToDatabase(values){
        try {
            let can_submit = await invoke("can_submit_team", {teamId: teamIdentifier});

            if (can_submit) {
                let {teamName, teamCategory} = values;
                await invoke("update_team", {name: teamName, category: teamCategory, teamId: teamIdentifier});
                enqueueSnackbar(`Team: ${teamName}, has been registered`, {variant: "info"})
                navigate("/");
            }else {
                enqueueSnackbar("Team size is invalid", {variant: "warning"})
            }
        }
        catch (error){
            enqueueSnackbar(`${error}`, {variant: "error"})
        }
    }

    const {values, handleBlur, touched, errors, handleSubmit, handleChange} = useFormik({
        initialValues: {
            teamName: '',
            teamCategory: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {submitToDatabase(values)},
    });

    const handleCancel = () => {
        invoke('cancel_registration', {teamId: teamIdentifier})
            .then((_) => {
                enqueueSnackbar("Entry has been deleted", {variant: "warning"})
                navigate("/");
            })
            .catch((error) => {
                enqueueSnackbar(`${error}`, {variant: "error"})
            });
    }

    return (
        <Container>
            <Typography variant="h3">Team Registration Form</Typography>
            <form onSubmit={handleSubmit}>
                <Grid2>
                    <Grid2 xs={12}>
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={4}
                        >
                            <TextField
                                fullWidth
                                id="teamName"
                                name="teamName"
                                label="Team Name"
                                type="text"
                                value={values.teamName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.teamName && Boolean(errors.teamName)}
                                helperText={touched.teamName && errors.teamName}
                            />
                            <Select
                                id="teamCategory"
                                name="teamCategory"
                                label="Category"
                                type="text"
                                value={values.teamCategory}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.teamCategory && Boolean(errors.teamCategory)}
                                // helperText={touched.teamCategory && errors.teamCategory}
                            >
                                <MenuItem value={"First"}>First</MenuItem>
                                <MenuItem value={"Second"}>Second</MenuItem>
                            </Select>
                        </Stack>
                    </Grid2>

                    <Grid2>
                        <PlayerRegistrationList id = { teamIdentifier } />
                    </Grid2>

                    <Grid2 xs={12}>
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={4}
                        >
                            <Button  color="primary" variant="contained" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" type="submit">
                                Submit
                            </Button>
                        </Stack>
                    </Grid2>
                </Grid2>
            </form>
        </Container>
    );
};
