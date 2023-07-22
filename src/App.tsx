import {BrowserRouter, Route, Routes} from "react-router-dom";
import * as React from 'react';
import Home from "./Home";
import Match from "./match/match";
import MirrorMatch from "./match/mirror/MirrorMatch";
import TeamRegistrationForm from "./forms/team_registration";
import MatchSelect from "./match/MatchSelect";
import ErrorPage from "./errors/error_page";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="team-form" element={<TeamRegistrationForm />} />
                    <Route path="match-select" element={<MatchSelect />} />
                    <Route path="error" element={<ErrorPage />} />
                    <Route path="/match" element={<Match />} />
                </Route>
                <Route path="/match-mirror" element={<MirrorMatch />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
