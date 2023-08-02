import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @ts-ignore
function TeamCard({ teamName, teamColor, alignment: nameAlignment}) {
    let fontColor = 'white'

    if (teamColor == '#ffffff'){
        fontColor = 'black'
    }

    const style = {
        backgroundColor: teamColor,
        width: '100%',
    };

    const fontStyle = {
        fontSize: 70,
        color: fontColor,
        align: nameAlignment
    }

    return (
        <Stack>
            <div style={style}>
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <span style={fontStyle}>
                        {teamName}
                    </span>
                </Box>
            </div>
        </Stack>
    );
}

export default TeamCard;
