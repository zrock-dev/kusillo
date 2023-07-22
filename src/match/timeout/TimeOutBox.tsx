import React, {useEffect, useState} from "react";
import {Box, Checkbox, Dialog, DialogContent, Stack, Typography} from "@mui/material";
import {padWithZeros} from "../../Utils";

const defaultElapsedTime = {
    seconds: "00",
    minutes: "00",
}

// @ts-ignore
function TimeOutDialog({isOpen, handleDialogClose}) {
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
        console.debug(`seconds restarted ${currentTime.seconds}`)
    }

    useEffect(() => {
        if (isOpen) {
            const intervalId = setInterval(() => {
                currentTime.seconds = currentTime.seconds + 1
                updateTimeBox()
                if (currentTime.seconds >= 60) {
                    resetTimer()
                    clearInterval(intervalId)
                    handleDialogClose()
                }
            }, 1000)
            return () => {
                clearInterval(intervalId)
            }
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen}>
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

// @ts-ignore
function TimeOutBox() {
    const [isOpen, setIsOpen] = useState(false)
    const [box1Status, setBox1] = useState(false)
    const [box2Status, setBox2] = useState(false)
    const [box3Status, setBox3] = useState(false)

    // @ts-ignore
    function handleTimeoutConsume(checkBoxSetter) {
        checkBoxSetter((prevValue: any) => !prevValue);
        setIsOpen(true)
    }

    function handleDialogClose() {
        setIsOpen(false)
    }

    const label = {inputProps: {'aria-label': 'Checkbox demo'}};
    return (
        <Box
            sx={{
                display: 'flex',
                align: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    border: 1,
                    display: 'flex',
                    align: 'center',
                    justifyContent: 'center',
                    width: 300,
                }}
            >
                <Stack>
                    <Typography variant={"h5"} align={"center"}> Time Out </Typography>
                    <Stack direction={"row"}>
                        <Checkbox
                            {...label}
                            sx={{'& .MuiSvgIcon-root': {fontSize: 30}}}
                            disabled={box1Status}
                            checked={box1Status}
                            onChange={() => {
                                handleTimeoutConsume(setBox1)
                            }}/>
                        <Checkbox
                            {...label}
                            sx={{'& .MuiSvgIcon-root': {fontSize: 30}}}
                            disabled={box2Status}
                            checked={box2Status}
                            onChange={() => {
                                handleTimeoutConsume(setBox2)
                            }}/>
                        <Checkbox
                            {...label}
                            sx={{'& .MuiSvgIcon-root': {fontSize: 30}}}
                            disabled={box3Status}
                            checked={box3Status}
                            onChange={() => {
                                handleTimeoutConsume(setBox3)
                            }}/>
                    </Stack>
                </Stack>
            </Box>
            <TimeOutDialog
                isOpen={isOpen}
                handleDialogClose={handleDialogClose}
            />
        </Box>
    );
}

export default TimeOutBox;
