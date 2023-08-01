import { Box, Button, DialogActions } from "@mui/material";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import GameTransitionDialog from "../shared/transitions/GameTransitionDialog";
import StageTransitionDialog from "../shared/transitions/SetTransitionDialog";

function StageDialogActions(){
    const navigate = useNavigate()

    function handleContinue() {
        requestStageDialogClose()
    }

    function requestStageDialogClose() {
        invoke("request_stage_dialog_close")
            .catch((error: any) => {
                console.error(error)
                let errorMessage = encodeURIComponent(error)
                navigate(`/error?message=${errorMessage}`)
            })
    }

    return(
        <DialogActions>
            <Button onClick={handleContinue} autoFocus>
                Continue
            </Button>
        </DialogActions>
    )
}

function GameDialogActions(){
    const navigate = useNavigate()

    function handleContinue(){
        requestGameDialogClose()
        navigate('/match-select');
    }

    function requestGameDialogClose() {
        invoke("request_game_dialog_close")
            .catch((error: any) => {
                console.error(error);
                navigate('/error');
            })
    }

    return(
        <DialogActions>
            <Button onClick={handleContinue} autoFocus>
                Continue
            </Button>
        </DialogActions>
    )
}

function Transitions() {
    return (
        <Box>
            <StageTransitionDialog
                DialogActions={StageDialogActions}
            />
            <GameTransitionDialog
                DialogActions={GameDialogActions}
            />
        </Box>
    )
}

export default Transitions