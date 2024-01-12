
import React from 'react';
import { Box, Button, ButtonText, Image, Text } from '@gluestack-ui/themed';
import { useNavigation } from "@react-navigation/native";

const GetInto2 = () => {
  const navigation = useNavigation();
  return (
    <Box backgroundColor='#eee' justifyContent='center' alignItems='center' >
      <Box maxWidth={'100%'} marginTop={50} marginBottom={20}>
        <Image role='img' resizeMode='contain' alt='japir' width={200} height={400} source={require('../assets/images/getinto1.png')} />
      </Box>
      <Box width={"80%"}>
      <Text fontSize={22} fontWeight='bold' textAlign='center' >
          Temukan Gaya mu di Attire Emporium
        </Text>
        <Text fontSize={15} marginTop={10} marginLeft={29} marginRight={29}>
          Attire Emporium hadir untuk menyempurnakan momen-momen istimewamu. Temukan gaya yang sesuai dan buat setiap penampilan berkesan.
        </Text>
      </Box>
      <Button
        backgroundColor='#313C47'
        onPress={() => navigation.navigate('Login')}
        height={50}
        width={"65%"}
        marginTop={50}
      >
        <ButtonText fontSize={20} fontWeight='bold'>
          Start!
        </ButtonText>
      </Button>
    </Box>

  );
};

export default GetInto2;
