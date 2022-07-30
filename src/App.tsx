import React from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri';
import { ChakraProvider } from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme';

function App() {
  function commandCronFormatter(){
    const now = new Date(new Date().toLocaleString());
    invoke('command_cron_formatter',{msg:{cron:"* * * * *", now:now.toISOString(),count:5}}).then(message => {
      console.log('command_cron_formatter', message);
    }).catch(message => {
      console.error('command_cron_formatter', message);
    })
  }

  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <div className="App">
        <header className="App-header">
          <Button onClick={commandCronFormatter} colorScheme='blue'>Click to execute simpleCommands</Button>
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
