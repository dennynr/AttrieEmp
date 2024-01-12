import {
  Center,
  Box,
  Text,
  Pressable,
  Image,
  Input,
  InputField,
  HStack
} from "@gluestack-ui/themed";
import {
  FlatList,
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useMemo, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from '../firebase'


const History = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState('');
  const [costume, setCostumeData] = useState([]);
  // const filteredData = useMemo(() => {
  //   return costume.filter((item) =>
  //     item.title.toLowerCase().includes(searchText.toLowerCase())
  //   );
  // }, [searchText]);
  useEffect(() => {
    getUserData();
    getCostume();
    // fetchCostumeData();
  }, []);
  const filteredData = useMemo(() => {
    return costume.filter((item) =>
      item.namakostum.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, costume]);
  console.log(costume)
  const getCostume = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");

      if (userDataString) {
        const userData = JSON.parse(userDataString);

        // Pastikan userData.credential ada sebelum mengakses propertinya
        if (userData.credential && userData.credential.user) {
          const userUid = userData.credential.user.uid;
          console.log('User UID from AsyncStorage:', userUid);

          const costumeRef = firebase.database().ref("history/");
          const snapshot = await costumeRef.once("value");
          const costumeData = snapshot.val();
          console.log('hello ', costumeData)
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

  return (
    <Box padding={10} flex={1} backgroundColor="white" width={'100%'} height={'100%'}>
      <Box marginTop={10} paddingtop={10} >
        <Center >
          <Box flexDirection="row" alignItems="center" width={'95%'} borderWidth={2} borderColor="rgba(2, 28, 53, 0.6)" borderRadius={8}>
            <Ionicons name="search" size={25} color="#021C35" marginStart={20} />
            <Input
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              flex={1}
              borderWidth={0}
            >
              <InputField
                marginStart={0}
                placeholder="Cari History Pemesanan"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
            </Input>
          </Box>
        </Center>
        <Text fontSize={18} marginTop={30} marginBottom={10} marginStart={10} fontWeight="bold"> Riwayat Barang </Text>
      </Box>
      {costume.length > 0 ?
        (<FlatList
          style={{ marginBottom: 105 }}
          data={filteredData}
          keyExtractor={(item, index) => item.costumeId + index}
          renderItem={({ item }) => (
            <Pressable onPress={() => {
              navigation.navigate('FormPengembalian', { item: item })
            }}>
              <Box paddingBottom={20} paddingHorizontal={8}>

                <Box width={'auto'} paddingHorizontal={12} paddingVertical={4} height={120} bgColor="#EAEAEA" borderTopStartRadius={10} borderTopEndRadius={10}>
                  <Box flex={1} flexDirection="row">
                    <Box flex={2} flexDirection="column" padding={5}>
                      <Box flex={1}>
                        <Box flex={1}>
                          <Text fontSize={14}>{item.namakostum}</Text>
                        </Box>
                        <Box flex={3}>
                          <Text fontWeight="bold" fontSize={14}>{item.Deskripsi}</Text>
                        </Box>
                        <Box flex={2}>
                          <Text fontWeight="bold" fontSize={18}>{item.peminjaman}</Text>
                        </Box>
                      </Box>
                    </Box>
                    <Box flex={1} justifyContent="center">
                      <Image source={{ uri: item.imageUrl }}
                        resizeMode="cover"
                        width={'100%'}
                        height={'80%'}
                        borderRadius={6}
                        alt="img"
                        role="img"
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  height={30}
                  backgroundColor={item.review === "Belum direview" ? "#656351" : "green"}
                  borderBottomStartRadius={10}
                  borderBottomEndRadius={10}
                >
                  <HStack justifyContent="center" alignItems="center">
                    {item.review === "Belum direview" ?
                      <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color="#fff"
                        marginEnd={2}
                        marginTop={3}
                      /> : <Ionicons name="ios-checkmark-circle-outline" size={20} color="#fff"
                        marginEnd={2} marginTop={3} />}

                    <Text color="#fff">{item.review}</Text>
                  </HStack>
                </Box>
              </Box>
            </Pressable>
          )}
        />) : (
          <Box alignItems="center" marginTop={200}>
            <Text>Setiap Kenangan akan ditampung disini</Text>
          </Box>

        )}

    </Box >
  );
}

export default History