import React, { useState, useEffect } from 'react';
import { Box, Image, Button, Input, Heading, InputField, ScrollView, Pressable, Text } from "@gluestack-ui/themed";
import { Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import firebase from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
const EditProfile = ({ route }) => {
  const data = route.params.dataku;
  const [username, setusername] = useState(data.username);
  const [email, setemail] = useState(data.email);
  const [number, setnumber] = useState(data.number);
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');
  const [image, setImage] = useState(data.imageProfile);

  console.log(data);
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
  // console.log('ini userdata', userData)
  const handleSave = async () => {
    try {
      const uid = userData?.credential?.user?.uid;
      const userRef = firebase.database().ref(`users/${uid}`);
  
      let updatedUserData = { ...userData }; // Use the existing user data by default
  
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageProfile = image.substring(image.lastIndexOf('/') + 1);
        const storageRef = firebase.storage().ref().child(imageProfile);
  
        // Upload the new image to Firebase Storage
        await storageRef.put(blob);
  
        // Get the download URL for the uploaded image
        const downloadUrl = await getDownloadUrl(imageProfile);
  
        // Combine the existing user data with the new changes and image URL
        updatedUserData = { ...userData, username, number, imageProfile: downloadUrl };
  
        // Update user data in Firebase Realtime Database
        await userRef.update({
          username,
          number,
          imageProfile: downloadUrl,
        });
  
        // Set the retrieved download URL to the state
        setImage(downloadUrl);
      } else {
        // Update only username and number if no new image is selected
        updatedUserData = { ...userData, username, number };
  
        // Update user data in Firebase Realtime Database
        await userRef.update({
          username,
          number,
        });
      }
  
      // Save the updated user data to AsyncStorage
      await AsyncStorage.setItem("user-data", JSON.stringify(updatedUserData));
  
      Alert.alert(
        "Profile Diubah !",
        "Perubahan pada profil Anda telah disimpan.",
        [
          { text: "OK", onPress: () => navigation.replace('Tabs') }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle the error appropriately
    }
  };
  

  useEffect(() => {
    // Panggil fungsi untuk mengambil email setiap kali komponen di-mount
    getUserData();
  }, []);
  return (
    <ScrollView backgroundColor='white'>
      <Box flex={1} >
        <Box flex={1} alignItems="center">
          {image ? (
            <Image
              source={{ uri: image }}
              width={200}
              height={200}
              marginBottom={2}
              alt='profile'
              rounded={100}
              role='img'
              marginTop={10}
            />
          ) : (
            <Image
              source={data.imageProfile ? { uri: data.imageProfile } : require("../assets/images/avatar.png")}
              width={200}
              height={200}
              marginBottom={2}
              alt='profile'
              rounded={100}
              role='img'
              marginTop={10}
            />
          )}



          <Heading color='white' fontSize={25}>{username}</Heading>
          <Pressable borderWidth={1} p={4} rounded={5} onPress={pickImage} >
            <Text fontWeight='bold'>Ubah Foto Profil</Text>
          </Pressable>
        </Box>

        <Box flex={1} padding={20}>
          <Heading>Informasi Profil</Heading>
          <Text marginTop={10}>Username</Text>
          <Input
            marginTop={10}
            borderWidth={1}
            borderBottomWidth={3}
            borderEndWidth={3}
            borderColor='#021C35'
            placeholder="Nama Lengkap"
            rounded={7}

          >
            <InputField placeholder={userData.username} value={username} onChangeText={(text) => setusername(text)} />
          </Input>
          {/* <Text marginTop={10}>Email</Text>
          <Input
            marginTop={10}
            borderWidth={1}
            borderBottomWidth={3}
            borderEndWidth={3}
            borderColor='#021C35'
            onChangeText={(text) => setAddress(text)}
            rounded={7}
          >
            <InputField placeholder="Alamat Lengkap" />
          </Input> */}
          <Text marginTop={10}>Nomor HP</Text>
          <Input
            placeholder="Nomor Hp"
            marginTop={10}
            borderWidth={1}
            borderBottomWidth={3}
            borderEndWidth={3}
            borderColor='#021C35'
            rounded={7}


          >
            <InputField placeholder={userData.number} value={number} keyboardType="numeric" onChangeText={(text) => setnumber(text)} />
          </Input>
          <Button marginTop={20} backgroundColor="#021C35" height={50} rounded={10} onPress={handleSave}>
            <Heading color="white">Simpan Perubahan</Heading>
          </Button>
        </Box>
      </Box>
    </ScrollView>
  );
}

export default EditProfile;
