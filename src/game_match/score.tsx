import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import {Box, Button, ButtonGroup, Typography} from "@mui/material";

function checkButtons(buttonEnabledSetters: any, validationFn: any) {
    buttonEnabledSetters.forEach((button: any) => {
        let {value, setter: disableButton} = button
        if (validationFn(value)) {
            disableButton(true)
        } else {
            disableButton(false)
        }
    });
}

function createButtons(variants: any, interactionFn: any) {
    // @ts-ignore
    return variants.map(({isDisabled, value}, index) => (
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

// @ts-ignore
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

function translateColor(color: string): string{
    switch (color) {
        case "blue": return '#0000ff';
        case "orange": return '#ffa500';
        case "pink": return '#ffc0cb';
        case "red": return '#ff0000';
        default: return '#0000ff';
    }
}

// @ts-ignore
export default function Score ({ gameId, teamId, setStage, updateMatch }){
    const navigate = useNavigate();

    const [maxScore, setMaxScore] = useState(3);
    const [score, setScore] = useState(0);
    const [scoreColor, setScoreColor] = useState("");

    const [canScoreUp3, setCanScoreUp3] = useState(true);
    const [canScoreUp2, setCanScoreUp2] = useState(true);
    const [canScoreUp1, setCanScoreUp1] = useState(true);
    const [canScoreDown3, setCanScoreDown3] = useState(true);
    const [canScoreDown2, setCanScoreDown2] = useState(true);
    const [canScoreDown1, setCanScoreDown1] = useState(true);
    const upButtons = [
        {isDisabled: canScoreUp1, value: +1, setter: setCanScoreUp1},
        {isDisabled: canScoreUp2, value: +2, setter: setCanScoreUp2},
        {isDisabled: canScoreUp3, value: +3, setter: setCanScoreUp3},
    ];
    const downButtons = [
        {isDisabled: canScoreDown1, value: -1, setter: setCanScoreDown1},
        {isDisabled: canScoreDown2, value: -2, setter: setCanScoreDown2},
        {isDisabled: canScoreDown3, value: -3, setter: setCanScoreDown3},
    ];

    useEffect(() => {
        invoke('request_configuration', {gameId: gameId, teamId: teamId})
            .then((payload: any) => {
                updateMatch(payload.isGameWon as boolean, payload.isStageWon as boolean)
                setMaxScore(payload.score as number)
                setScoreColor(translateColor(payload.color as string))
                let stage = payload.currentStage as number;
                setStage(stage)
                checkInteractions()
                recordInteraction(stage)
            })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    },[score])

    function checkInteractions() {
        checkButtons(upButtons, (value: number): boolean => {
            return (score + value) > maxScore
        });
        checkButtons(downButtons, (value: number): boolean => {
            return (score + value) < 0
        });
    }

    function handleInteraction(value: number) {
        setScore(score + value);
    }

    function recordInteraction(stage: number){
        invoke('record_interaction', {setNumber: stage, teamId: teamId, scorePoints: score})
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    return (
        <Box>
            <ButtonGroupWrapper buttons={upButtons} interactionFn={handleInteraction}/>
            <Box
                sx={{
                    width: 201,
                    height: 190,
                    backgroundColor: {scoreColor},
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h1">{score}</Typography>
            </Box>
            <ButtonGroupWrapper buttons={downButtons} interactionFn={handleInteraction}/>
        </Box>
    );
}
