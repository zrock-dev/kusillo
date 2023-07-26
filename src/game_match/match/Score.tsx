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
            {value}
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

// @ts-ignore
export default function Score({gameId, teamId, score, setScore, maxScore}) {
    const navigate = useNavigate();
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
        initTeamData()
    }, [])

    useEffect(() => {
        recordInteraction(score)
        handleScoreUpdate()
        checkInteractions()
    }, [score]);

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

    function recordInteraction(score: number) {
        invoke('record_interaction', {teamId: teamId, gameId: gameId, scorePoints: score})
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    function handleScoreUpdate(){
        invoke('handle_score_update', { gameId: gameId, teamId: teamId })
            .catch((error => {
                console.error(error)
                navigate("/error")
            }))
    }

    listen(
        'score_update',
        (event) => {
            let payload = event.payload
            if (payload["team_id"] == teamId) {
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
