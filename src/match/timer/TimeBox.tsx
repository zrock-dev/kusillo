import React from "react";
import {Box, Typography} from "@mui/material";


// @ts-ignore
function TimeBox({ time }){
    return (
        <Box>
            <Typography
                variant="h2"
                align={"center"}
            >
                {time.minutes}:{time.seconds}
            </Typography>
        </Box>
    );
}

export default TimeBox;