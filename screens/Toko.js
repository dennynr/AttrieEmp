import React, { useState, useEffect } from 'react';
import { VStack, Text, Image, FlatList, Box, Pressable, ScrollView, HStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import firebase from '../firebase'
const Toko = ({ route }) => {
    const [userData, setUserData] = useState('');
    const [costume, setCostumeData] = useState([]);
    const [tokoData, setTokoData] = useState([]);
    const navigation = useNavigation();
    const data = route.params.data;
    console.log(data);
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
    console.log(costume.averageRating);
    // console.log(costume)

    const getCostume = async () => {
        try {
            const userDataString = await AsyncStorage.getItem("user-data");
            const uidtoko = data.uid;

            if (userDataString) {
                const userData = JSON.parse(userDataString);

                // Pastikan userData.credential ada sebelum mengakses propertinya
                if (userData.credential && userData.credential.user) {
                    const userUid = userData.credential.user.uid;
                    const uidtoko = data.uid;
                    const costumeRef = firebase.database().ref("costumes/");
                    const snapshot = await costumeRef.once("value");
                    const costumeData = snapshot.val();

                    if (costumeData) {
                        const allCostumes = Object.keys(costumeData).map((costumeId) => ({
                            costumeId,
                            ...costumeData[costumeId],
                        }));

                        console.log('All Costumes:', allCostumes);

                        const userCostumes = allCostumes.filter(costume => costume.uid === uidtoko);
                        console.log('User Costumes:', userCostumes);

                        // Fetch image URLs for each costume
                        const costumesWithUrls = await Promise.all(
                            userCostumes.map(async (costume) => {
                                const imageUrl = await getDownloadUrl(costume.filename);

                                // Calculate average rating
                                const ratings = costume.rating || {};
                                let totalRating = 0;
                                let numberOfRatings = 0;

                                for (const ratingId in ratings) {
                                    if (ratings.hasOwnProperty(ratingId)) {
                                        const ratingValue = ratings[ratingId]?.rating;
                                        if (typeof ratingValue === 'number') {
                                            totalRating += ratingValue;
                                            numberOfRatings++;
                                        }
                                    }
                                }

                                const averageRating = numberOfRatings > 0 ? (totalRating / numberOfRatings).toFixed(1) : '0';

                                return { ...costume, imageUrl, averageRating };
                            })
                        );

                        console.log(costumesWithUrls);
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

    const getTokoData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem("user-data");

            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const userUid = data.uid; // Use userData here

                console.log('User UID from Firebase:', userUid);

                const tokoDataRef = firebase.database().ref(`users/${userUid}`);
                console.log(tokoDataRef)
                const tokoDataSnapshot = await tokoDataRef.once("value");
                const tokoData = tokoDataSnapshot.val();
                console.log('dennyku', tokoData);

                if (tokoData) {
                    console.log('Toko Data:', tokoData);
                    // Process tokoData as needed
                    setTokoData(tokoData);
                } else {
                    console.log('Toko data not found.');
                    setTokoData([]);
                }
            } else {
                console.log('User data not found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching toko data:', error);
            setTokoData([]);
        }
    };


    console.log('ini toko ', tokoData)
    const MAX_NAME_LENGTH = 13;

    const Itemku = ({ costume }) => {
        const handlePress = () => {
            navigation.navigate('DetailBarang', { item: costume });
        };
        const NamaDisingkat = costume.costumeName.length > MAX_NAME_LENGTH
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
    };
    useEffect(() => {
        getUserData();
        getCostume();
        getTokoData();
    }, []);
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
            <VStack flex={1} marginTop={40} padding={16}>
                <VStack alignItems='center'>
                    <Image role='img' source={tokoData.imageProfile ? { uri: tokoData.imageProfile } : require("../assets/images/avatar.png")} alt='avatar' width={150} height={150} borderRadius={75} marginBottom={16} borderWidth={5} borderColor='#DF9B52' />
                    <Text fontWeight='bold' fontSize={20}>{data.username}</Text>
                </VStack>
                {/* <Text fontSize={18} fontWeight='bold' marginBottom={8} color='#FF6347'>Informasi Pengguna</Text>
                <VStack borderBottomWidth={3} borderColor='#DDDDDD' paddingVertical={8}>
                    <Text fontSize={16} fontWeight='bold' color='#000000'>Nama:</Text>
                    <Text fontSize={16} color='#333333'>{userData.username}</Text>
                </VStack>
                <VStack borderBottomWidth={3} borderColor='#DDDDDD' paddingVertical={8}>
                    <Text fontSize={16} fontWeight='bold' color='#000000'>Email:</Text>
                    <Text fontSize={16} color='#333333'>{userData.email}</Text>
                </VStack> */}
                <Text fontSize={17} fontWeight='bold' marginBottom={8} marginTop={20} color='#021C35'>Katalog</Text>
                <Box justifyContent='center'>
                    <HStack
                        flexDirection="row"
                        flexWrap="wrap"
                        p={10}
                        marginBottom={50}
                        space="xl"
                        j
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

export default Toko;