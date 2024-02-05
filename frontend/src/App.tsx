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

const App = () => {
  const { isLogin } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <div>Home page</div>
          </Layout>}
        />
        <Route path="/search" element={
          <Layout>
            <div>
              Search page
            </div>
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


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
};

export default App;