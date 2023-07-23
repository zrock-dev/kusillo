import React, {useEffect, useState} from "react";
import TimeBox from "./TimeBox";
import {padWithZeros} from "../../Utils";
import {invoke} from "@tauri-apps/api/tauri";
import {useNavigate} from "react-router-dom";

const defaultElapsedTime = {
    seconds: "00",
    minutes: "00",
}

// @ts-ignore
function CountUpTimer({ timeoutHandler }){
    const navigate = useNavigate();
    const [elapsedTime, setElapsedTime] = useState(defaultElapsedTime)
    const currentTime = {
        seconds: 0,
        minutes: 0,
    }

    useEffect(() => {
       const intervalId = setInterval(() => {
           updateCurrentTime()
           updateTimeBox()
           let cantContinue = verifyTimeUpdate()
           if (!cantContinue){
               clearInterval(intervalId)
               timeoutHandler()
               return
           }
       }, 1000)
        return () => {clearInterval(intervalId)}
    }, [])

    function updateCurrentTime(){
        currentTime.seconds = currentTime.seconds + 1
        if (currentTime.seconds == 60){
            currentTime.minutes = currentTime.minutes + 1
            currentTime.seconds = 0
        }
    }

    function updateTimeBox(){
        setElapsedTime({
            seconds: padWithZeros(currentTime.seconds, 2),
            minutes: padWithZeros(currentTime.minutes, 2)
        })
    }

    function verifyTimeUpdate(): boolean{
        let isOnTime = true
        // invoke('is_on_time', {currentTime: currentTime.minutes})
        //     .then((isItOntime) => {isOnTime = isItOntime as boolean})
        //     .catch((error) => {
        //         console.error(error)
        //         navigate("/error")
        //     })
        return isOnTime
    }

    return(
        <TimeBox time={elapsedTime}/>
    );
}

export default CountUpTimer;
