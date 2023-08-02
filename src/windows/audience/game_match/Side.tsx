import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, Stack} from "@mui/material";
import {listen} from '@tauri-apps/api/event'
import {useNavigate} from "react-router-dom";
import {invoke} from "@tauri-apps/api/tauri";
import TimeOutDialog from "../../shared/timeout/TimeOutDialog";
import Score from "./Score";
import TeamCard from "../utils/TeamCard";

function translateColor(color: string): string {
    switch (color) {
        case "blue":
            return '#ffffff';
        case "orange":
            return '#ffff00';
        case "pink":
            return '#ff0000';
        case "red":
            return '#ff0000';
        default:
            return '#ffffff';
    }
}

// @ts-ignore
export default function Side({team, nameAlignment}) {
    const navigate = useNavigate();

    const [scoreColor, setScoreColor] = useState("")
    const [score, setScore] = useState(0)

    const [teamId, setTeamId] = useState(-1)
    const [isDialogOpen, setIsOpen] = useState(false)

    useEffect(() => {
        let id = team["id"]
        setTeamId(id)

        invoke('request_game_init_data', {teamId: id})
            .then((payload: any) => {
                setScore(payload["score"] as number)
                setScoreColor(translateColor(payload["score_color"] as string))
            })
            .catch((error => {
                console.error(error)
            }))

    }, [team])

    listen(
        'score_update',
        (event: any) => {
            let payload = event["payload"]
            if (payload["team_id"] == teamId) {
                setScore(payload["score"] as number)
                setScoreColor(translateColor(payload["score_color"] as string))
            }
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen(
        'stage_reset',
        () => {
            setScore(0)
            setScoreColor(translateColor("blue"))
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen(
        'game_won',
        () => {
            setScore(0)
            setScoreColor(translateColor("blue"))
        })
        .catch((error) => {
            console.error(error);
            navigate('/error');
        })

    listen("timeout_status", (event) => {
        let payload = event["payload"] as any
        setIsOpen(payload as boolean)
    })
        .catch((error) => {
            console.error(error)
            let errorMessage = encodeURIComponent(error.message)
            navigate(`/error?message=${errorMessage}`)
        })

    return (
        <Box>
            <Stack direction={"column"} spacing={2}>
                <TeamCard
                    teamName={team["name"]}
                    teamColor={team["color"]}
                    alignment={nameAlignment}
                />

                <Score
                    fontColor={scoreColor}
                    score={score}
                />
            </Stack>
            <TimeOutDialog
                isDialogOpen={isDialogOpen}
            />
        </Box>
    );
}
