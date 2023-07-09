import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./home";
import SignupForm from "./forms/team_registration";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/team-form" element={<SignupForm />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;