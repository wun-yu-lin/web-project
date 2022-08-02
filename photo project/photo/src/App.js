import React from "react";
import "./styles/css/style.css";
import Homepage from "./pages/Homepage";
import Nav from "./components/Nav";
import About from "./pages/about";
import Footer from "./components/Footer";
import { Switch, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/about" exact>
          <About />
        </Route>
      </Switch>

      <Footer />
    </div>
  );
}

export default App;
