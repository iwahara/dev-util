import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import SimpleSidebar from "./components/SideBar";

function App() {
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SimpleSidebar />
    </ChakraProvider>
  );
}

export default App;
