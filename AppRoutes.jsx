import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './src/screens/HomeScreen/Home';
import CategoryPage from './src/screens/CategoryScreens/CategoryPage';
import ProductPage from './src/screens/ProductScreens/ProductPage/ProductPage';

import { SCREEN_NAAMES } from './src/config/screenNames';
const storage = new MMKV();
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

import { Platform,  Linking } from 'react-native';
import { MMKV } from 'react-native-mmkv';


const Stack = createNativeStackNavigator();
function AppRouter() {

  const [isReady, setIsReady] = React.useState(Platform.OS === 'web'); // Don't persist state on web since it's based on URL
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          const savedState = storage.getString(PERSISTENCE_KEY);
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
         storage.set(PERSISTENCE_KEY, JSON.stringify(state))
       }
      
      >
        <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
                <Stack.Screen name={SCREEN_NAAMES.HOME} options={{
                  animation: 'slide_from_right',
                  animationDuration: 500
                }} component={Home} />

                <Stack.Screen name={SCREEN_NAAMES.CATEGORY_PAGE} options={{
                                animation: 'slide_from_right',
                                animationDuration: 500
                                }} component={CategoryPage} />
                                   <Stack.Screen name={SCREEN_NAAMES.PRODUCT_PAGE} options={{
                                animation: 'slide_from_right',
                                animationDuration: 500
                                }} component={ProductPage} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>

  );
}

export default React.memo(AppRouter);
