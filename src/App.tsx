import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme';
import CronParser from './components/CronParser'
import { Container } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import SimpleSidebar from './components/SideBar';

class App extends React.Component {

  render(){
    return (
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SimpleSidebar children={<CronParser />} />
      </ChakraProvider>
    );
  }
}

export default App;
