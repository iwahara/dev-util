import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import Blank from "./components/Blank";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import JsonFormatter from "./components/JsonFormatter";
import CronParser from "./components/CronParser";
import CidrAnalyzer from "./components/CidrAnalyzer";


function App() {
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
      <Routes>
        <Route path={`/`} element={<Blank />} />
        <Route path={`/json_formatter/`} element={<JsonFormatter />} />
        <Route path={`/cron_parser/`} element={<CronParser />} />
        <Route path={`/cidr_analyzer/`} element={<CidrAnalyzer />} />
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
