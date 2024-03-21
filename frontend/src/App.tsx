import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import SearchResult from "./pages/SearchResult";
import SearchBar from "./components/SearchBar";
import Detail from "./pages/Detail";

const App = () => {
  const { isLogin } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <SearchBar/>
            <div>Home page</div>
          </Layout>}
        />
        <Route path="/search" element={
          <Layout>
            <SearchBar/>
            <SearchResult/>
          </Layout>}
        />
        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path="/sign-in" element={
          <Layout>
            <SignIn />
          </Layout>
        } />
        <Route path="/detail/:hotelId" element={
          <Layout>
            <SearchBar/>
            <Detail />
          </Layout>
        } />
        {isLogin && (
          <>
            <Route path="/add-hotel" element={
              <Layout>
                <AddHotel />
              </Layout>
            }
            />
          </>
        )}
        {isLogin && (
          <>
            <Route path="/my-hotels" element={
              <Layout>
                <MyHotels />
              </Layout>
            }
            />
          </>
        )}
        {isLogin && (
          <>
            <Route path="/edit-hotel/:hotelId" element={
              <Layout>
                <EditHotel />
              </Layout>
            }
            />
          </>
        )}


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
};

export default App;