import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './src/screens/HomeScreen/Home';
import OrderPage from './src/screens/OrderPage/OrderPage';
import ProfilePage from './src/screens/ProfilePage/ProfilePage';
import AIPage from './src/screens/AIPage/AIPage';
import CategoryPage from './src/screens/CategoryScreens/CategoryPage';
import ProductPage from './src/screens/ProductScreens/ProductPage/ProductPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREEN_NAAMES } from './src/config/screenNames';
import { Platform,  Linking, View, Text, Easing } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { UserRound, Brain, ShoppingBag, House } from 'lucide-react-native';
export const mmkv_strorage = new MMKV();
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
// create stack for showing tab even the these routes are not part of bottom navigation
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={SCREEN_NAAMES.HOME} component={Home} />
      <HomeStack.Screen name={SCREEN_NAAMES.CATEGORY_PAGE} component={CategoryPage} />
      <HomeStack.Screen name={SCREEN_NAAMES.PRODUCT_PAGE} component={ProductPage} />
    </HomeStack.Navigator>
  );
}
// bottom tab navigation
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        animation: 'shift',

        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          },
        },
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            opacity: current.progress.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0, 1, 0],
            }),
          },
        }),
        tabBarIcon: ({ color, size }) => {
          let IconComponent;

          switch (route.name) {
            case SCREEN_NAAMES.HOME:
              IconComponent = House;
              break;
            case SCREEN_NAAMES.AI_PAGE:
              IconComponent = Brain;
              break;
            case SCREEN_NAAMES.ORDER_PAGE:
              IconComponent = ShoppingBag;
              break;
            case SCREEN_NAAMES.PROFILE_PAGE:
              IconComponent = UserRound;
              break;
            default:
              return null;
          }

          return <IconComponent color={color} size={size} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
       <Tab.Screen name={SCREEN_NAAMES.HOME} component={HomeStackNavigator} />
      <Tab.Screen name={SCREEN_NAAMES.AI_PAGE} component={AIPage} />
      <Tab.Screen name={SCREEN_NAAMES.ORDER_PAGE} component={OrderPage} />
      <Tab.Screen name={SCREEN_NAAMES.PROFILE_PAGE} component={ProfilePage} />
    </Tab.Navigator>
  );
}
// 
function AppRouter() {

  const [isReady, setIsReady] = React.useState(Platform.OS === 'web'); // Don't persist state on web since it's based on URL
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          const savedState = mmkv_strorage.getString(PERSISTENCE_KEY);
          const state = savedState ? JSON.parse(savedState) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }
  return (
    <GestureHandlerRootView>
      <NavigationContainer 
       initialState={initialState}
       onStateChange={(state) =>
         mmkv_strorage.set(PERSISTENCE_KEY, JSON.stringify(state))
       }
      
      >
        <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
        <Stack.Screen name="Main" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>

  );
}

export default React.memo(AppRouter);
