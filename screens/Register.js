import React, { useState } from 'react'
import {
    Box, Input, Text, InputField, Button, ButtonText, ButtonIcon, VStack, Heading,
    Divider,
    InputSlot,
    InputIcon,
    EyeOffIcon,
    EyeIcon,
    HStack,
    Image,
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Center,
    Icon,
    CloseIcon,
} from '@gluestack-ui/themed'
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../firebase";
// import 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
const Register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [number, setNumber] = useState('');
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false)
    const [errorText, setErrorText] = useState('');
    console.log(showModal)
    const ref = React.useRef(null)

    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const navigation = useNavigation();
    const handleRegister = () => {
        if (!email || !username || !password) {
            setShowModal(true)
            setErrorText("Email, username, and password are required")
            return;
        }

        const database = firebase.database();

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Panggil method untuk menyimpan data ke AsyncStorage
                saveUserData(email, username, number, password, userCredential);
                console.log(userCredential);

                const uid = userCredential.user.uid; // Ambil UID dari userCredential

                // Gunakan UID yang sudah ada untuk menyimpan data di Firebase
                database.ref(`users/${uid}`).set({
                    email,
                    username,
                    number,
                });

                navigation.replace("Tabs");
            })
            .catch((error) => {
                console.error(error);
            });
    };



    const saveUserData = async (email, username, number, password, credential) => {
        const userData = { email, username, number, password, credential };
        try {
            // Menyimpan data User ke AsyncStorage
            await AsyncStorage.setItem("user-data", JSON.stringify(userData));
            // Diarahkan ke Halaman Home dengan membawa userCredential sebagai parameter
        } catch (error) {
            console.error(error);
        }
    };


    return (

        <Box flex={1} justifyContent="center" backgroundColor="#021C35">
            <Box alignItems="center" justifyContent="center" flex={1}>
                <Image role="img" alt="hello" width={220} height={310} resizeMode="cover" source={require('../assets/images/Logo.png')} />
            </Box>
            <Box justifyContent='center' alignItems='center'>
                <VStack

                    width="90%"
                    backgroundColor="white"
                    padding={30}
                    rounded={15}

                >
                    <VStack space={'m'}>
                        <Heading textAlign='center' marginBottom={15}>Daftar Akun</Heading>
                        <Input
                            variant="outline"
                            size="md"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            borderBottomWidth={3}
                            borderEndWidth={3}
                            borderTopWidth={1}
                            borderStartWidth={1}
                            rounded={7}
                            marginBottom={5}
                            borderColor='#021C35'
                        >
                            <InputField placeholder="Username" type='text' onChangeText={(username) => setUsername(username)} placeholderTextColor={"grey"}/>
                        </Input>
                        <Input
                            variant="outline"
                            size="md"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            borderBottomWidth={3}
                            borderEndWidth={3}
                            borderTopWidth={1}
                            borderStartWidth={1}
                            marginBottom={5}
                            rounded={7}
                            borderColor='#021C35'
                        >
                            <InputField placeholder="Email@example.com" type='email' onChangeText={(email) => setEmail(email)} placeholderTextColor={"grey"}/>
                        </Input>
                        <Input
                            variant="outline"
                            size="md"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            borderBottomWidth={3}
                            borderEndWidth={3}
                            borderTopWidth={1}
                            borderStartWidth={1}
                            rounded={7}
                            marginBottom={5}
                            borderColor='#021C35'
                        >
                            <InputField placeholder="Nomor WhatsApp" keyboardType="numeric" onChangeText={(nomor) => setNumber(nomor)} placeholderTextColor={"grey"}/>
                        </Input>
                        <Input
                            variant="outline"
                            size="md"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            borderBottomWidth={3}
                            borderEndWidth={3}
                            borderTopWidth={1}
                            borderStartWidth={1}
                            rounded={7}
                            marginBottom={10}
                            borderColor='#021C35'
                        >
                            <InputField placeholder="Password" type={showPassword ? "Text" : "password"} onChangeText={(password) => setPassword(password)} placeholderTextColor={"grey"}/>
                            <InputSlot pr="$3" onPress={handleTogglePassword}>
                                <InputIcon
                                    as={showPassword ? EyeIcon : EyeOffIcon}
                                    color={'blue'}
                                />
                            </InputSlot>
                        </Input>

                        <Button size="md" variant="solid" action="primary"
                            backgroundColor="#DF9B52"
                            rounded={10}
                            isDisabled={false} isFocusVisible={false} onPress={() => { handleRegister() }} >
                            <ButtonText>Daftar</ButtonText>
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
                            onPress={() => navigation.navigate('Login')}
                            rounded={10}
                        >
                            <ButtonText color="$white">Login</ButtonText>
                        </Button>
                    </VStack>


                </VStack>
            </Box>
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                }}
                finalFocusRef={ref}
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Error</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text>
                            {errorText}
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
                            <ButtonText>Ok</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Register