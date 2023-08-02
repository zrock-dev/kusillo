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
        <div style={style}>

            <span style={fontStyle}>
                {padWithZeros(score, 2)}
            </span>
        </div>
    );
}

export default Score