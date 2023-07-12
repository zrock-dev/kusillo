import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import Home from "./home";
import TeamRegistrationForm from "./forms/team_registration";
import * as React from "react";
import ErrorPage from "./errors/error_page";

function App() {
  return (
      <BrowserRouter>
          <header>
              <Link to={"/"}>Home </Link>
              <Link to={"/team-form"}> Team registration</Link>
          </header>

          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team-form" element={<TeamRegistrationForm />} />
              <Route path="/error" element={<ErrorPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;