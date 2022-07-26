import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Box, Button, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { HStack, VStack } from "@chakra-ui/react";
import DateTimePicker from "react-datetime-picker";
import { formatISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useToast } from "@chakra-ui/react";

import { ListItem, UnorderedList } from "@chakra-ui/react";

import { Input } from "@chakra-ui/react";

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { SidebarContent } from "./SideBar";

function CronParser() {
  const dummy: string[] = [];
  const defaultCron = "* * * * *";
  const defaultCount = 5;
  const defaultTimeZone = "UTC";
  const [nextList, setNextList] = useState(dummy);
  const [targetDate, setTargetDate] = useState(new Date());
  const [cron, setCron] = useState(defaultCron);
  const [count, setCount] = useState(defaultCount);
  const [timezone, setTimeZone] = useState(defaultTimeZone);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const toast = useToast();
  const { onClose } = useDisclosure();

  function commandCronFormatter() {
    setNextList(dummy);
    setButtonDisabled(true);
    let strDate = formatISO(utcToZonedTime(targetDate, timezone));

    if (timezone === "UTC") {
      strDate = targetDate.toISOString();
    }

    invoke<string[]>("command_cron_formatter", {
      msg: { cron: cron, now: strDate, count: count },
    })
      .then((message) => {
        setNextList(message);
      })
      .catch((message) => {
        console.error("command_cron_formatter", message);
        toast({
          title: "cronパースエラー",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setButtonDisabled(false);
      });
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("blue.100", "blue.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        setChild={() => {}}
      />
      <Box ml={{ base: 0, md: 60 }} p="4">
      <div>
        <VStack align="left">
          <HStack spacing="24px">
            <Input
              colorScheme="blue"
              defaultValue={defaultCron}
              onChange={(event) => setCron(event.target.value)}
            ></Input>
            <Select onChange={(event) => setTimeZone(event.target.value)}>
              <option value={defaultTimeZone}>{defaultTimeZone}</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </Select>
          </HStack>
          <NumberInput
            defaultValue={defaultCount}
            min={1}
            max={100}
            value={count}
            onChange={(_valueString, valueAsNumber) => setCount(valueAsNumber)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <DateTimePicker
            onChange={setTargetDate}
            value={targetDate}
            disableClock={true}
          />
          <Button
            onClick={commandCronFormatter}
            colorScheme="blue"
            disabled={buttonDisabled}
          >
            パースする
          </Button>
          <div>
            <UnorderedList colorScheme="blue">
              {nextList.map((next: string, i: number) => {
                return (
                  <ListItem key={next}>
                    {new Date(next).toLocaleString()}
                  </ListItem>
                );
              })}
            </UnorderedList>
          </div>
        </VStack>
      </div>
    </Box>
    </Box>
  );
}

export default CronParser;
