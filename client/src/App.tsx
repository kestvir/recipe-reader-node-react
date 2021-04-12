import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { getUser } from "./redux/slices/authSlice";
import BaseRouter from "./routes/BaseRouter";
import { State } from "./shared/types";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useHistory } from "react-router-dom";

const ALAN_SDK_KEY = process.env.REACT_APP_ALAN_SDK_KEY as string;

const App = () => {
  const userId = useAppSelector((state: State) => state.auth.id);
  const dispatch = useAppDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  interface CommandData {
    command: string;
  }

  useEffect(() => {
    if (userId)
      alanBtn({
        key: ALAN_SDK_KEY,
        onCommand: (commandData: CommandData) => {
          if (commandData.command === "goToRecipes") {
            history.push("/recipes");
          }
        },
      });
    const alanRoot = document.getElementsByClassName("alanBtn-root")[0];
    if (alanRoot && !userId) {
      alanRoot.remove();
    }
  }, [userId]);

  console.log(userId);
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
