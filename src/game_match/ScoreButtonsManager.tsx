import * as React from 'react';
import {useEffect} from "react";

export default function ScoreButtonsManager({up1, up2, up3, down1, down2, down3, score}){
    const upMap = new Map<number, object>;
    const downMap = new Map<number, object>;

    useEffect(() => {
        handleScoreUpdate()
    }, [score])

    function populateMaps(){
        upMap.set(1, up1);
        upMap.set(2, up2);
        upMap.set(3, up3);
        downMap.set(1, down1);
        downMap.set(2, down2);
        downMap.set(3, down3);
    }

    function handleScoreUpdate(){
        for (let interaction = 1; interaction < 4; interaction++) {

        }
    }
}