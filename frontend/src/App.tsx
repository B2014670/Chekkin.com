import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";

const App = () => {
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
};

export default App;