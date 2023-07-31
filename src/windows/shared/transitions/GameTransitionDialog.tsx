import React, {useState} from "react";
import {
    Box,
    Dialog,
    DialogContent,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {listen} from "@tauri-apps/api/event";

// @ts-ignore
function GameTransitionDialog({ DialogActions }) {
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")

    listen(
        'game_dialog_status',
        (event: any) => {
            let payload = event["payload"] as any

            setIsOpen(payload["status"])
            if(payload["status"]){
                setMessage(`Game won by: ${payload["winner_name"]}`)
            }
        })
        .catch((error: any) => {
            console.error(error);
            navigate('/error');
        })

    return (
        <Dialog open={isOpen}>
            <DialogContent>
                <Box
                    sx={{
                        width: 500,
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        align={"center"}
                        variant="h4"
                    >
                        {message}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions/>
        </Dialog>
    );
}

export default GameTransitionDialog
