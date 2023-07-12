import React, {useEffect, useState} from 'react';
import { useFormik } from 'formik';
import {Container, TextField} from '@mui/material';
import {validationSchema} from "./validations/team_schema";
import {
    Button,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import Grid2 from "@mui/material/Unstable_Grid2";
import PlayerRegistrationList from "./player_registration";

import { invoke } from "@tauri-apps/api/tauri";


const TeamRegistrationForm = () => {
    const [teamIdentifier, setTeamIdentifier] = useState(-1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id: number = await invoke('create_team');
                setTeamIdentifier(id);
            } catch (error) {
                console.error(error);
                setTeamIdentifier(-1);
            }
        };
        fetchData();
        console.log(`Team ID from team_registration: ${teamIdentifier}`)
    }, []);

    async function submitToDatabase(values){
        try {
            let can_submit = await invoke("can_submit_team", {teamId: teamIdentifier});
            if (can_submit) {
                let {teamName, teamCategory} = values;
                await invoke("update_team", {name: teamName, category: teamCategory, teamId: teamIdentifier});
                console.log("Successful update");
            }else {
                console.log("The team does not meet the required amount of players")
            }
        }
        catch (error){
            console.error(error);
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
            .then((_) => {console.log("Entry has been deleted!!!")})
            .catch((error) => {console.error(error)});
    }

    return (
        <Container>
            <Typography variant="h3">Team Registration Form</Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 xs={6}>
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
                    </Grid2>
                    <Grid2 xs={6}>
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
                    </Grid2>
                </Grid2>

                <Grid2 xs={12}>
                    <PlayerRegistrationList id = {teamIdentifier} />
                </Grid2>

                <Grid2 xs={8}>
                    <Button  color="primary" variant="contained" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button color="primary" variant="contained" type="submit">
                        Submit
                    </Button>
                </Grid2>
            </form>
        </Container>
    );
};

export default TeamRegistrationForm;
