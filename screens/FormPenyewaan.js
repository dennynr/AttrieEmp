import React, { useState } from "react";
import {
  Image,
  Heading,
  Textarea,
  TextareaInput,
  Box,
  Text,
  Pressable,
  Center,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Icon,
  CloseIcon,
  ModalBody,
  Button,
  ButtonText,
  ModalCloseButton,
  HStack,
} from "@gluestack-ui/themed";
import DateTimePicker from '@react-native-community/datetimepicker';
// // import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../firebase";

const FormPenyewaan = ({ route }) => {
  console.log(route.params.data)
  const data = (route.params.data);
  const [showModal, setShowModal] = useState(false)
  const ref = React.useRef(null)
  const navigation = useNavigation();
  const [Deskripsi, setDeskripsi] = useState('')
  const [pickupDate, setPickupDate] = useState(new Date()); // State untuk tanggal peminjaman
  const [returnDate, setReturnDate] = useState(new Date()); // State untuk tanggal pengembalian
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  console.log(data.number)

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
  const handleGoBack = () => {
    // Gunakan fungsi navigate untuk kembali ke layar sebelumnya
    navigation.goBack();
  };



  const onPickupDateChange = (_, selected) => {
    if (selected) {
      setPickupDate(selected);
      setShowPickupDatePicker(false);
    }
  };

  const onReturnDateChange = (_, selected) => {
    if (selected) {
      setReturnDate(selected);
      setShowReturnDatePicker(false);
    }
  };
  console.log(data.number)
  const handlePostCostume = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");

      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const uid = userData.credential.user.uid;
        const username = userData.username;
        const number = userData.number;
        const status = 'Dipinjam'; // Assuming 'Tersedia' is the default status
        const costumeId = data.costumeId;
        const namakostum = data.costumeName;
        const peminjaman = pickupDate.toDateString();
        const pengembalian = returnDate.toDateString();
        const toko = data.username;
        const statusRef = firebase.database().ref(`costumes/${data.costumeId}`);
        const nomor = data.number
        const imageUrl = data.imageUrl
        const snapshot = await statusRef.once("value");
        const existingCostume = snapshot.val();
        const review = "Belum direview";

        // Menambahkan UID pengguna ke data kostum dengan ID unik
        const database = firebase.database();
        const historyRef = database.ref(`history/`);
        const rating = 0;

        // Menggunakan push() untuk menambahkan ID unik ke setiap entri di history
        const newHistoryEntryRef = historyRef.push();
        const idHistory = newHistoryEntryRef.key;

        newHistoryEntryRef.set({
          costumeId,
          uid,
          namakostum,
          peminjaman,
          pengembalian,
          toko,
          review,
          rating,
          idHistory,
          Deskripsi,
          imageUrl
        });

        if (existingCostume) {
          // Perbarui data kostum
          const updatedCostume = {
            status,
          };

          await statusRef.update(updatedCostume);
        }

        const whatsappLink = `https://api.whatsapp.com/send/?phone=62${nomor}&text=Halo+kak%2C+saya+ingin+menyewa+kostum+*${data.costumeName}*+dengan\n*Tanggal+pengambilan :*\n${pickupDate.toDateString()}\n*Tanggal+pengembalian :*\n${returnDate.toDateString()}\n*Deskripsi :*\n${Deskripsi}`;
        Linking.openURL(whatsappLink)
          .catch((err) => console.error('Error opening WhatsApp:', err));
        // Menambahkan UID pengguna ke data kostum

        // Reset nilai form setelah posting
        navigation.replace("Tabs");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <Box flex={1} flexDirection="column" bgColor="#fff" paddingHorizontal={10}>
      <Box flex={2} bgColor="#fff" alignItems="center" marginTop={8}>
        <Box width={'90%'}>
          <Image
            source={{ uri: data.imageUrl }}
            width={'100%'} height={'100%'}
            alt="img"
            resizeMode="cover"
            role="img"
          />
        </Box>
      </Box>
      <Box flex={3} backgroundColor="#fff">
        <Box height={'100%'} backgroundColor="white" borderTopEndRadius={20} borderTopStartRadius={20} padding={10}>
          <Text fontWeight="bold" fontSize={16} marginTop={10}>Form Penyewaan</Text>

           <Box flexDirection="column" justifyContent="space-between" marginTop={15}>
            <Box width="100%">
              <HStack>
                <Text marginBottom={5} fontSize={14}>
                  Tanggal Peminjaman:
                </Text>
              </HStack>
              <Pressable onPress={() => setShowPickupDatePicker(true)}>
                <Text padding={8} borderWidth={1} borderRadius={5} marginBottom={20}
                  borderBottomWidth={3}
                  borderEndWidth={3}
                  borderTopWidth={1}
                  borderStartWidth={1}
                  borderColor='#021C35'>
                  {pickupDate.toDateString()}
                </Text>
              </Pressable>
              {showPickupDatePicker && (
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="calendar"
                  onChange={onPickupDateChange}
                  minimumDate={new Date()}
                  style={{
                    borderBottomWidth: 3,
                    borderEndWidth: 3,
                    borderTopWidth: 1,
                    borderStartWidth: 1,
                    borderColor: '#021C35',
                    // Tambahkan properti gaya lainnya di sini sesuai kebutuhan
                  }}
                />

              )}
            </Box>

            <Box width="100%">
              <HStack>
                <Text marginBottom={5} fontSize={14}>
                  Tanggal Pengembalian:
                </Text>
              </HStack>
              <Pressable onPress={() => setShowReturnDatePicker(true)} >
                <Text padding={8} borderWidth={1} borderRadius={5} marginBottom={20}
                  borderBottomWidth={3}
                  borderEndWidth={3}
                  borderTopWidth={1}
                  borderStartWidth={1}
                  borderColor='#021C35'>
                  {returnDate.toDateString()}
                </Text>
              </Pressable>
              {showReturnDatePicker && (
                <DateTimePicker
                  value={returnDate}
                  mode="date"
                  display="calendar"
                  minimumDate={new Date()}
                  onChange={onReturnDateChange}
                />
              )}
            </Box>
          </Box>

          <Box>
            <Textarea
              size="md"
              isReadOnly={false}
              isInvalid={false}
              isDisabled={false}
              borderWidth={1}
              borderColor='#021C35'
              width={'100%'}
              borderBottomWidth={3}
              borderEndWidth={3}
              borderTopWidth={1}
              borderStartWidth={1}
            >

              <TextareaInput placeholder="Catatan Tambahan..." role="dialog" onChangeText={(text) => setDeskripsi(text)} />
            </Textarea>
          </Box> 

          <Center flex={1} flexDirection="row">
            <Text onPress={() => setShowModal(true)} ref={ref}
              backgroundColor="#021C35"
              paddingHorizontal={140}
              paddingVertical={10}
              borderRadius={10}
              color="white"
              fontWeight="bold"
              marginTop={0}
              fontSize={13}
            >
              Konfirmasi
            </Text>


            <Modal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false)
              }}
              finalFocusRef={ref}
            >
              <ModalBackdrop />
              <Center>
                <ModalContent>
                  <ModalHeader>
                    <Heading size="lg">Konfirmasi !</Heading>
                    <ModalCloseButton>
                      <Icon as={CloseIcon} />
                    </ModalCloseButton>
                  </ModalHeader>
                  <ModalBody>
                    <Text fontWeight="bold">
                      Nama Barang: <Text>{data.costumeName}</Text>
                    </Text>
                    <Text fontWeight="bold">
                      Tanggal Peminjaman: <Text>{pickupDate.toDateString()}</Text>
                    </Text>
                    <Text fontWeight="bold">
                      Tanggal Pengembalian: <Text>{returnDate.toDateString()}</Text>
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      action="secondary"
                      mr="$3"
                      onPress={() => {
                        setShowModal(false)
                      }}
                    >
                      <ButtonText>Batal</ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      action="positive"
                      borderWidth="$0"
                      onPress={handlePostCostume}
                    >
                      <ButtonText>Konfirmasi</ButtonText>
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Center>
            </Modal>
          </Center>
        </Box>
      </Box>
    </Box>
  );
};

export default FormPenyewaan;
