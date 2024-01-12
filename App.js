import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { GluestackUIProvider, Text } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Home, History, Favorite, Profile, FormPenyewaan, FormPengembalian, Register, Login, Katalog, GetInto1, GetInto2, DetailBarang, EditProfile, CreateItem, EditItem, ProfileRenter, Detail, Toko, SplashScreens, Aturan, Sop1, CekResi } from "./screens/Index";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const noHead = { headerShown: false };
const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              return (
                <Ionicons
                  name={iconName}
                  size={33}
                  color={focused ? '#021C35' : '#021C35'}
                />
              );
            case 'Favorite':
              iconName = focused ? 'favorite' : 'favorite-outline';
              return (
                <MaterialIcons
                  name={iconName}
                  size={35}
                  color={focused ? '#021C35' : '#021C35'} />
              );
            case 'History':
              iconName = focused ? 'history' : 'history';
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={35}
                  color={focused ? '#021C35' : '#021C35'}
                />
              );
            case 'Profile':
              iconName = focused ? 'person-circle-sharp' : 'person-circle-outline';
              return (
                <Ionicons
                  name={iconName}
                  size={35}
                  color={focused ? '#021C35' : '#021C35'} />
              );
            default:
              return null;
          }
        },
        tabBarIconStyle: {
          // marginTop: ,
        },
        tabBarStyle: {
          position: 'absolute',
          width: '80%',
          marginHorizontal: '10%',
          marginBottom: 15,
          height: 70,
          borderBottomWidth: 6,
          borderEndWidth: 6,
          borderTopWidth: 1,
          borderStartWidth: 1,
          borderColor: '#021C35',
          backgroundColor: '#fff',
          borderRadius: 10,
        },
        tabBarLabel: ({ focused }) => {
          // Mengembalikan null jika tab sedang difokuskan
          return focused ? null : <Text style={{ display: 'none' }}></Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={noHead} />
      <Tab.Screen name="Favorite" component={Favorite} options={noHead} />
      <Tab.Screen name="History" component={History} options={noHead} />
      <Tab.Screen name="Profile" component={Profile} options={noHead} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreens">
          <Stack.Screen name="Tabs" component={Tabs} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="FormPenyewaan" component={FormPenyewaan} options={{ title: 'Penyewaan barang', statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="FormPengembalian" component={FormPengembalian} options={{ title: 'Pengembalian barang', statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="Register" component={Register} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="Login" component={Login} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="Sop1" component={Sop1} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="Katalog" component={Katalog} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="SplashScreens" component={SplashScreens} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="GetInto1" component={GetInto1} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="GetInto2" component={GetInto2} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="DetailBarang" component={DetailBarang} options={{ title: 'Detail Barang', statusBarColor: 'white', statusBarStyle: 'dark', headerShadowVisible: false }} />
          <Stack.Screen name="Edit Profile" component={EditProfile} options={{ title: 'Ubah Profile', statusBarColor: 'white', statusBarStyle: 'dark', headerShadowVisible: false }} />
          <Stack.Screen name="S.O.P" component={Aturan} options={{ title: 'S.O.P', statusBarColor: 'white', statusBarStyle: 'dark', headerShadowVisible: false }} />
          {/* <Stack.Screen name="Edit Profile" component={EditProfile} options={{ headerStyle: { backgroundColor: "#021C35" }, headerTintColor: 'white', statusBarColor: '#021C35' }} /> */}
          <Stack.Screen name="Create Item" component={CreateItem} options={{ title: 'Tambah Item', statusBarColor: 'white', statusBarStyle: 'dark', headerShadowVisible: false }} />
          <Stack.Screen name="Edit Item" component={EditItem} options={{ title: 'Edit Item', statusBarColor: 'white', statusBarStyle: 'dark', headerShadowVisible: false }} />
          <Stack.Screen name="Profile Renter" component={ProfileRenter} options={{ title: 'Profile Renter', statusBarColor: 'white', statusBarStyle: 'dark', headerShadowVisible: false }} />
          <Stack.Screen name="Detail" component={Detail} options={{ title: 'Detail Kostum', statusBarColor: 'white', statusBarStyle: 'dark' }} />
          <Stack.Screen name="Toko" component={Toko} options={{ title: 'Toko', statusBarColor: 'white', statusBarStyle: 'dark', headerShadowVisible: false }} />
          <Stack.Screen name="Cek Resi" component={CekResi} options={{ ...noHead, statusBarColor: 'white', statusBarStyle: 'dark' }} />


          {/* <Stack.Screen
              name="News Detail"
              component={NewsDetail}
              options={noHead}
            /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
};

export default App;


