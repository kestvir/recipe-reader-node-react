import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { getUser } from "./redux/slices/authSlice";
import BaseRouter from "./routes/BaseRouter";
import { State } from "./shared/types";
import ProgressBar from "./components/UI/Progressbar";

const App = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: State) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <div className="App">
      <Router>
        {isLoading ? (
          <ProgressBar />
        ) : (
          <>
            <Layout>
              <BaseRouter />
            </Layout>
          </>
        )}
      </Router>
    </div>
  );
};

export default App;
