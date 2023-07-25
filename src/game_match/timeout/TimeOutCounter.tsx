import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {padWithZeros} from "../../Utils";
import {invoke} from "@tauri-apps/api/tauri";
import {Box, Dialog, DialogContent, Stack, Typography} from "@mui/material";

const defaultElapsedTime = {
    seconds: "00",
    minutes: "00",
}

// @ts-ignore
function TimeOutCounter({ isDialogOpen, handleDialogClose}) {
    const navigate = useNavigate();
    const [elapsedTime, setElapsedTime] = useState(defaultElapsedTime)
    const currentTime = {
        seconds: 0,
        minutes: 0,
    }

    function updateTimeBox() {
        setElapsedTime({
            seconds: padWithZeros(currentTime.seconds, 2),
            minutes: padWithZeros(currentTime.minutes, 2)
        })
    }

    function resetTimer(){
        currentTime.seconds = 0
        updateTimeBox()
    }

    useEffect(() => {
        if (isDialogOpen) {
            pauseMatchTimer()
            const intervalId = setInterval(() => {
                currentTime.seconds = currentTime.seconds + 1
                updateTimeBox()
                if (currentTime.seconds >= 60) {
                    resetTimer()
                    clearInterval(intervalId)
                    resumeMatchTimer()
                    handleDialogClose()
                }
            }, 100)
            return () => {
                clearInterval(intervalId)
            }
        }
    }, [isDialogOpen])

    function pauseMatchTimer(){
        invoke('pause_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    function resumeMatchTimer(){
        invoke('start_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    return (
        <Dialog open={isDialogOpen}>
            <DialogContent>
                <Box
                    sx = {{
                        width: 500,
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Stack spacing={3}>
                        <Typography
                            align={"center"}
                            variant="h3"
                        >
                            Timeout
                        </Typography>
                        <Typography
                            align={"center"}
                            variant="h4"
                        >
                            {elapsedTime.minutes}:{elapsedTime.seconds}
                        </Typography>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default TimeOutCounter
