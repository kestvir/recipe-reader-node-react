import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { getUser } from "./redux/slices/authSlice";
import BaseRouter from "./routes/BaseRouter";

const App = () => {
  const dispatch = useAppDispatch();
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
