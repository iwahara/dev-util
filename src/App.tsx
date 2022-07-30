import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme';
import CronParser from './components/CronParser'

class App extends React.Component {

  render(){
    return (
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <div className="App">
          <CronParser />
        </div>
      </ChakraProvider>
    );
  }
}

export default App;
