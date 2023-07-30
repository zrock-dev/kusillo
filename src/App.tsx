import {BrowserRouter, Route, Routes} from "react-router-dom";
import * as React from 'react';
import Home from "./Home";
import TeamRegistrationForm from "./forms/team_registration";
import ErrorPage from "./errors/error_page";
import MatchSelect from "./windows/shared/MatchSelect";
import OperatorWindow from "./windows/operator/OperatorWindow";
import AudienceWindow from "./windows/audience/AudienceWindow";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}>
                    <Route path="team-form" element={<TeamRegistrationForm/>}/>
                    <Route path="match-select" element={<MatchSelect/>}/>
                    <Route path="error" element={<ErrorPage/>}/>
                </Route>
                <Route path="/operator-window" element={<OperatorWindow/>}/>
                <Route path="/audience_window" element={<AudienceWindow/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
