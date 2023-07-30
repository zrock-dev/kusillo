import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {MuiColorInput} from 'mui-color-input';
import Grid2 from '@mui/material/Unstable_Grid2';

// @ts-ignore
function ChosenTeamCard({teamName}) {
    const [boxColor, setBoxColor] = React.useState('#ffffff');

    const handleBoxColorUpdate = (newValue: string) => {
        setBoxColor(newValue);
    };

    const style = {
        backgroundColor: boxColor,
        height: '30px',
        width: '100%',
    };

    return (
        <Box>
            <Grid2 container>
               <Grid2 xs={12}>
                   <Stack>
                       <MuiColorInput value={boxColor} onChange={handleBoxColorUpdate}/>
                       <div style={style}/>
                   </Stack>
               </Grid2>

                <Grid2 xs={12}>
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
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default ChosenTeamCard;
