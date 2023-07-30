import {Box} from "@mui/material";
import Transitions from "./Transitions";
import Match from "./game_match/Match";

function AudienceWindow() {
    return (
        <Box>
            <Transitions/>
            <Match/>
        </Box>
    )
}

export default AudienceWindow
