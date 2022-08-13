import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import CronParser from "./components/CronParser";
import SimpleSidebar from "./components/SideBar";
import CidrAnalyzer from "./components/CidrAnalyzer";

function App() {
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SimpleSidebar />
    </ChakraProvider>
  );
}

export default App;
