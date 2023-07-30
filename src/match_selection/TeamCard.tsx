import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @ts-ignore
function TeamCard({ teamName, teamColor}) {

    const style = {
        backgroundColor: teamColor,
        height: '30px',
        width: '100%',
    };

    return (
        <Stack>
            <div style={style}/>

            <Box
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                <Typography
                    variant="h4"
                    align="left"
                >
                    {teamName}
                </Typography>
            </Box>
        </Stack>
    );
}

export default TeamCard;
