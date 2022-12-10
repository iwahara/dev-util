import { Box, Button, Textarea, useToast, VStack,useColorModeValue, useDisclosure, HStack, Checkbox } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { SidebarContent } from "./SideBar";


interface JsonFormatterResponse {
  formatted_str: string;
}

function JsonFormatter() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [json, setJson] = useState("");
  const [formatted, setFormatted] = useState("");
  const [isMinify, setIsMinify] = useState(false);

  const toast = useToast();
  const { onClose } = useDisclosure();

  async function commandJsonFormat(){
    setButtonDisabled(true);

    const req = {
      req: {
        json_str: json,
        is_minify: isMinify
      },
    };
    try {
      const res = await invoke<JsonFormatterResponse>("command_json_formatter",req);
      console.log(req);
      setFormatted(res.formatted_str);
    } catch (error:any) {
      toast({
        title: "JSON 解析エラー",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }finally{
      setButtonDisabled(false);
    }
    
  };

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
        <Textarea
          placeholder='Json文字列を入力してください'
          resize='vertical'
          onChange={(event) => setJson(event.target.value)}
        />
        </VStack>

        <HStack>
          <Checkbox checked={isMinify} onChange={(event) =>setIsMinify(event.target.checked)}>minify</Checkbox>
          <Button
              onClick={commandJsonFormat}
              colorScheme="blue"
              disabled={buttonDisabled}
            >フォーマット
          </Button>
        </HStack>
        <Textarea
          isReadOnly
          resize='vertical'
          value={formatted}
        />
      </div>
      </Box>
    </Box>
    
  );
}
export default JsonFormatter;