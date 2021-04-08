import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Signup from "../components/Auth/Signup";
import Login from "../components/Auth/Login";
import ForgotPassword from "../components/Auth/ForgotPassword";
import ResetPassword from "../components/Auth/ResetPassword";
import AddRecipe from "../components/Recipes/AddOrUpdateRecipes";
import ProtectedRoute from "./ProtectedRoute";
import { State } from "../shared/types";
import Recipes from "../components/Recipes/Recipes";

interface routesProps {}

const BaseRouter: React.FC<routesProps> = ({}) => {
  const userId = useSelector((state: State) => state.auth.id);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route path="/resetpassword/:token" component={ResetPassword} />
      <ProtectedRoute
        path="/recipes/add"
        component={AddRecipe}
        isAuth={!!userId}
      />
      <ProtectedRoute path="/recipes" component={Recipes} isAuth={!!userId} />
    </Switch>
  );
};

export default BaseRouter;
