// App.js - Navigation entry point
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import GameScreen from './src/screens/GameScreen';
import UpgradeScreen from './src/screens/UpgradeScreen';
import ShopScreen from './src/screens/ShopScreen';
import DeadScreen from './src/screens/DeadScreen';
import { Colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: Colors.bg },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Game" component={GameScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="Upgrade" component={UpgradeScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="Shop" component={ShopScreen} options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="Dead" component={DeadScreen} options={{ animation: 'fade' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
