import React from 'react';
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



async function getTeamId(){
    let teamID;
    await invoke('create_team')
        .then((id) => {teamID = id})
        .catch((error) => {console.error(error)})

    return teamID;
}

const TeamRegistrationForm = () => {
    const teamID = getTeamId();

    const {values, handleBlur, touched, errors, handleSubmit, handleChange} = useFormik({
        initialValues: {
            teamName: '',
            teamCategory: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            let {teamName, teamCategory} = values;
            console.log(`Team update data: name ${teamName}, category: ${teamCategory}, team id: ${teamID}`)
            invoke("update_team", {name: teamName, category: teamCategory, teamId: teamID})
                .then((_) => {
                    alert(JSON.stringify(values, null, 2));
                })
                .catch((error) => {console.error(error)});
        },
    });

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
                    <PlayerRegistrationList teamID={1} />
                </Grid2>

                <Grid2 xs={4}>
                    <Button color="primary" variant="contained" type="submit">
                        Submit
                    </Button>
                </Grid2>
            </form>
        </Container>
    );
};

export default TeamRegistrationForm;
