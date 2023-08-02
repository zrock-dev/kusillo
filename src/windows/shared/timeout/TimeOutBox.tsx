import React, {useState} from "react";
import {Box, Checkbox, Stack, Typography} from "@mui/material";
import TimeOutCounter from "./TimeOutCounter";
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";
import {listen} from "@tauri-apps/api/event";

// @ts-ignore
function TimeOutBox() {
    const navigate = useNavigate();
    const [isDialogOpen, setIsOpen] = useState(false)
    const [box1Status, setBox1] = useState(false)
    const [box2Status, setBox2] = useState(false)
    const [box3Status, setBox3] = useState(false)

    // @ts-ignore
    function handleTimeoutStart(checkBoxSetter) {
        checkBoxSetter((prevValue: any) => !prevValue);
        requestTimeOut()
    }

    function handleTimeoutFinished() {
        requestTimeOutFinish()
    }

    function requestTimeOut(){
        invoke('request_timeout' )
            .catch((error) => {
                console.error(error)
                let errorMessage = encodeURIComponent(error)
                navigate(`/error?message=${errorMessage}`)
            })
    }

    function requestTimeOutFinish(){
        invoke('request_timeout_finish' )
            .catch((error) => {
                console.error(error)
                let errorMessage = encodeURIComponent(error)
                navigate(`/error?message=${errorMessage}`)
            })
    }

    listen("timeout_status", (event) => {
        setIsOpen(event["payload"] as boolean)
    })
        .catch((error) => {
            console.error(error)
            let errorMessage = encodeURIComponent(error)
            navigate(`/error?message=${errorMessage}`)
        })

    listen(
        'stage_reset',
        (_) => {
            setBox1(false)
            setBox2(false)
            setBox3(false)
        })
        .catch((error) => {
            console.error(error)
            let errorMessage = encodeURIComponent(error)
            navigate(`/error?message=${errorMessage}`)
        })

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
                                handleTimeoutStart(setBox1)
                            }}/>
                        <Checkbox
                            {...label}
                            sx={{'& .MuiSvgIcon-root': {fontSize: 30}}}
                            disabled={box2Status}
                            checked={box2Status}
                            onChange={() => {
                                handleTimeoutStart(setBox2)
                            }}/>
                        <Checkbox
                            {...label}
                            sx={{'& .MuiSvgIcon-root': {fontSize: 30}}}
                            disabled={box3Status}
                            checked={box3Status}
                            onChange={() => {
                                handleTimeoutStart(setBox3)
                            }}/>
                    </Stack>
                </Stack>
            </Box>
            <TimeOutCounter
                isDialogOpen={isDialogOpen}
                handleDialogClose={handleTimeoutFinished}
            />
        </Box>
    );
}

export default TimeOutBox;
