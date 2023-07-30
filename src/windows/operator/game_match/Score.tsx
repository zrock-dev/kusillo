import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import {Box, Button, ButtonGroup, Paper, Typography} from "@mui/material";
import {listen} from "@tauri-apps/api/event";

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
            {value["operation"]}
        </Button>
    ));
}

// @ts-ignore
function ButtonGroupWrapper({buttons, interactionFn}) {
    return (
        <ButtonGroup
            orientation="vertical"
            variant="contained"
        >
            {createButtons(buttons, interactionFn)}
        </ButtonGroup>
    );
}

function translateColor(color: string): string {
    switch (color) {
        case "blue":
            return 'info.light';
        case "orange":
            return 'warning.light';
        case "pink":
            return 'secondary.light';
        case "red":
            return 'error.light';
        default:
            return 'info.light';
    }
}

enum ButtonOperationType {
    UP, DOWN
}

// @ts-ignore
export default function Score({gameId, teamId, maxScore}) {
    const navigate = useNavigate();

    const [scoreColor, setScoreColor] = useState("");
    const [score, setScore] = useState(-1)

    const [canScoreUp3, setCanScoreUp3] = useState(true);
    const [canScoreUp2, setCanScoreUp2] = useState(true);
    const [canScoreUp1, setCanScoreUp1] = useState(true);
    const [canScoreDown3, setCanScoreDown3] = useState(true);
    const [canScoreDown2, setCanScoreDown2] = useState(true);
    const [canScoreDown1, setCanScoreDown1] = useState(true);
    const upButtons = [
        {isDisabled: canScoreUp1, value: {operation: +1, operationType: ButtonOperationType.UP}, setter: setCanScoreUp1},
        {isDisabled: canScoreUp2, value: {operation: +2, operationType: ButtonOperationType.UP}, setter: setCanScoreUp2},
        {isDisabled: canScoreUp3, value: {operation: +3, operationType: ButtonOperationType.UP}, setter: setCanScoreUp3},
    ];
    const downButtons = [
        {isDisabled: canScoreDown1, value: {operation: -1, operationType: ButtonOperationType.DOWN}, setter: setCanScoreDown1},
        {isDisabled: canScoreDown2, value: {operation: -2, operationType: ButtonOperationType.DOWN}, setter: setCanScoreDown2},
        {isDisabled: canScoreDown3, value: {operation: -3, operationType: ButtonOperationType.DOWN}, setter: setCanScoreDown3},
    ];

    const [currentButtonType, setCurrentButtonType] = useState(ButtonOperationType.DOWN);

    useEffect(() => {
        initTeamData()
    }, [])

    useEffect(() => {
        recordInteraction(score)
        handleScoreUpdate()
        checkInteractions()
    }, [score]);

    function checkInteractions() {
        checkButtons(upButtons, (value: any): boolean => {
            return (score + value["operation"]) > maxScore
        });
        checkButtons(downButtons, (value: any): boolean => {
            return (score + value["operation"]) < 0
        });
    }

    function handleInteraction(value: any) {
        setCurrentButtonType(value["operationType"])
        setScore(score + value["operation"]);
    }

    function recordInteraction(score: number) {
        invoke('record_interaction', {teamId: teamId, gameId: gameId, scorePoints: score})
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    function handleScoreUpdate(){
        let isButtonUp = (currentButtonType == ButtonOperationType.UP)
        invoke('handle_score_update', { gameId: gameId, teamId: teamId, isUpButton: isButtonUp })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    listen(
        'score_update',
        (event) => {
            let payload = event["payload"]
            // @ts-ignore
            if (payload["team_id"] == teamId) {
                // @ts-ignore
                setScoreColor(translateColor(payload["score_color"] as string))
            }
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    function initTeamData() {
        invoke('request_game_init_data', {teamId: teamId})
            .then((payload: any) => {
                setScoreColor(translateColor(payload["score_color"] as string))
            })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    listen(
        'stage_reset',
        (_) => {
            setScore(0)
            setScoreColor(translateColor("blue"))
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ButtonGroupWrapper buttons={upButtons} interactionFn={handleInteraction}/>
            <Paper
                sx={{backgroundColor: scoreColor}}
            >
                <Box
                    sx={{
                        width: 201,
                        height: 190,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h1">{score}</Typography>
                </Box>
            </Paper>
            <ButtonGroupWrapper buttons={downButtons} interactionFn={handleInteraction}/>
        </Box>
    );
}
