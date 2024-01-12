import { GluestackUIProvider, Heading, Center, Box, Text, Pressable, Image, HStack, VStack, ScrollView } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../firebase";
import { useState, useEffect } from "react";
const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');
  const logoutHandler = () => {
    // Logout dari Firebase
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Hapus data user dari AsyncStorage
        removeUserData();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");
      // console.log("Data from AsyncStorage:", userDataString)
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  const removeUserData = async () => {
    try {
      // Menghapus data dari AsyncStorage
      await AsyncStorage.removeItem("user-data");
      // Diarahkan ke Login
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
    }
  };
  console.log(userData)
  return (
    <ScrollView bgColor='white'>
      <Box flex={1} bgColor='#021C35' alignItems='center'>
        <Box flex={1} alignItems="center">
          {userData.imageProfile ? (
            <Image
              role="img"
              alt="Profile Image"
              width={120}
              height={120}
              rounded={100}
              marginTop={50}
              source={{ uri: userData.imageProfile }}
              borderWidth={1}
              borderColor="white"
            />
          ) : (
            <Image
              role="img"
              alt="Default Avatar"
              width={120}
              height={120}
              rounded={100}
              marginTop={50}
              source={require('../assets/images/avatar.png')}
            />
          )}
        </Box>
        <Heading color="white" fontSize={20} marginTop={20}>{userData.username}</Heading>
        <Box borderBottomWidth={2} borderColor="white" height={20} width={70} />
        <Text fontSize={18} color="#DCB894" marginTop={20} >{userData.number}</Text>
        <Box flex={2} marginTop={80} height={'100%'} width={"100%"} borderTopLeftRadius={50} borderTopRightRadius={50} backgroundColor="white">

          {/* <Box alignItems="center" marginTop={20}>
            <Heading color="#545454" fontSize={25}>{userData.username}</Heading>
          </Box> */}

          <HStack marginTop={30}>
            <Pressable flex={1} alignItems="center" onPress={() => navigation.navigate('Profile Renter')} >
              <Image
                role="img"
                alt="Default Avatar"
                width={75}
                height={75}
                rounded={100}
                source={require('../assets/icons/Toko.png')}
              />
              <Text>Proflie Renter</Text>
            </Pressable>
            <Pressable flex={1} alignItems="center" onPress={() => navigation.navigate('Edit Profile', { dataku: userData })} >
              <Image
                role="img"
                alt="Default Avatar"
                width={75}
                height={75}
                rounded={100}
                source={require('../assets/icons/UbahProfile.png')}
              />
              <Text>Ubah Profile</Text>
            </Pressable>
            <Pressable flex={1} alignItems="center" onPress={() => navigation.navigate('Create Item')} >
              <Image
                role="img"
                alt="Default Avatar"
                width={75}
                height={75}
                rounded={100}
                source={require('../assets/icons/TambahProduk.png')}
              />
              <Text>Tambah Produk</Text>
            </Pressable>
          </HStack>
          <HStack marginTop={30} >
            <Pressable flex={1} alignItems="center" onPress={() => navigation.navigate('S.O.P')}>
              <Image
                role="img"
                alt="Default Avatar"
                width={75}
                height={75}
                rounded={100}
                source={require('../assets/icons/SOP.png')}
              />
              <Text>S.O.P</Text>
            </Pressable>
            <Pressable flex={1} alignItems="center" onPress={() => navigation.navigate('Cek Resi')}>
              <Image
                role="img"
                alt="Default Avatar"
                width={75}
                height={75}
                rounded={100}
                source={require('../assets/icons/CekResi.png')}
              />
              <Text >Cek Resi</Text>
            </Pressable>
            <Pressable flex={1} alignItems="center" onPress={logoutHandler} >
              <Image
                role="img"
                alt="Default Avatar"
                width={75}
                height={75}
                rounded={100}
                source={require('../assets/icons/Keluar.png')}
              />
              <Text>Keluar</Text>
            </Pressable>
          </HStack>
        </Box>
      </Box>
    </ScrollView>


  )
}

export default Profile