import {BrowserRouter, Route, Routes} from "react-router-dom";
import * as React from 'react';
import Home from "./Home";
import Match from "./game_match/match/Match";
import MirrorMatch from "./game_match/mirror/Match";
import TeamRegistrationForm from "./forms/team_registration";
import MatchSelect from "./game_match/MatchSelect";
import ErrorPage from "./errors/error_page";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="team-form" element={<TeamRegistrationForm />} />
                    <Route path="match-select" element={<MatchSelect />} />
                    <Route path="error" element={<ErrorPage />} />
                </Route>
                <Route path="/match" element={<Match />} />
                <Route path="/match-mirror" element={<MirrorMatch />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
