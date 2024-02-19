import { Navbar } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home, Explore, Itinerary, Trips, Favorites, Profile, } from './pages';
import UserPreferences from "./pages/UserPreferences";

function App() {

  const authToken = window.localStorage.getItem('token')

  return (
    <>
      <link rel="preload" href="../public/images" />
      <Router>
        <Navbar token={authToken} />
        <Routes>
          <Route path="/" element={<Home token={authToken} />}></Route>
          <Route path="/explore" element={<Explore token={authToken} />}></Route>
          <Route path="/itinerary" element={<Itinerary token={authToken} />}></Route>
          <Route path="/trips" element={<Trips token={authToken} />}></Route>
          <Route path="/favorites" element={<Favorites token={authToken} />}></Route>
          <Route path="/profile" element={<Profile token={authToken} />}></Route>
          <Route path="/preferences" element={<UserPreferences token={authToken} />}></Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
