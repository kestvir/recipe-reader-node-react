import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { getUser } from "./redux/slices/authSlice";
import BaseRouter from "./routes/BaseRouter";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <div className="App">
      <Router>
        <Layout>
          <BaseRouter />
        </Layout>
      </Router>
    </div>
  );
};

export default App;
