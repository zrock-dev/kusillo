import * as React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import {
    Box,
    Button,
    ButtonGroup,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

function checkButtons(buttonEnabledSetters, validationFn) {
    buttonEnabledSetters.forEach((button) => {
        let {value, setter: disableButton} = button
        if (validationFn(value)) {
            disableButton(true)
        }else {
            disableButton(false)
        }
    });
}

function createButtons(variants, interactionFn) {
    return variants.map(({ isDisabled, value }, index) => (
        <Button
            key={index}
            disabled={isDisabled}
            onClick={() => interactionFn(value)}
            data-value={value}
        >
            {value}
        </Button>
    ));
}

function ButtonGroupWrapper({ buttons, interactionFn }) {
    return (
        <ButtonGroup
            orientation="vertical"
            variant="contained"
        >
            {createButtons(buttons, interactionFn)}
        </ButtonGroup>
    );
}


export default function Side({ teamId, handleStageUpdate }) {
    const navigate = useNavigate();

    const [stage, setStage] = useState(1);
    const [score, setScore] = useState(0);
    const [scoreColor, setScoreColor] = useState("");
    const [teamName, setTeamName] = useState("");

    const [canScoreUp3, setCanScoreUp3] = useState(true);
    const [canScoreUp2, setCanScoreUp2] = useState(true);
    const [canScoreUp1, setCanScoreUp1] = useState(true);

    const [canScoreDown3, setCanScoreDown3] = useState(true);
    const [canScoreDown2, setCanScoreDown2] = useState(true);
    const [canScoreDown1, setCanScoreDown1] = useState(true);

    const upButtons = [
        { isDisabled: canScoreUp1, value: +1, setter: setCanScoreUp1},
        { isDisabled: canScoreUp2, value: +2, setter: setCanScoreUp2 },
        { isDisabled: canScoreUp3, value: +3, setter: setCanScoreUp3 },
    ];

    const downButtons = [
        { isDisabled: canScoreDown1, value: -1, setter: setCanScoreDown1 },
        { isDisabled: canScoreDown2, value: -2, setter: setCanScoreDown2 },
        { isDisabled: canScoreDown3, value: -3, setter: setCanScoreDown3 },
    ];

    useEffect(() => {
        handleStageUpdate();
    }, [stage]);

    useEffect(() => {
        handleScoreUpdate()
            .catch((error) => {
                console.error(error);
                navigate("/error")
            });
    }, [score]);


    async function handleScoreUpdate() {
        let value: any = await invoke('request_configuration', { setNumber: stage, scorePoints: score });
        let maxScore = value.max_score;
        let isSetWon = value.is_set_won;
        let scoreColor = value.score_color;

        if (isSetWon) {
            setScore(0);
            setScoreColor("");
            setStage(stage + 1)
        } else {
            checkButtons(upButtons, (value): boolean => { return (score + value ) > maxScore });
            checkButtons(downButtons, (value): boolean => { return (score + value) < 0 });
            setScoreColor(scoreColor);
            await invoke('record_interaction', {setNumber: stage, teamId: teamId, scorePoints: score})
        }
    }

    function handleInteraction(value) {
        setScore(score + value);
    }

    useEffect(() => {
        console.debug("Requesting team name")
        invoke('get_team_name', {teamId: teamId})
            .then((name: any) => {
                setTeamName(name)
            })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }, [])

    return (
        <Grid2 container spacing={2}>
            <Grid2 xs={12}>
                <Typography variant="h2" gutterBottom>{teamName}</Typography>
            </Grid2>

            <Grid2 xs={12}>
                <Typography variant="h6" gutterBottom>STAGE</Typography>
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        display: 'flex',
                        backgroundColor: 'lime.lime',
                    }}
                >
                    <Typography variant="h3" gutterBottom>{stage - 1}</Typography>
                </Box>
            </Grid2>

            <Grid2 xs>
                <Box position="relative">
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <ButtonGroupWrapper buttons={upButtons} interactionFn={handleInteraction} />
                    </Box>
                    <Box
                        sx={{
                            width: 201,
                            height: 190,
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h1">{score}</Typography>
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                        }}
                    >
                        <ButtonGroupWrapper buttons={downButtons} interactionFn={handleInteraction} />
                    </Box>
                </Box>
            </Grid2>
        </Grid2>
    );
}
