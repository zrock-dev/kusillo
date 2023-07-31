import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import * as React from 'react';

// @ts-ignore
export default function StartMatchDialog({open, continueHandler}) {

    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Match Start Confirmation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ready to start the match?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={continueHandler} autoFocus>
                       Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}