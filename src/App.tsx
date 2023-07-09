import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./home";
import TeamRegistrationForm from "./forms/team_registration";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team-form" element={<TeamRegistrationForm />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;