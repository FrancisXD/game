import React from "react";
import { Provider } from "react-redux";
import store from "./store";

import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "./App.css";

import "./assets/css/nucleo-icons.css";
import "./assets/scss/black-dashboard-pro-react.scss?v=1.0.0";
import "./assets/demo/demo.css";
import "react-notification-alert/dist/animate.css";

import Index from "./pages/index";
import Login from "./pages/login";
import Alert from "./layout/alert";
import Navbar from "./layout/nabvar";
import PrivateRoute from "./routing/privateRoute";
import Home from "./pages/home.js";
import Register from "./pages/register";
import Game from "./pages/game";
import Ganadores from "./pages/ganadores";
import gameOne from "./pages/gameOne";
import Footer from "./layout/footer";

import gameMultiplayer from "./pages/gameMultiplayer";

const hist = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={hist}>
          <Alert />
          <Navbar />
          <Switch>
            <Route path="/" exact render={props => <Index {...props} />} />
            <Route path="/login" exact render={props => <Login {...props} />} />
            <Route
              path="/register"
              exact
              render={props => <Register {...props} />}
            />

            <PrivateRoute path="/user/home" exact component={Home} />
            <PrivateRoute path="/user/game" exact component={Game} />
            <PrivateRoute path="/user/ganadores" exact component={Ganadores} />
            <PrivateRoute path="/user/single" exact component={gameOne} />
            <PrivateRoute
              path="/user/multiplayer"
              exact
              component={gameMultiplayer}
            />
          </Switch>
        </Router>
        <Footer />
      </Provider>
    );
  }
}

export default App;
