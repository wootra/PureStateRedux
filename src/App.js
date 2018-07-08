import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import DerivedStateSample from "./components/DeriveStateSample";
import PureStateReduxTest from "./components/index";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          you can input 1 or 2 in the send text box.
        </p>
        <PureStateReduxTest/>
      </div>
    );
  }
}

export default App;
