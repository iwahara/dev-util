import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme';
import CronParser from './components/CronParser'
import { Container } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'

class App extends React.Component {

  render(){
    return (
      <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Grid
          templateAreas={`"header header"
                          "nav main"
                          "nav footer"`}
          gridTemplateRows={'50px 1fr 30px'}
          gridTemplateColumns={'150px 1fr'}
          h='200px'
          gap='1'
          color='blackAlpha.700'
          fontWeight='bold'>
          <GridItem pl='2' bg='orange.300' area={'header'}>
            Header
          </GridItem>
          <GridItem pl='2' bg='pink.300' area={'nav'}>
            Nav
          </GridItem>
          <GridItem pl='2' bg='blue.300' area={'main'}>
            <CronParser />
          </GridItem>
          <GridItem pl='2' bg='blue.300' area={'footer'}>
            Footer
          </GridItem>
        </Grid>
      </ChakraProvider>
    );
  }
}

export default App;
