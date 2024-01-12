
import React from 'react';
import { Box, Button, ButtonText, Image, Text } from '@gluestack-ui/themed';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import firebase from "../firebase";
const GetInto1 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  return (
    <Box backgroundColor='#eee' justifyContent='center' alignItems='center'>
      <Box Width={'100%'}>
        <Image role='img' resizeMode='contain' alt='japir' width={200} marginTop={10} source={require('../assets/images/letter.png')} />
      </Box>
      <Box Width={'100%'} marginBottom={20}>
        <Image role='img' resizeMode='contain' alt='japir' width={200} height={400} source={require('../assets/images/getinto2.png')} />
      </Box>
      <Box width={"80%"}>
        <Text fontSize={18} fontWeight='bold' color='black' textAlign='center' >
          Selamat Datang di Attire Emporium
        </Text>
        <Text fontSize={13} color='#000000' textAlign='center' marginTop={10} marginLeft={15} marginRight={15}>
          Tempatnya penyewaan fashion pilihan untuk penampilanmu yang tak terlupakan!
        </Text>
      </Box>
      <Button
        backgroundColor='#021C35'
        onPress={() => navigation.replace('Login')}
        height={40}
        width={"75%"}
        marginTop={20}
        rounded={8}
      >
        <ButtonText fontSize={16} fontWeight='bold'>
        Masuk
        </ButtonText>
      </Button>
      <Button
        backgroundColor='transparent'
        onPress={() => navigation.navigate('Register')}
        height={40}
        width={"75%"}
        marginTop={20}
        borderWidth={2}
        borderColor='#021C35'
        borderEndWidth={4}
        borderBottomWidth={4}
        rounded={8}
      >
        <ButtonText fontSize={16} color='#021C35' fontWeight='bold'>
        Belum ada akun? Daftar dulu
        </ButtonText>
      </Button>
    </Box>

  );
};

export default GetInto1;
