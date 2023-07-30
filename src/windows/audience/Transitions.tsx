import {Box, DialogContent} from "@mui/material";
import GameTransitionDialog from "../shared/transitions/GameTransitionDialog";
import StageTransitionDialog from "../shared/transitions/SetTransitionDialog";

function Transitions() {
    return (
        <Box>
            <StageTransitionDialog
                DialogActions={DialogContent}
            />
            <GameTransitionDialog
                DialogActions={DialogContent}
            />
        </Box>
    )
}

export default Transitions