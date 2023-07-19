import { Button } from "@mui/material";
import {useLocation, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <Button onClick={() => navigate(-1) }>
                Go Back
            </Button>
        </div>
    );
}
