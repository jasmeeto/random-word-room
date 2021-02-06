import React from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import Room from "./Room";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import "./styles.css";

/**
 * @param {Number} length
 * @returns random lowercase alphabetic string of length 'length'
 */
function makemeetid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    if (i % 3 === 2 && i !== length - 1) {
      result += "-";
    }
  }
  return result;
}

const theme = createMuiTheme({
  palette: {
    primary: {
      //main: '#8a33e2',
      main: '#9d5edb',
    },
    secondary: {
      //main: '#d3b9ed',
      main: '#d95dca',
    },
  }
});

export default function App() {
  const id = makemeetid(9);
  let location = useLocation();
  let idPath = "/" + id;
  if (location.pathname !== "/" && !location.pathname.includes(".")) {
    idPath = location.pathname;
  }

  return (
    <div className="App">
      <Switch>
        <Route exact path={idPath}>
          <ThemeProvider theme={theme}>
            <Room />
          </ThemeProvider>
        </Route>
        <Route exact path="/">
          <button>
            <Link to={idPath}> Go to Room {idPath} </Link>
          </button>
        </Route>
      </Switch>
    </div>
  );
}
