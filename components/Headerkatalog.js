
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { GluestackUIProvider, Heading, Pressable, Box, Image, Text, HStack, Input, InputField, Menu, MenuItem, MenuItemLabel, Button, ButtonText } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React from 'react'

const HeaderKatalog = (props) => {
  const trueGray900 = "#171717";
  const navigation = useNavigation();
  const handleSearchSubmit = () => {
    props.setSearchText(searchText);
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Box bg={"white"} p={"5"} height={60}>
        <HStack marginTop={10}>
          <Box width={"95%"} marginStart={10} >
            <Input
              variant="outline"
              size="sm"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              backgroundColor="#FFF"
              marginTop={2}
              borderWidth={2}
              borderColor="#000"
            >
              <InputField
                marginStart={20}
                placeholder="Cari Costum disini"
                onChangeText={(text) => props.setSearchText(text)}
              />
            </Input>

            <Box position="absolute" marginLeft={7} marginTop={7}>
              <Ionicons name="search" size={24} color="#000" />
            </Box>
          </Box>

        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default HeaderKatalog;



