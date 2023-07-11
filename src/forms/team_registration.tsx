import React from 'react';
import { useFormik } from 'formik';
import {Button, MenuItem, Select} from '@mui/material';
import { TextField } from '@mui/material';
import "./form.css"
import { invoke } from "@tauri-apps/api/tauri";
import {validationSchema} from "./validation_scheme";

async function save_team(teamName: String, teamCategory: String){
    await invoke("save_team", {name: teamName, category: teamCategory})
}

const TeamRegistrationForm = () => {
    const {values, handleBlur, touched, errors, handleSubmit, handleChange} = useFormik({
        initialValues: {
            teamName: '',
            teamCategory: '',
            playerFirstName: '',
            playerLastName: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <div>
            <h1>Team registration </h1>
            <form onSubmit={handleSubmit}>
                <TextField
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
                
                <TextField
                    id="playerFirstName"
                    name="playerFirstName"
                    label="Player First Name"
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

                <Button color="primary" variant="contained" type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default TeamRegistrationForm;
