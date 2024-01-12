import React, { useState, useEffect } from 'react';
import { VStack, Text, Image, FlatList, Box, Pressable, ScrollView, HStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import firebase from '../firebase'
const ProfileRenter = () => {
  const [userData, setUserData] = useState('');
  const [costume, setCostumeData] = useState([]);
  const [isMounting, setIsMounting] = useState(true); // State variable to track mounting
  const navigation = useNavigation();

  const getDownloadUrl = async (filename) => {
    const storageRef = firebase.storage().ref();
    const costumeImageRef = storageRef.child(filename);

    try {
      const downloadUrl = await costumeImageRef.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error("Error getting download URL:", error);
      return ''; // Return an empty string or handle the error accordingly
    }
  };

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

          const costumeRef = firebase.database().ref("costumes/");
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

            // Fetch image URLs for each costume
            const costumesWithUrls = await Promise.all(
              userCostumes.map(async (costume) => {
                const imageUrl = await getDownloadUrl(costume.filename);
                return { ...costume, imageUrl };
              })
            );
            console.log(costumesWithUrls)
            setCostumeData(costumesWithUrls);
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



  const Itemku = ({ costume }) => {
    const MAX_NAME_LENGTH = 13;
    const NamaDisingkat = costume.costumeName.length > MAX_NAME_LENGTH
      ? `${costume.costumeName.substring(0, MAX_NAME_LENGTH)}...`
      : costume.costumeName;
    return (
      <Pressable onPress={() => navigation.navigate('Detail', { item: costume })}   >
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
                {NamaDisingkat}
              </Text>
              <Text marginStart={90} position='absolute' fontSize={12} color="#777">
                <FontAwesome name="star" size={10} color="#FFE81A" /> {costume.averageRating}
              </Text>
            </HStack>
            <Text fontSize={14} marginTop={5} marginBottom={5} fontWeight="bold">
              Rp {costume.rentalPrice},- / Hari
            </Text>
            {costume.status === "Dipinjam" ? (<Text fontSize={13} color="red">
              {costume.status}
            </Text>) : (<Text fontSize={13} color="green">
              {costume.status}
            </Text>)}
          </Box>
        </Box>
      </Pressable>
    );
  }

  useEffect(() => {
    getUserData();
    getCostume();
  }, []);


  console.log('ini userdataku ', userData.imageProfile)
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
    <ScrollView backgroundColor='white'>
      <VStack flex={1} padding={16}>
        <VStack alignItems='center'>
          {userData.imageProfile ?
            (<Image role='img' source={{ uri: userData.imageProfile }} alt='avatar' width={150} height={150} borderRadius={75} marginBottom={16} borderWidth={5} borderColor='#DF9B52' />)
            :
            (<Image role='img' source={require('../assets/images/avatar.png')} alt='avatar' width={150} height={150} borderRadius={75} marginBottom={16} borderWidth={5} borderColor='#DF9B52' />)}
        </VStack>
        <VStack borderBottomWidth={3} borderColor='#DDDDDD' paddingVertical={8}>
          <Text fontSize={16} fontWeight='bold' color='#000000'>Nama:</Text>
          <Text fontSize={16} color='#333333'>{userData.username}</Text>
        </VStack>
        <VStack borderBottomWidth={3} borderColor='#DDDDDD' paddingVertical={8}>
          <Text fontSize={16} fontWeight='bold' color='#000000'>Email:</Text>
          <Text fontSize={16} color='#333333'>{userData.email}</Text>
        </VStack>
        <HStack flex={1} justifyContent='center'>
          <Text fontSize={13} fontWeight='bold' marginBottom={8} marginTop={20} color='#fff' paddingHorizontal={150} paddingVertical={10} borderRadius={10} backgroundColor='#000'>Kostumku</Text>
        </HStack>
        {/* <MasonryList
          data={costume}
          keyExtractor={item => item.costumeId}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <Itemku costume={item} />}
          onRefresh={() => refetch({ first: ITEM_CNT })}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadNext(ITEM_CNT)}
        /> */}
        <Box justifyContent='center'>
          <HStack
            flexDirection="row"
            flexWrap="wrap"
            p={10}
            marginBottom={10}
            space="xl"

            alignItems="center"
          >
            {costume.map((item) => (
              <Itemku key={item.costumeId} costume={item} navigation={navigation} />
            ))}
          </HStack>
        </Box>

      </VStack>
    </ScrollView>
  );
};

export default ProfileRenter;