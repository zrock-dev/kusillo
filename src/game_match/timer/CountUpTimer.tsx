import React, {useEffect, useState} from "react";
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
function CountUpTimer() {
    const navigate = useNavigate();
    const [elapsedTime, setElapsedTime] = useState(defaultElapsedTime)
    const currentTime = {
        seconds: 0,
        minutes: 0,
    }

    let timerId

    useEffect(() => {
        requestCurrentTime()
        startTimer()
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
        updateTimeBox()
    }

    function synchronizeClock(payload){
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

    function startTimer() {
        timerId = setInterval(() => {
         updateCurrentTime()
        }, 1000)
    }

    function stopTimer(){
        clearInterval(timerId)
    }

    listen("time-sync", timeUpdateListener)
        .catch((error) => {
            console.error(error)
            navigate("/error")
        })

    listen("time-out", () => {stopTimer()})
        .catch((error) => {
            console.error(error)
            navigate("/error")
        })

    function timeUpdateListener(payload) {
        synchronizeClock(payload)
        updateCurrentTime()
    }

    return (
        <TimeBox time={elapsedTime}/>
    );
}

export default CountUpTimer;
