import React, { useState, useEffect } from 'react';
import { VStack, Text, Input, InputField, Pressable, Image, ScrollView, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectItem, Box, SelectDragIndicator, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, Heading, Icon, CloseIcon, Button, ButtonText } from '@gluestack-ui/themed';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { useTheme } from '@gluestack-ui/themed';
import firebase from "../firebase";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
//definisi create
const Create = () => {
  // State untuk menyimpan informasi kostum yang akan diposting
  const [costumeName, setCostumeName] = useState('');
  const [costumeDescription, setCostumeDescription] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [costumeCategory, setCostumeCategory] = useState('');
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false)
  const ref = React.useRef(null)
  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");
      console.log("Data from AsyncStorage:", userDataString)
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        const uid = userData.credential.user.uid;

        // Menampilkan UID ke konsol
        console.log("User UID from AsyncStorage:", uid);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange = (value) => {
    setCostumeCategory(value);

  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.7,
    });
  
    console.log(result);
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  useEffect(() => {
    // Panggil fungsi untuk mengambil email setiap kali komponen di-mount
    getUserData();
  }, []);
  // Fungsi untuk menangani proses posting kostum
  const handlePostCostume = async () => {
    if (!costumeName || !costumeDescription || !costumeCategory || !image) {
      setShowModal(true);
      return;
    }
    try {
      const userDataString = await AsyncStorage.getItem("user-data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const uid = userData.credential.user.uid;
        const username = userData.username;
        const number = userData.number;
        const status = 'Tersedia';
        // Menambahkan UID pengguna ke data kostum
        const database = firebase.database();
        const response = await fetch(image);
        const blob = await response.blob();
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const ref = firebase.storage().ref().child(filename);
        try {
          await ref.put(blob);
          const newCostumeRef = database.ref('costumes/').push({
            costumeName,
            costumeDescription,
            rentalPrice,
            costumeCategory,
            status,
            uid,
            filename,
            username,
            number,
          });
          console.log('Posted costume with key:', newCostumeRef.key);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
        }


        // Reset nilai form setelah posting
        setCostumeName('');
        setCostumeDescription('');
        setRentalPrice('');
        setImage('');
        navigation.replace("Tabs");
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(image);
  useEffect(() => {
    const database = firebase.database();
    // Listen for changes in the 'costumes' node
    const costumesRef = database.ref('costumes');
    costumesRef.on('value', (snapshot) => {
      const costumesData = snapshot.val();
    });

    return () => costumesRef.off('value');
  }, []);


  // Fungsi untuk menangani pemilihan gambar kostum
  const handleImageSelection = () => {
    // Simulasi pemilihan gambar (belum ada logika sesungguhnya)
    console.log('Selecting image...');
  };

  // Access the theme
  const theme = useTheme();

  return (
    <VStack flex={1} backgroundColor={'white'} padding={16}>
      {/* Konten halaman */}
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false} >
        {/* Bagian Detail Kostum */}
        <Text fontSize={18} fontWeight="bold" marginBottom={8} color={theme.titleColor}>
          Tambahkan Item
        </Text>
        <VStack space="md" marginTop={30}>
          <Text>Nama Kostum</Text>
          <Input
            backgroundColor={theme.inputBackgroundColor}
            borderBottomWidth={3}
            borderEndWidth={3}
            rounded={7}
            borderColor='#021C35'
          >
            <InputField
              type="text"
              placeholder="Nama Kostum"
              value={costumeName}
              onChangeText={(text) => setCostumeName(text)}
              maxLength={20}
            />
          </Input>
        </VStack>
        <VStack space="md" marginTop={10}>
          <Text>Deskripsi</Text>
          <Input
            backgroundColor={theme.inputBackgroundColor}
            borderColor='#021C35'
            height={80}
            borderBottomWidth={3}
            borderEndWidth={3}
            rounded={7}
          >
            <InputField
              type="text"
              placeholder="Deskripsi"
              value={costumeDescription}
              onChangeText={(text) => setCostumeDescription(text)}
              multiline
            />
          </Input>
        </VStack>
        <VStack space="md" marginTop={10}>
          {/* <Input
            backgroundColor={theme.inputBackgroundColor}
            borderBottomWidth={3}
            borderEndWidth={3}
            rounded={7}
            borderColor='#021C35'
          >
            <InputField
              type="text"
              placeholder="Harga Rental (per hari)"
              value={rentalPrice}
              onChangeText={(text) => setRentalPrice(text)}
              keyboardType="numeric"

            />
          </Input> */}
          <Text>Harga Rental</Text>
          <Input
            backgroundColor={theme.inputBackgroundColor}
            borderBottomWidth={3}
            borderEndWidth={3}
            rounded={7}
            borderColor='#021C35'
          >
            <InputField
              type="text"
              placeholder="Harga Rental (per hari)"
              value={rentalPrice}
              onChangeText={(text) => setRentalPrice(text)}
              keyboardType="numeric"
            />
          </Input>
        </VStack>
        <Box marginTop={10}>
          <Text mb={10}>Nama Kostum</Text>
          <Select
            borderBottomWidth={3}
            borderTopWidth={1}
            borderStartWidth={1}
            borderEndWidth={3}
            rounded={7}
            borderColor='#021C35'
            onValueChange={handleSelectChange}
          >
            <SelectTrigger variant="outline" size="md" >
              <SelectInput placeholder="Pilih Kategori" />
              <SelectIcon mr="$3">
                <Entypo name="chevron-down" size={15} color="black" />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="Helloween" value="Helloween" />
                <SelectItem label="Batik" value="Batik" />
              </SelectContent>
            </SelectPortal>
          </Select>

        </Box>
        {/* Bagian Gambar Kostum */}
        <Box marginTop={20} justifyContent='center' alignItems='center'>
          {image && <Image source={{ uri: image }} alignItems='center' role='img' alt='gambarkostum' style={{ width: 200, height: 200 }} />}

        </Box>


        {/* Tombol untuk menambahkan gambar kostum */}
        <Pressable
          justifyContent="center"
          alignItems="center"
          height={50}
          marginTop={10}
          borderRadius={4}
          backgroundColor={'#DF9B52'}
          marginBottom={16}
          onPress={pickImage}
        >
          <Text color={'white'} fontWeight="bold">
            <AntDesign name="picture" size={24} color="black" /> Tambahkan Gambar
          </Text>
        </Pressable>
        {/* Tombol untuk memposting kostum */}
        <Pressable
          justifyContent="center"
          alignItems="center"
          height={50}

          borderRadius={4}
          backgroundColor={'#021C35'}
          onPress={handlePostCostume}
        >
          <Text color="white" fontWeight="bold">
            Post Costume
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
    </VStack>
  );
};

export default Create;