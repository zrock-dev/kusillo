import * as React from 'react';
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { Button, ButtonGroup, Container } from "@mui/material";
import Box from "@mui/material/Box";

function checkButtons(buttonEnabledSetters, checkFn, currentScore) {
    buttonEnabledSetters.forEach((buttonEnabledFn) => {
        for (let interaction = 1; interaction < 4; interaction++) {
            if (!checkFn(interaction, currentScore)) {
                buttonEnabledFn(false);
            }
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

export default function Side({ team_id, handleStageUpdate }) {
    const navigate = useNavigate();
    const [stage, setStage] = useState(1);
    const [score, setScore] = useState(0);
    const [scoreColor, setScoreColor] = useState("");

    const [canScoreUp3, setCanScoreUp3] = useState(true);
    const [canScoreUp2, setCanScoreUp2] = useState(true);
    const [canScoreUp1, setCanScoreUp1] = useState(true);

    const [canScoreDown3, setCanScoreDown3] = useState(true);
    const [canScoreDown2, setCanScoreDown2] = useState(true);
    const [canScoreDown1, setCanScoreDown1] = useState(true);

    const upMap = [setCanScoreUp3, setCanScoreUp2, setCanScoreUp1];
    const downMap = [setCanScoreDown3, setCanScoreDown2, setCanScoreDown1];

    const upButtons = [
        { isDisabled: canScoreUp1, value: 1 },
        { isDisabled: canScoreUp2, value: 2 },
        { isDisabled: canScoreUp3, value: 3 },
    ];

    const downButtons = [
        { isDisabled: canScoreDown1, value: -1 },
        { isDisabled: canScoreDown2, value: -2 },
        { isDisabled: canScoreDown3, value: -3 },
    ];

    useEffect(() => {
        handleStageUpdate();
    }, [stage]);

    useEffect(() => {
        handleScoreUpdate()
            .catch((error) => {
                console.error(error);
                enqueueSnackbar(`${error.toString()}`, { variant: "error" });
            });
    }, [score]);

    async function handleScoreUpdate() {
        let { maxScore, scoreColor, isSetWon } = await invoke('request_configuration', { setNumber: stage, scorePoints: score });

        if (isSetWon) {
            setScore(0);
            setScoreColor("");
            setStage(stage + 1)
        } else {
            checkButtons(upMap, (a, b): boolean => { return a + b === maxScore }, score);
            checkButtons(downMap, (a, b): boolean => { return a - b === maxScore }, score);
            setScoreColor(scoreColor);
        }
    }

    function handleInteraction(value) {
        setScore(score + value);
    }

    return (
        <Container>
            <ButtonGroupWrapper buttons={upButtons} interactionFn={handleInteraction} />
            <ButtonGroupWrapper buttons={downButtons} interactionFn={handleInteraction} />

            <Box>SCORE: {score}</Box>
            <Box>SET: {stage}</Box>

        </Container>
    );
}
