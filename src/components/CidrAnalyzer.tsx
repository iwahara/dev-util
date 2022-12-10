import {
  VStack,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  Box,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { SidebarContent } from "./SideBar";


interface CidrAnalyzerResponse {
  formatted_ip: String;
  formatted_cidr: String;
  subnet: String;
  ip_address_range_start: String;
  ip_address_range_end: String;
  address_range_length: Number;
  network_ip_address: String;
  broadcast_ip_address: String;
}

function CidrAnalyzer() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [firstOctet, setFirstOctet] = useState(0);
  const [secondOctet, setSecondOctet] = useState(0);
  const [thirdOctet, setThirdOctet] = useState(0);
  const [fourthOctet, setFourthOctet] = useState(0);
  const [prefixLen, setPrefixLen] = useState(0);
  const [response, setResponse] = useState<CidrAnalyzerResponse>();

  const toast = useToast();
  const { onClose } = useDisclosure();

  function commandCidrAnalyzer() {
    setButtonDisabled(true);

    const req = {
      req: {
        first_octet: firstOctet,
        second_octet: secondOctet,
        third_octet: thirdOctet,
        fourth_octet: fourthOctet,
        prefix_len: prefixLen,
      },
    };
    invoke<CidrAnalyzerResponse>("command_cidr_analyzer", req)
      .then((res) => {
        console.log(res);
        setResponse(res);
      })
      .catch((message) => {
        console.error("command_cidr_analyzer", message);
        toast({
          title: "CIDR 解析エラー",
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
        <InputGroup>
          <NumberInput
            defaultValue={0}
            min={0}
            max={255}
            onChange={(value) => setFirstOctet(Number(value))}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon children="." />
          <NumberInput
            defaultValue={0}
            min={0}
            max={255}
            onChange={(value) => setSecondOctet(Number(value))}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon children="." />
          <NumberInput
            defaultValue={0}
            min={0}
            max={255}
            onChange={(value) => setThirdOctet(Number(value))}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon children="." />
          <NumberInput
            defaultValue={0}
            min={0}
            max={255}
            onChange={(value) => setFourthOctet(Number(value))}
          >
            <NumberInputField />
          </NumberInput>
          <InputRightAddon children="/" />
          <NumberInput
            defaultValue={0}
            min={0}
            max={32}
            onChange={(value) => setPrefixLen(Number(value))}
          >
            <NumberInputField />
          </NumberInput>
        </InputGroup>
        <Button
          onClick={commandCidrAnalyzer}
          colorScheme="blue"
          disabled={buttonDisabled}
        >
          解析する
        </Button>
        {response && (
          <TableContainer>
            <Table variant="simple" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th>項目</Th>
                  <Th>値</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>IPアドレス</Td>
                  <Td>{response?.formatted_ip}</Td>
                </Tr>
                <Tr>
                  <Td>CIDR</Td>
                  <Td>{response?.formatted_cidr}</Td>
                </Tr>
                <Tr>
                  <Td>サブネット</Td>
                  <Td>{response?.subnet}</Td>
                </Tr>
                <Tr>
                  <Td>IPアドレスの範囲</Td>
                  <Td>
                    {response?.ip_address_range_start} -{" "}
                    {response?.ip_address_range_end}
                  </Td>
                </Tr>
                <Tr>
                  <Td>IPアドレス数</Td>
                  <Td>{response?.address_range_length.toString()}</Td>
                </Tr>
                <Tr>
                  <Td>ネットワークIPアドレス</Td>
                  <Td>{response?.network_ip_address}</Td>
                </Tr>
                <Tr>
                  <Td>ブロードキャストIPアドレス</Td>
                  <Td>{response?.broadcast_ip_address}</Td>
                </Tr>
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>項目</Th>
                  <Th>値</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        )}
      </VStack>
    </div>
    </Box>
    </Box>
  );
}
export default CidrAnalyzer;
