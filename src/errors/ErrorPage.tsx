import { Button } from "@mui/material";
import {useLocation, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const errorMessage = queryParams.get("message");

    console.log(errorMessage)

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            {errorMessage ? <p>{errorMessage}</p> : <p>Sorry, an unexpected error has occurred.</p>}
            <Button onClick={() => navigate(-1) }>
                Go Back
            </Button>
        </div>
    );
}
