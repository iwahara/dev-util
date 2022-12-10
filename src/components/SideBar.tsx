import { ReactNode, useState } from "react";
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";

import { FaNetworkWired } from "react-icons/fa";
import { VscJson } from "react-icons/vsc";

import { IconType } from "react-icons";
import CidrAnalyzer from "./CidrAnalyzer";
import CronParser from "./CronParser";
import JsonFormatter from "./JsonFormatter";

type ReactText = string | number;

interface LinkItemProps {
  name: string;
  icon: IconType;
  content: ReactNode;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Cron Formatter", icon: FiClock, content: <CronParser /> },
  { name: "CIDR Analyzer", icon: FaNetworkWired, content: <CidrAnalyzer /> },
  { name: "Json Formatter", icon: VscJson, content: <JsonFormatter /> },
];

export default function SimpleSidebar() {
  const { onClose } = useDisclosure();
  const [child, setChild] = useState<ReactNode>();
  return (
    <Box minH="100vh" bg={useColorModeValue("blue.100", "blue.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        setChild={setChild}
      />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {child}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  setChild: (child: ReactNode) => void;
}

const SidebarContent = ({ onClose, setChild, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Dev-util
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={() => setChild(link.content)}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};


