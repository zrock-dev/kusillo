import React, {useEffect, useRef, useState} from "react";
import TimeBox from "./TimeBox";
import {padWithZeros} from "../../../Utils";
import {useNavigate} from "react-router-dom";
import {listen} from "@tauri-apps/api/event";
import {invoke} from "@tauri-apps/api/tauri";

const defaultElapsedTime = {
    seconds: "00",
    minutes: "00",
}

// @ts-ignore
function CountUpTimer({isMirror}) {
    const navigate = useNavigate();
    const [elapsedTime, setElapsedTime] = useState(defaultElapsedTime)
    const currentTime = {
        seconds: 0,
        minutes: 0,
    }

    const hasRequested = useRef(false)

    useEffect(() => {
        if (isMirror) {
            requestCurrentTime()
        } else {
            if (!hasRequested.current) {
                hasRequested.current = !hasRequested.current;
                requestCurrentTime()
            }
        }
    }, [])

    function updateTimeBox() {
        setElapsedTime({
            seconds: padWithZeros(currentTime.seconds, 2),
            minutes: padWithZeros(currentTime.minutes, 2)
        })
    }

    function updateCurrentTime() {
        currentTime.seconds = currentTime.seconds + 1
        if (currentTime.seconds == 60) {
            currentTime.minutes = currentTime.minutes + 1
            currentTime.seconds = 0
        }
    }

    function synchronizeClock(payload: any) {
        currentTime.minutes = payload["minutes"] as number
        currentTime.seconds = payload["seconds"] as number
    }

    function requestCurrentTime() {
        invoke('request_current_time')
            .then((payload) => {
                synchronizeClock(payload)
                updateTimeBox()
            })
            .catch((error) => {
                console.error(error)
                let errorMessage = encodeURIComponent(error)
                navigate(`/error?message=${errorMessage}`)
            })
    }

    listen("time-sync", (event: any) => {
        timeUpdateListener(event["payload"])
    })
        .catch((error) => {
            console.error(error)
            let errorMessage = encodeURIComponent(error)
            navigate(`/error?message=${errorMessage}`)
        })

    function timeUpdateListener(payload: any) {
        synchronizeClock(payload)
        updateCurrentTime()
        updateTimeBox()
    }

    return (
        <TimeBox time={elapsedTime}/>
    );
}

export default CountUpTimer;
