import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Room from "./Room";
import GithubCorner from "react-github-corner";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
      <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path={idPath}>
            <Room />
        </Route>
        <Route exact path="/">
          <Button color="secondary" variant="contained" href={idPath}>
            Go to Room {idPath}
          </Button>
        </Route>
      </Switch>
      <GithubCorner size={60} href="https://github.com/jasmeeto/random-word-room" />
      </ThemeProvider>
    </div>
  );
}
