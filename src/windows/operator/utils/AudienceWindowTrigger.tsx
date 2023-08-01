import {Button} from "@mui/material";
import {invoke} from "@tauri-apps/api";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const AudienceWindowTrigger = React.memo(({ isGameStarted }: { isGameStarted: any }) => {
    const navigate = useNavigate();
    const [isAudienceWindowOpen, setIsAudienceWindowOpen] = useState(false);

    useEffect(() => {
        invoke("is_audience_window_open")
            .then((isAudienceWindowOpen: any) => {
                if (isAudienceWindowOpen) {
                    checkOnAudienceWindow();
                    setIsAudienceWindowOpen(true);
                }
            })
            .catch((error) => {
                console.error(error)
                let errorMessage = encodeURIComponent(error)
                navigate(`/error?message=${errorMessage}`)
            });
    }, [isGameStarted]);

    function handleOpenSpectatorWindow() {
        invoke("open_audience_window")
            .then(() => {
                checkOnAudienceWindow();
            })
            .catch((error: any) => {
                console.error(error)
                let errorMessage = encodeURIComponent(error)
                navigate(`/error?message=${errorMessage}`)
            });

        setIsAudienceWindowOpen(true);
    }

    function checkOnAudienceWindow() {
        invoke("check_on_audience_window").catch((error) => {
            console.error(error)
            let errorMessage = encodeURIComponent(error)
            navigate(`/error?message=${errorMessage}`)
        });
    }

    return (
        <Button variant={"contained"} onClick={handleOpenSpectatorWindow} disabled={isAudienceWindowOpen}>
            Open Spectator Window
        </Button>
    );
});

export default AudienceWindowTrigger;
