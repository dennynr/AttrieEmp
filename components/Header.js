
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { GluestackUIProvider, Heading, Pressable, Box, Image, Text, HStack, Input, InputField, Menu, MenuItem, MenuItemLabel, Button, ButtonText } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React from 'react'

const Header = (props) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Box bg={"white"} p={"5"} height={60}>
        <HStack marginTop={10}>
          <Pressable marginStart={20} flex={5} onPress={() => navigation.navigate('Katalog')}>
            <Box width={"95%"} height={40} borderWidth={1} rounded={5}></Box>
            <Text marginTop={8} marginLeft={50} position="absolute">Cari Disini</Text>
            <Box position="absolute" marginLeft={10} marginTop={7}>
              <Ionicons name="search" size={24} color="#6a6a6a" />
            </Box>
          </Pressable>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default Header;



