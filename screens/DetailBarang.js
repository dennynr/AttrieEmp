import React, { useEffect, useState } from 'react';
import { Box, Image, Text, HStack, ScrollView, VStack } from "@gluestack-ui/themed";
import { Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import firebase from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Functional
const DetailBarang = ({ route }) => {
  const navigation = useNavigation();
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [userData, setUserData] = useState('');
  const [isCostumeFavorite, setIsCostumeFavorite] = useState(false);
  const data = route.params.item;
  const comments = data.komentar ? Object.values(data.komentar) : [];
  console.log(data)
  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");
      // console.log("Data from AsyncStorage:", userDataString);
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        setUserDataLoaded(true);  // Set userDataLoaded to true after setting userData
        const uid = userData.credential.user.uid;

        // Menampilkan UID ke konsol
        console.log("User UID from AsyncStorage:", uid);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log('ini dataku', userData)
  const checkIsCostumeFavorite = async () => {
    try {
      if (!userDataLoaded) {
        return;  // Wait for userData to be loaded before checking favorite status
      }

      const uid = userData.credential.user.uid;
      const costumeId = data.costumeId;
      const database = firebase.database();

      const favoriteRef = database.ref(`favoriteCostume/${uid}/${costumeId}`);
      const snapshot = await favoriteRef.once('value');

      setIsCostumeFavorite(snapshot.exists());
    } catch (error) {
      console.error('Error checking if costume is a favorite:', error);
    }
  };

  // useEffect Render GetUserData
  useEffect(() => {
    getUserData();
  }, []);
  // useEffect to check if costume is a favorite
  useEffect(() => {
    checkIsCostumeFavorite();
  }, [userDataLoaded]);


  // const isCostumeFavorite = async () => {
  //   try {
  //     const uid = userData.credential.user.uid;
  //     const costumeId = data.costumeId;
  //     const database = firebase.database();

  //     const favoriteRef = database.ref(`users/${uid}/favoriteCostume/${costumeId}`);
  //     const snapshot = await favoriteRef.once("value");

  //     return snapshot.exists();
  //   } catch (error) {
  //     console.error('Error checking if costume is a favorite:', error);
  //     return false;
  //   }
  // };

  // console.log(data)
  // console.log(userData)
  const showFavoritePopup = async () => {
    try {
      const uid = userData.credential.user.uid;
      const costumeId = data.costumeId;
      const database = firebase.database();
      const costumeName = data.costumeName;
      const costumeDescription = data.costumeDescription;
      const costumeCategory = data.costumeCategory;
      const number = data.number;
      const status = data.status;
      const rentalPrice = data.rentalPrice;
      const imageUrl = data.imageUrl;
      const username = data.username;
      const averageRating = data.averageRating;
      const komentar = data.komentar;

      const favoriteRef = database.ref(`favoriteCostume/${uid}/${costumeId}`);
      const snapshot = await favoriteRef.once("value");
      if (snapshot.exists()) {
        // If the costumeId exists, delete it
        favoriteRef.remove();
      } else {
        // If the costumeId doesn't exist, add it
        const favoriteData = {
          imageUrl,
          costumeName,
          costumeDescription,
          costumeCategory,
          status,
          rentalPrice,
          uid,
          number,
          username,
          averageRating,
        };
        // Pengecekan untuk memastikan komentar tidak undefined
        if (komentar !== undefined) {
          favoriteData.komentar = komentar;
        }
        database.ref(`favoriteCostume/${uid}/${costumeId}`).set(favoriteData);
      }
      navigation.replace("Tabs");
    } catch (error) {
      console.error('Error processing favorite:', error);
    }

    checkIsCostumeFavorite();
    navigation.replace("Tabs");
  };

  return (
    <Box flex={1} backgroundColor='white' >
      <ScrollView>
        <Image role='img' resizeMode='contain' source={{ uri: data.imageUrl }} alt='gambar barang' width={"100%"} height={300} />
        <Box backgroundColor='white' flex={5} width={"100%"} padding={20}>
          <HStack>
            <Box flex={1}>
              <Text fontSize={20} marginTop={5} >
                {data.costumeName}
              </Text>
            </Box>
            <Box width={'auto'} >
              <Pressable onPress={() => showFavoritePopup()}>
                {isCostumeFavorite ? (
                  <Ionicons name="heart" size={30} color="red" marginBottom={5} />
                ) : (
                  <Ionicons name="heart-outline" size={30} color="red" marginBottom={5} />
                )}
              </Pressable>
            </Box>
          </HStack>
          <HStack>
            <Box flex={1}>
              <Text fontSize={20} fontWeight='bold' marginTop={10}>
                Rp {data.rentalPrice},- / Hari
              </Text>
            </Box>
            <Box>
              <Text mt={10}>
                <FontAwesome name="star" size={19} color="#FFE81A" /> {data.averageRating}
              </Text>
            </Box>
          </HStack>

          <Pressable onPress={() => navigation.replace("Toko", { data: data })}>
            <Text fontSize={15} marginTop={20} marginBottom={10} color='#596A7A'>
              <FontAwesome5 name="store" size={13} color="#596A7A" />  {data.username}
            </Text>
          </Pressable>
          {data.status === "Dipinjam" ? (<Text fontSize={18} color="red" marginTop={2}>
            {data.status}
          </Text>) : (<Text fontSize={18} color="green" marginTop={2}>
            {data.status}
          </Text>)}
          <Text fontSize={18} marginTop={40} fontWeight="bold">Deskripsi Barang : </Text>
          <Text fontSize={16} marginTop={10}>
            {data.costumeDescription}
          </Text>
          <Text fontSize={18} marginTop={40} fontWeight="bold">Komentar : </Text>
          <Box mt={20}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box
                  key={index}
                  mb={15}
                  borderWidth={1}
                  borderBottomWidth={4}
                  borderEndWidth={4}
                  rounded={7}
                  hardShadow='1'
                  p={10}
                  backgroundColor='white'
                >
                  <VStack>
                    <Box>
                      <Text fontWeight='bold' fontSize={16}>
                        Anonimus:
                      </Text>
                    </Box>
                    <Box mb={10}>
                      <Text marginStart={10}>{comment.komentar}</Text>
                    </Box>
                  </VStack>
                </Box>
              ))
            ) : (
              <Text>Tidak Ada Komentar</Text>
            )}
          </Box>
        </Box>
      </ScrollView>

      <Box width={"100%"} alignItems='center' backgroundColor='transparent' paddingBottom={20} paddingTop={10}>
        {data.status === "Dipinjam" ? (<Pressable  >
          <Text marginTop={10} backgroundColor='grey' paddingVertical={10} paddingHorizontal={130} color='white' fontWeight='bold' borderRadius={10} >
           Dipinjam
          </Text>
        </Pressable>) : ( <Pressable onPress={() => navigation.navigate('FormPenyewaan', { data: data })} >
          <Text marginTop={10} backgroundColor='#021C35' paddingVertical={10} paddingHorizontal={100} color='white' fontWeight='bold' borderRadius={10} >
            Pesan Sekarang!
          </Text>
        </Pressable>)}
      </Box>
    </Box >
  );
}

export default DetailBarang;