import React from "react";
import {Box, Dialog, DialogContent, Stack, Typography} from "@mui/material";

// @ts-ignore
function TimeOutDialog({ isDialogOpen }) {

    return (
        <Dialog open={isDialogOpen}>
            <DialogContent>
                <Box
                    sx={{
                        width: 500,
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Stack spacing={3}>
                        <Typography
                            align={"center"}
                            variant="h3"
                        >
                            Timeout
                        </Typography>
                        <Typography
                            align={"center"}
                            variant="h4"
                        >
                            TIME OUT !!!
                        </Typography>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default TimeOutDialog
