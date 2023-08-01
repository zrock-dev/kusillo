import React, {useState} from "react";
import {Box, Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import {listen} from "@tauri-apps/api/event";
import {useNavigate} from "react-router-dom";

// @ts-ignore
function StageTransitionDialog({DialogActions}) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")

    listen(
        'stage_dialog_status',
        (event: any) => {
            let payload = event["payload"] as any

            setIsOpen(payload["status"])
            if(payload["status"]){
                setMessage(`Team ${payload["team_name"]} has won the set #${payload["game_set"]}`)
            }
        })
        .catch((error: any) => {
            console.error(error)
            let errorMessage = encodeURIComponent(error)
            navigate(`/error?message=${errorMessage}`)
        })

    return (
        <Dialog open={isOpen}>
            <DialogTitle>
                <Typography
                    align={"center"}
                    variant="h3"
                >
                    Set update
                </Typography>
            </DialogTitle>
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

export default StageTransitionDialog
