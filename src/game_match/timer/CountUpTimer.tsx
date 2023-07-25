import React, {useEffect, useRef, useState} from "react";
import TimeBox from "./TimeBox";
import {padWithZeros} from "../../Utils";
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

    let timerId
    const hasRequested = useRef(false)

    useEffect(() => {
        if (isMirror) {
            requestCurrentTime()
        } else {
            if (!hasRequested.current) {
                hasRequested.current = !hasRequested.current;
                startBackendTimer()
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

    function synchronizeClock(payload) {
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
                navigate("/error")
            })
    }

    listen("time-sync", (event) => {
        console.debug(event)
        timeUpdateListener(event.payload)
    })
        .catch((error) => {
            console.error(error)
            navigate("/error")
        })

    listen("time-out", () => {
    })
        .catch((error) => {
            console.error(error)
            navigate("/error")
        })

    function timeUpdateListener(payload) {
        console.debug(`Synchronized clock with ${payload.minutes}:${payload.seconds}`)
        synchronizeClock(payload)
        updateCurrentTime()
        updateTimeBox()
    }

    function startBackendTimer() {
        invoke('start_clock')
            .catch((error) => {
                console.error(error)
                navigate("/error")
            })
    }

    return (
        <TimeBox time={elapsedTime}/>
    );
}

export default CountUpTimer;
