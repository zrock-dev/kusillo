import React from 'react';
import { useFormik } from 'formik';
import {Container, TextField} from '@mui/material';
import { invoke } from "@tauri-apps/api/tauri";
import {validationSchema} from "./validations/team_schema";
import {
    Button,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import Grid2 from "@mui/material/Unstable_Grid2";
import PlayerRegistrationList from "./player_registration";


async function save_team(teamName: String, teamCategory: String){
    await invoke("save_team", {name: teamName, category: teamCategory})
}

const TeamRegistrationForm = () => {
    const {values, handleBlur, touched, errors, handleSubmit, handleChange} = useFormik({
        initialValues: {
            teamName: '',
            teamCategory: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
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
                    <PlayerRegistrationList />
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
