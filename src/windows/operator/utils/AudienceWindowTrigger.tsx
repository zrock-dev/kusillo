import {Button} from "@mui/material";
import {invoke} from "@tauri-apps/api";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function AudienceWindowTrigger({matchStatus: matchStartedStatus}: any) {
    const navigate = useNavigate()
    const [isAudienceWindowOpen, setIsAudienceWindowOpen] = useState(false);

    useEffect(() => {
    }, []);

    useEffect(() => {
        if (matchStartedStatus) {
            if (askAudienceWindowOpen()){
                checkOnAudienceWindow()
                setIsAudienceWindowOpen(true)
            }
        }

    }, [matchStartedStatus]);

    function handleOpenSpectatorWindow() {
        invoke('open_audience_window')
            .then(() => {
                checkOnAudienceWindow()
            })
            .catch((error: any) => {
                console.error(error);
                navigate('/error');
            })

        setIsAudienceWindowOpen(true)
    }

    function askAudienceWindowOpen(): boolean{
        invoke('is_audience_window_open')
            .then((isAudienceWindowOpen: any) => {
                return isAudienceWindowOpen
            })
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
        return false
    }

    function checkOnAudienceWindow(){
        invoke('check_on_audience_window')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    return (
        <Button
            variant={"contained"}
            onClick={handleOpenSpectatorWindow}
            disabled={isAudienceWindowOpen}
        >
            Open Spectator Window
        </Button>
    )
}

export default AudienceWindowTrigger