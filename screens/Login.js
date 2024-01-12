import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  InputField,
  InputIcon,
  EyeOffIcon,
  InputSlot,
  Button,
  ButtonText,
  VStack,
  EyeIcon,
  Image,
  HStack,
  Divider,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../firebase";
import Errormodal from "../components/Errormodal";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false)
  const [errorModalText, setErrorModalText] = useState('');
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  // useEffect(() => {
  //   getUser();
  // }, []);
  // const getUser = async () => {
  //   try {
  //     // Ambil data dari AsyncStorage
  //     const userData = await AsyncStorage.getItem("user-data");
  //     if (userData !== null) {
  //       // Diarahkan ke Halaman Home
  //       navigation.replace("Tabs");
  //     } else {
  //       setIsLoading(false);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  const loginHandler = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const userEmail = userCredential.user.email;

      // Ambil data pengguna dari database berdasarkan alamat email
      const userRef = firebase.database().ref('users');
      const snapshot = await userRef.orderByChild('email').equalTo(userEmail).once('value');
      console.log('ini snapshot ',snapshot);
      const userDataFromDatabase = snapshot.val();

      console.log('userDataFromDatabase:', userDataFromDatabase);

      if (userDataFromDatabase) {
        // Dapatkan kunci pengguna (UID) dari hasil query
        const uid = Object.keys(userDataFromDatabase)[0];
        console.log('UID from database:', uid);

        // Simpan data pengguna ke AsyncStorage atau lakukan tindakan lain
        saveUserData(email, password, userCredential, uid, userDataFromDatabase[uid]);
      } else {
        console.error('Data pengguna tidak ditemukan di Firebase Realtime Database.');
      }
    } catch (error) {

      setShowModal(true)
      console.error(error.message);
    }
  };


  const saveUserData = async (email, password, credential, uid, userDataFromDatabase) => {
    const userData = { email, password, credential, uid: userDataFromDatabase.uid, ...userDataFromDatabase };
    try {
      // Menyimpan data ke AsyncStorage
      await AsyncStorage.setItem("user-data", JSON.stringify(userData));
      // Diarahkan ke Home
      navigation.replace("Tabs", { email: email });
    } catch (error) {

      console.error(error);
    }
  };



  return (
    <Box flex={1} backgroundColor="#021C35" >
      <Errormodal showModal={showModal} setShowModal={setShowModal}/>
      <Box alignItems="center" justifyContent="center" flex={1}>
        <Image role="img" alt="hello" width={220} height={310} resizeMode="cover" source={require('../assets/images/Logo.png')} />
      </Box>
      <Box justifyContent="center" alignItems="center">

        <Box
          width="90%"
          backgroundColor="white"
          padding={20}
          rounded={20}
          marginBottom={20}
        >

          <VStack space="l">
            <Box alignItems="center">
              <Text fontWeight="bold" fontSize={20}>Masuk Akun</Text>
            </Box>

            <VStack space="md" marginTop={10}>
              <Input
                borderBottomWidth={3}
                borderEndWidth={3}
                borderTopWidth={1}
                borderStartWidth={1}
                rounded={7}
                marginBottom={10}
                borderColor='#021C35'
              >
                <InputField value={email} type="text" placeholder="Email" onChangeText={(value) => setEmail(value)} placeholderTextColor={"grey"} />
              </Input>
            </VStack>
            <VStack space="md">
              <Input
                borderBottomWidth={3}
                borderEndWidth={3}
                borderTopWidth={1}
                borderStartWidth={1}
                rounded={7}
                borderColor='#021C35'>
                <InputField value={password} placeholder="Password" type={showPassword ? "text" : "password"} onChangeText={(value) => setPassword(value)} placeholderTextColor={"grey"}/>
                <InputSlot pr="$3" onPress={handleTogglePassword}>
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    color={'blue'}
                  />
                </InputSlot>
              </Input>
            </VStack>
            <Button
              backgroundColor="#DF9B52"
              marginTop={30}
              rounded={5}
              onPress={loginHandler}

            >
              <ButtonText color="$white">Login</ButtonText>
            </Button>
            <HStack alignItems="center" my={3}>
              <Divider color="gray" thickness={1} flex={1} />
              <Text color="gray" fontSize={16} px={3}>
                or
              </Text>
              <Divider color="gray" thickness={1} flex={1} />
            </HStack>
            <Button
              backgroundColor="#021C35"
              onPress={() => navigation.navigate('Register')}
              rounded={5}
            >
              <ButtonText color="$white">Register</ButtonText>
            </Button>
          </VStack>
        </Box>
      </Box>

    </Box>
  );
}

export default Login;
