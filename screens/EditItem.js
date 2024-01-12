import React, { useState } from 'react';
import { Box, Text, Pressable, Image, ScrollView, VStack, Input, InputField, InputSlot, InputIcon, useTheme, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, Button, ButtonText, Heading, Icon, CloseIcon } from '@gluestack-ui/themed';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../firebase";
import * as ImagePicker from 'expo-image-picker';
const EditItem = ({ route }) => {
  const data = route.params.data;
  const [costumeName, setCostumeName] = useState(data.costumeName);
  const [costumeDescription, setCostumeDescription] = useState(data.costumeDescription);
  const [rentalPrice, setRentalPrice] = useState(data.rentalPrice);
  const [image, setImage] = useState(data.imageUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const navigation = useNavigation();
  const ref = React.useRef(null)
  console.log('ini dataku ', route.params);

  const handleEditCostume = () => {
    console.log('Editing costume:', {
      costumeName,
      costumeDescription,
      rentalPrice,
    });
  };
  console.log(data.costumeId)
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.7,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const editCostume = async () => {
    if (!costumeName || !costumeDescription || !image) {
      setShowModal(true);
      return;
    }
    try {

      // Perbarui catatan berdasarkan costumeId
      const costumeRef = firebase.database().ref(`costumes/${data.costumeId}`);
      const snapshot = await costumeRef.once("value");
      const existingCostume = snapshot.val();
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = firebase.storage().ref().child(filename);
      if (existingCostume) {
        await ref.put(blob);
        // Perbarui data kostum
        const updatedCostume = {
          costumeName,
          costumeDescription,
          rentalPrice,
          filename,
        };

        await costumeRef.update(updatedCostume);
        console.log("Costume updated successfully");
        navigation.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        });
      } else {
        console.log("Costume not found");
      }
    } catch (error) {
      console.error("Error updating costume:", error);
    }
  };

  const theme = useTheme();
  console.log(data.imageUrl)
  return (
    <Box flex={1} backgroundColor="white" padding={16}>
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <VStack space="md" width="100%">
          <Text>Nama Kostum</Text>
          <Input
            borderBottomWidth={3}
            borderEndWidth={3}
            borderTopWidth={1}
            borderStartWidth={1}
            rounded={7}
            borderColor='#021C35'

          >
            <InputField
              placeholder="Costume Name"
              value={costumeName}
              onChangeText={(text) => setCostumeName(text)}
              maxLength={20}
            />
          </Input>
        </VStack>
        <VStack space="md" marginTop={20} width="100%">
          <Text>Deskripsi</Text>
          <Input
            borderBottomWidth={3}
            borderEndWidth={3}
            borderTopWidth={1}
            borderStartWidth={1}
            rounded={7}
            borderColor='#021C35'>
            <InputField
              placeholder="Description"
              value={costumeDescription}
              onChangeText={(text) => setCostumeDescription(text)}
              multiline
            />
          </Input>
        </VStack>
        <VStack space="md" marginTop={20} width="100%">
          <Text>Harga</Text>
          <Input
            borderBottomWidth={3}
            borderEndWidth={3}
            borderTopWidth={1}
            borderStartWidth={1}
            rounded={7}
            borderColor='#021C35'
          >
            <InputField
              placeholder="Rental Price (per day)"
              value={rentalPrice}
              onChangeText={(text) => setRentalPrice(text)}
              keyboardType="numeric"
            />
          </Input>
        </VStack>
        <Box marginTop={20} justifyContent='center' alignItems='center'>
          {data.imageUrl ? (<Image source={{ uri: data.imageUrl }} alignItems='center' role='img' alt='gambarkostum' style={{ width: 200, height: 200 }} />) : (<Image source={{ uri: image }} alignItems='center' role='img' alt='gambarkostum' style={{ width: 200, height: 200 }} />)}
        </Box>

        <Pressable
          marginTop={20}
          justifyContent="center"
          alignItems="center"
          height={50}
          borderRadius={4}
          backgroundColor="#DF9B52"
          marginBottom={16}
          onPress={pickImage}
        >
          <Text color="white" fontWeight="bold">
            Pilih Gambar
          </Text>
        </Pressable>
        <Pressable
          justifyContent="center"
          alignItems="center"
          height={50}
          borderRadius={4}
          backgroundColor="#021C35"
          onPress={editCostume}
        >
          <Text color="white" fontWeight="bold">
            Edit Costume
          </Text>
        </Pressable>
        <Center h={300}>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false)
            }}
            finalFocusRef={ref}
          >
            <ModalBackdrop />
            <ModalContent borderWidth={1} borderColor='black'
              borderRightWidth={4}
              borderBottomWidth={4} rounded={7}>
              <ModalHeader>
                <Heading size="lg">Gagal input data</Heading>
                <ModalCloseButton>
                  <Icon as={CloseIcon} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <Text>
                  Harap input data dengan benar dan jangan biarkan kosong seperti pikiran
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"

                  borderColor='black'
                  backgroundColor='white'
                  borderWidth={1}
                  borderRightWidth={3}
                  borderBottomWidth={3}
                  onPress={() => {
                    setShowModal(false)
                  }}
                >
                  <ButtonText color='black'>Oke, mengerti</ButtonText>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Center>
      </ScrollView>

    </Box>
  );
};

export default EditItem;