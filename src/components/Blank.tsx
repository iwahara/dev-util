import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { SidebarContent } from "./SideBar";

export default function Blank(){
    const { onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue("blue.100", "blue.900")}>
          <SidebarContent
            onClose={() => onClose}
            display={{ base: "none", md: "block" }}
            setChild={() => {}}
          />
          <Box ml={{ base: 0, md: 60 }} p="4">
          </Box>
        </Box>
      );
}