import { StyleSheet} from 'react-native';
import React from 'react';
import Activities from './src/screens/Activities.tsx';
import Profil from './src/screens/Profil.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const app = () => {
  return (
  <NavigationContainer>
    <Tab.Navigator>
      <Stack.Screen name="Activities" component={Activities} options={{headerShown:false}} />
      <Stack.Screen name="Profil" component={Profil} options={{headerShown:false}}/>
    </Tab.Navigator>
  </NavigationContainer>
  );
};
StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default app;
