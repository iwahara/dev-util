import { ReactNode } from "react";
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  Link,
  useColorModeValue,
  Text,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

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
  linkTo:string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Cron Formatter", icon: FiClock, content: <CronParser />,linkTo:"/cron_parser/" },
  { name: "CIDR Analyzer", icon: FaNetworkWired, content: <CidrAnalyzer />,linkTo:"/cidr_analyzer/" },
  { name: "Json Formatter", icon: VscJson, content: <JsonFormatter /> ,linkTo:"/json_formatter/"},
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
  setChild: (child: ReactNode) => void;
}

export const SidebarContent = ({ onClose, setChild, ...rest }: SidebarProps) => {
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
          linkTo={link.linkTo}
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
  linkTo:string;
}
const NavItem = ({ icon, children,linkTo, ...rest }: NavItemProps) => {
  return (
    <Link
      as={ReactLink}
      to={linkTo}
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


