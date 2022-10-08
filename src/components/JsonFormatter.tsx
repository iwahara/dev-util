import { Button, Textarea, useToast, VStack } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";


interface JsonFormatterResponse {
  formatted_str: string;
}

function JsonFormatter() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [json, setJson] = useState("");
  const [formatted, setFormatted] = useState("");

  const toast = useToast();

  async function commandJsonFormat(){
    setButtonDisabled(true);

    const req = {
      req: {
        json_str: json
      },
    };
    try {
      const res = await invoke<JsonFormatterResponse>("command_json_formatter",req);
      console.log(res);
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
    <div>
      <VStack align="left">
      <Textarea
        placeholder='Json文字列を入力してください'
        resize='vertical'
        onChange={(event) => setJson(event.target.value)}
      />
      </VStack>

      <Button
          onClick={commandJsonFormat}
          colorScheme="blue"
          disabled={buttonDisabled}
        >フォーマット</Button>
      <Textarea
        isReadOnly
        resize='vertical'
        value={formatted}
      />
    </div>
  );
}
export default JsonFormatter;