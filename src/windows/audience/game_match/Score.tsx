import { Box } from "@mui/material";
import {padWithZeros} from "../../../Utils";

function Score({fontColor, score}: any) {
    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        width: '100%',
    };

    const fontStyle = {
        fontSize: 510,
        color: fontColor
    }

    return (
        <Box
            sx={style}
        >
            <span style={fontStyle}>
                {padWithZeros(score, 2)}
            </span>
        </Box>
    );
}

export default Score