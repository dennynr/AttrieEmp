import React, { useState, useEffect } from 'react';
import {
  Image,
  Heading,
  Box,
  Text,
  ScrollView,
  HStack,
  VStack,
  Pressable,
  AvatarImage,
  Avatar,
  FlatList,
  AvatarFallbackText
} from "@gluestack-ui/themed";
import Header from '../components/Header';
import { Entypo, FontAwesome, EvilIcons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Platform } from 'react-native';
// import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import datas from '../data/datas';
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from '../firebase'
const { width: screenWidth } = Dimensions.get('window');

const Home = ({ route }) => {

  const navigation = useNavigation();
  const [userData, setUserData] = useState('');
  const [costume, setCostumeData] = useState([]);
  const [isMounting, setIsMounting] = useState(true);
  const [username, setUsername] = useState('')
  useEffect(() => {
    getUserData();
    getCostume();
    setUsername(userData.username)
  }, []);
  console.log("ini usernameku", username)

  const refresh = () => {
    navigation.replace("Tabs");
  }
  // console.log('hasilnya yaaaaituuu '+ costume)

  // const fetchCostumeData = async () => {
  //   try {
  //     const costumesSnapshot = await firebase.database().ref('costumes').once('value');
  //     const costumesData = costumesSnapshot.val();

  //     if (costumesData) {
  //       console.log("All Costumes Information:");

  //       // Extracting all items from costumeData
  //       const costumeArray = Object.entries(costumesData).map(([costumeId, costume]) => ({
  //         costumeId,
  //         ...costume,
  //       }));

  //       // Log each object in the array separately
  //       costumeArray.forEach((costume, index) => {
  //         console.log(`Object ${index + 1}:`, costume);
  //       });

  //       // Set all items in the costumeData state
  //       setCostumeData(costumeArray);
  //     } else {
  //       console.log("No costumes found");
  //     }
  //   } catch (error) {
  //     console.error('Error fetching costumes data:', error);
  //   }
  // };

  console.log('Kostum terfilter', costume)

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

  const getCostume = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("user-data");

      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const username = userData.username;
        console.log('Username from AsyncStorage:', username);

        const costumeRef = firebase.database().ref("costumes/");
        const snapshot = await costumeRef.once("value");
        const costumeData = snapshot.val();

        if (costumeData) {
          const availableCostumes = await Promise.all(
            Object.entries(costumeData)
              .filter(([_, costume]) => {
                console.log('Hardcoded string:', "dennydaffazz");
                console.log('Variable value:', username);
                console.log('Costume username and status:', costume.username, costume.status);
                return costume.username !== username && costume.status !== "Dipinjam";
              })
              .map(async ([costumeId, costume]) => {
                const imageUrl = await getDownloadUrl(costume.filename);

                // Hitung rata-rata rating
                const ratings = costume.rating || {};
                let totalRating = 0;
                let numberOfRatings = 0;

                if (typeof ratings === 'object') {
                  for (const ratingId in ratings) {
                    if (ratings.hasOwnProperty(ratingId)) {
                      const ratingValue = ratings[ratingId]?.rating;
                      if (typeof ratingValue === 'number') {
                        totalRating += ratingValue;
                        numberOfRatings++;
                      }
                    }
                  }
                }

                const averageRating = numberOfRatings > 0 ? (totalRating / numberOfRatings).toFixed(1) : '0';

                return { costumeId, ...costume, imageUrl, averageRating };
              })
          );

          console.log('Available Costumes:', availableCostumes);
          setCostumeData(availableCostumes);

          return availableCostumes;
        } else {
          setCostumeData([]);
          return [];
        }
      } else {
        // Handle case where user data is not available
        console.error('User data not found.');
        setCostumeData([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching costumes data:", error);
      setCostumeData([]);
      return [];
    }
  };


  console.log(userData)
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
  const MAX_NAME_LENGTH = 13;

  const Itemku = ({ costume }) => {
    const handlePress = () => {
      navigation.navigate('DetailBarang', { item: costume });
    };
    const truncatedName = costume.costumeName.length > MAX_NAME_LENGTH
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
                {truncatedName}
              </Text>
              <Text marginStart={90} position='absolute' fontSize={12} color="#777">
                <FontAwesome name="star" size={10} color="#FFE81A" /> {costume.averageRating}
              </Text>
            </HStack>
            <Text fontSize={14} marginTop={5} marginBottom={5} fontWeight="bold">
              Rp {costume.rentalPrice},- / Hari
            </Text>
            <Text fontSize={13} color="#777">
              {costume.username}
            </Text>
          </Box>
        </Box>
      </Pressable>
    );
  };
  return (
    <Box >
      <StatusBar backgroundColor={'#ffff'} barStyle={'dark-content'} />
      <ScrollView bgColor='white' width={'100%'} height={'100%'}>
        <Header title={"Header"} />

        <Box marginTop={10} rounded={5}>
          <Box p={20} >
            <LinearGradient
              // Background Linear Gradient
              colors={['#021C35', '#0174BE']}
              style={{ width: '100%', height: 100, borderRadius: 10 }}

              end={{ x: 1, y: 2 }}
            >
              <Box width={'100%'} height={'auto'} rounded={10}>
                <HStack justifyContent='center' alignItems='center' >
                  <VStack marginStart={30} marginEnd={100} marginTop={20}>
                    <Text color='white' fontSize={15}>Selamat Datang</Text>
                    <Heading color='white' fontSize={20}>{userData.username}</Heading>
                  </VStack>
                  <Box marginTop={15}>
                    <Pressable onPress={() => navigation.navigate('Profile')}>
                      <Avatar size="lg">

                        <Image
                          source={userData.imageProfile ? { uri: userData.imageProfile } : require("../assets/images/avatar.png")}
                          width={'100%'}
                          height={'100%'}
                          alt="Profile Image"
                          rounded={100}
                          role="img"
                        />

                      </Avatar>


                    </Pressable>
                  </Box>
                </HStack>

              </Box>
            </LinearGradient>
          </Box>
          {/* <Carousel
            marginTop={10}
            sliderWidth={screenWidth}
            sliderHeight={screenWidth}
            itemWidth={screenWidth - 50}
            data={costume}
            renderItem={renderItem}
            hasParallaxImages={true}
            autoplay={true}
            loop={true}
          /> */}
        </Box>
        <Box paddingVertical={5} rounded={5} >
          <Heading flex={1} marginStart={20} color={'#021C35'}>Kategori</Heading>
          <Box>
            <ScrollView horizontal marginStart={20} paddingVertical={10}
              showsHorizontalScrollIndicator={false}>
              <Pressable onPress={() => navigation.navigate('Katalog', { category: 'Helloween' })}>
                <Image w={230} alt='halloweeen' marginEnd={10} height={100} role='img' source={require("../assets/images/banner2.png")} />
              </Pressable>

              <Pressable onPress={() => navigation.navigate('Katalog', { category: 'Batik' })}>
                <Image w={230} alt='batik' marginEnd={10} height={100} role='img' source={require("../assets/images/banner1.png")} />
              </Pressable>
            </ScrollView>
          </Box>
        </Box>
        <HStack paddingVertical={10}>
          <Box rounded={5} >
            <Heading flex={1} marginStart={20} color={'#021C35'}>Katalog</Heading>
          </Box>
          <Pressable
            onPress={() => navigation.replace("Tabs")}
            mt={8}
          >
            <Text>
              <EvilIcons name="refresh" size={24} color="black" />
            </Text>
          </Pressable>
        </HStack>
        {/* <Box flex={1} flexDirection='row' marginBottom={15} padding={10}>
        {ENTRIES1.slice(0, 2).map(item => (
          <Itemku key={item.id} item={item} />
        ))}

      </Box> */}
        <Box justifyContent='center' p={10}>
          <HStack
            flexDirection="row"
            flexWrap="wrap"
            alignItems="center"
            marginStart={15}
            marginBottom={130}
            space="2xl"
          >
            {costume.map((item) => (
              <Itemku key={item.costumeId} costume={item} navigation={navigation} />
            ))}
          </HStack>
        </Box>
      </ScrollView>


    </Box>

  );
};

export default Home;
