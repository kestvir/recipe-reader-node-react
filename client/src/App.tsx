import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import { getUser } from "./shared/functions";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

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
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="/resetpassword/:token" component={ResetPassword} />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
