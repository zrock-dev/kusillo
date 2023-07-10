import React from 'react';
import { Form, SubmitButton, TextField } from 'formik-material';
import "./form.css"
import { invoke } from "@tauri-apps/api/tauri";

async function save_team(teamName: String, teamCategory: String){
    await invoke("save_team", {name: teamName, category: teamCategory})
}

export default function TeamRegistrationForm()  {
    const initialValues = {
        team_name: '',
        team_category: '',
        player_first_name: '',
        player_last_name: '',
    };

    return (
        <Form
            initialValues={initialValues}
            onSubmitForm={(values, formikHelpers) => {
                const { team_name, team_category, player_first_name, player_last_name } = values;
                save_team(team_name, team_category)
                formikHelpers.setSubmitting(false);
            }}
        >
            <h1>Team Registration Esse</h1>
            <TextField name="team_name" label="Team Name:" variant="outlined" />
            <TextField name="team_category" label="Category" variant="outlined" />

            <TextField name="player_first_name" label="Player First Name" variant="outlined" />
            <TextField name="player_last_name" label="Player Last Name" variant="outlined" />

            <SubmitButton>Submit</SubmitButton>
        </Form>
    );
};
