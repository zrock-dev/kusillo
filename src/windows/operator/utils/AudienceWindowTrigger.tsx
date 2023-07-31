import {Button} from "@mui/material";
import {invoke} from "@tauri-apps/api";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const AudienceWindowTrigger = React.memo(({ isGameStarted }: { isGameStarted: any }) => {
    const navigate = useNavigate();
    const [isAudienceWindowOpen, setIsAudienceWindowOpen] = useState(false);

    useEffect(() => {
        console.debug("Verifying window status");
        invoke("is_audience_window_open")
            .then((isAudienceWindowOpen: any) => {
                console.debug("Is audience window open? :", isAudienceWindowOpen);
                if (isAudienceWindowOpen) {
                    checkOnAudienceWindow();
                    setIsAudienceWindowOpen(true);
                }
            })
            .catch((error) => {
                console.error(error);
                navigate("/error");
            });
    }, [isGameStarted]);

    function handleOpenSpectatorWindow() {
        invoke("open_audience_window")
            .then(() => {
                checkOnAudienceWindow();
            })
            .catch((error: any) => {
                console.error(error);
                navigate("/error");
            });

        setIsAudienceWindowOpen(true);
    }

    function checkOnAudienceWindow() {
        invoke("check_on_audience_window").catch((error) => {
            console.error(error);
            navigate("/error");
        });
    }

    return (
        <Button variant={"contained"} onClick={handleOpenSpectatorWindow} disabled={isAudienceWindowOpen}>
            Open Spectator Window
        </Button>
    );
});

export default AudienceWindowTrigger;
