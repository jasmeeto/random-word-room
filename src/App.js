import React from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import Room from "./Room";
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
          <Room />
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
