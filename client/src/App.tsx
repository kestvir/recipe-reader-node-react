import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import { getUser } from "./shared/functions";
import Login from "./components/Auth/Login";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getUser(dispatch);
  }, []);

  return (
    <div className="App">
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
