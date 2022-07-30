import React from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri';

function App() {
  function simpleCommands() {
    invoke('simple_command')
  }

  function commandWithMessage() {
    invoke('command_with_message', { message: 'some message' }).then(message => {
      console.log('command_with_messge', message)
    })
  }
  function commandWithObject() {
    invoke('command_with_object', { message: { field_str: 'some message', field_u32: 12 }}).then(message => {
      console.log('command_with_object', message)
    })
  }

  function commandWithError() {
    for (let arg of [1, 2]) {
      invoke('command_with_error', { arg }).then(message => {
        console.log('command_with_error', message)
      }).catch(message => {
        console.error('command_with_error', message)
      })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          <br></br>
           Hello Tauri
        </p>
        <button onClick={simpleCommands}>Click to execute simpleCommands</button>
        <button onClick={commandWithMessage}>Click to execute commandWithMessage</button>
        <button onClick={commandWithObject}>Click to execute commandWithObject</button>
        <button onClick={commandWithError}>Click to execute commandWithError</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
