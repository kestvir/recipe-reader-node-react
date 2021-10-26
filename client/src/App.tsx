import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import { getUser } from "./redux/slices/authSlice";
import BaseRouter from "./routes/BaseRouter";
import { State } from "./shared/types";
import Progressbar from "./components/UI/Progressbar";

const App = () => {
  const { isLoading } = useAppSelector((state: State) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className="App">
      {isLoading ? (
        <Progressbar />
      ) : (
        <Router>
          <Layout>
            <BaseRouter />
          </Layout>
        </Router>
      )}
    </div>
  );
};

export default App;
