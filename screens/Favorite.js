import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  GluestackUIProvider,
  Image,
  Heading,
  Box,
  Text,
  ScrollView,
  Input,
  InputSlot,
  InputIcon,
  SearchIcon,
  InputField,
  Icon,
  TrashIcon,
  ref,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Center,
  CloseIcon,
  Button,
  ButtonText,
  Pressable,
  HStack
} from "@gluestack-ui/themed";
// import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from "@react-navigation/native";
import datas from '../data/datas';
import { Entypo, FontAwesome } from "@expo/vector-icons";
import firebase from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Favorite = (props) => {

  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [entries, setEntries] = useState(datas);
  const [userData, setUserData] = useState('');
  const [costume, setCostumeData] = useState([]);
  // const filteredData = useMemo(() => {
  //   return costume.filter((item) =>
  //     item.title.toLowerCase().includes(searchText.toLowerCase())
  //   );
  // }, [searchText]);

  useEffect(() => {
    // This code will run every time the component is mounted
    getUserData();
    getCostume();
  }, []);

  console.log('ini kostumku :', costume)
  const getCostume = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");

      if (userDataString) {
        const userData = JSON.parse(userDataString);

        // Pastikan userData.credential ada sebelum mengakses propertinya
        if (userData.credential && userData.credential.user) {
          const userUid = userData.credential.user.uid;
          console.log('User UID from AsyncStorage:', userUid);

          const costumeRef = firebase.database().ref(`favoriteCostume/${userUid}`);
          const snapshot = await costumeRef.once("value");
          const costumeData = snapshot.val();

          if (costumeData) {
            const allCostumes = Object.keys(costumeData).map((costumeId) => ({
              costumeId,
              ...costumeData[costumeId],
            }));

            console.log('All Costumes:', allCostumes);

            const userCostumes = allCostumes.filter(costume => costume.uid === userUid);
            console.log('User Costumes:', userCostumes);

            setCostumeData(userCostumes);
          } else {
            setCostumeData([]);
          }
        } else {
          console.log('Credential is null or does not have user property.');
        }
      } else {
        console.log("User data not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching costumes data:", error);
      setCostumeData([]);
    }
  };

  console.log(costume)
  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");
      // console.log("Data from AsyncStorage:", userDataString)
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        const uid = userData;

        // Menampilkan UID ke konsol
        // console.log("User UID from AsyncStorage:",  userData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const MAX_NAME_LENGTH = 13;
  const Itemku = ({ costume }) => {
    const handlePress = () => {
      navigation.navigate('DetailBarang', { item: costume });
    };
    const truncatedName = costume.costumeName.length > MAX_NAME_LENGTH
      ? `${costume.costumeName.substring(0, MAX_NAME_LENGTH)}...`
      : costume.costumeName;
    return (
      <Pressable onPress={handlePress}>
        <Box
          backgroundColor="white"
          rounded={10}
          width="100%"
          paddingVertical={10}
          paddingHorizontal={20}
          hardShadow={1}
        >
          <Image
            role="img"
            alt="gambar"
            resizeMode="cover"
            width="100%"
            height={150}
            source={{ uri: costume.imageUrl }}
          />
          <Box p={5}>
            <HStack>
              <Text flex={4} fontSize={12}>
                {truncatedName}
              </Text>
              <Text marginStart={90} position='absolute' fontSize={12} color="#777">
                <FontAwesome name="star" size={10} color="#FFE81A" /> {costume.averageRating}
              </Text>
            </HStack>
            <Text fontSize={14} marginTop={5} marginBottom={5} fontWeight="bold">
              Rp {costume.rentalPrice},- / Hari
            </Text>
            <Text fontSize={13} color="#777">
              {costume.username}
            </Text>
          </Box>
        </Box>
      </Pressable>
    );
  };
  const [showModal, setShowModal] = useState(false)

  return (
    // {costume ? ()}
    <Box bgColor='white' flex={1}>
      <ScrollView >
        <Box bgColor='white' paddingVertical={10} rounded={5} >
          <Heading flex={1} marginStart={30} color={'#021C35'}>FAVORITE</Heading>
        </Box>

        <Box justifyContent='center' p={10}>
          {costume.length > 0 ? (
            <HStack
              flexDirection="row"
              flexWrap="wrap"
              marginStart={15}
              marginBottom={130}
              space="2xl"
            >
              {costume.map((item) => (
                <Itemku key={item.costumeId} costume={item} navigation={navigation} />
              ))}
            </HStack>
          ) : (
            <Box marginTop={250} justifyContent='center' alignItems='center'>
              <Text fontSize={13}>Tambahkan Favorite pada kostum yang kamu suka</Text>
            </Box>
          )}
        </Box>




      </ScrollView>
      {/* <FlatList
        data={costume}
        keyExtractor={item => item.costumeId}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Itemku costume={item} />}
        onEndReachedThreshold={0.1}
        onEndReached={() => loadNext(ITEM_CNT)}
        style={{ marginBottom: 100 }}
      /> */}
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
              <Heading size="lg">Hapus Favorite</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Text fontWeight="bold">
                Apakah Anda Yakin?
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
                bgColor='red'
                onPress={() => {
                  setShowModal(false)
                }}
              >
                <ButtonText>Hapus</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Center>
      </Modal>
    </Box>



  );
};

export default Favorite;