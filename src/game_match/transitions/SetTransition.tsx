import React from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, Stack, Typography} from "@mui/material";

// @ts-ignore
function SetTransitionDialog({isDialogOpen, message, confirmationHandler, cancelHandler}) {

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
                            Set update
                        </Typography>
                        <Typography
                            align={"center"}
                            variant="h4"
                        >
                            {message}
                        </Typography>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={cancelHandler}>
                    Cancel
                </Button>
                <Button onClick={confirmationHandler} autoFocus>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SetTransitionDialog
