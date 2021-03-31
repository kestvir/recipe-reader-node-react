import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { getUser } from "./utils/functions";
import BaseRouter from "./routes/BaseRouter";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getUser(dispatch);
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
