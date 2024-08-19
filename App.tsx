import {StyleSheet, useColorScheme} from 'react-native';
import React from 'react';
import Activities from './src/screens/Activities.tsx';
import Profil from './src/screens/Profil.tsx';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import {useTheme} from './src/hooks/useTheme.tsx';
import {ThemeProvider} from 'styled-components';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const darkTheme = {
    background: '#282828',
    foreground: '#FAFAFA',
    viewColor: '#383838',
    subViewColor: '#575757',
    buttonColor: '#282828',
    buttonTextColor: 'white',
    purple: '#382bf0',
    orange: '#f44336',
};
const lightTheme = {
    background: '#FAFAFA',
    foreground: '#1A1A1A',
    viewColor: 'white',
    subViewColor: 'white',
    buttonColor: 'blue',
    buttonTextColor: 'white',
    purple: '#382bf0',
    orange: '#f44336',
};


const Tab = createBottomTabNavigator();
createNativeStackNavigator();

const App: React.JSX.Element = () => {
  //const [theme, setTheme] = useTheme();
    const scheme = useColorScheme();
    return (
      <ThemeProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
          <NavigationContainer >
              <Tab.Navigator
                  screenOptions={({ route }) => ({
                      tabBarIcon: ({ focused, color, size }) => {
                          let iconName;
                          if (route.name === 'Activities') {
                              iconName = 'tasks';
                          } else if (route.name === 'Profil') {
                              iconName = focused ? 'user-alt' : 'user';
                          }
                          return <FontAwesome5 name={iconName} size={size} color={color} />;
                      },
                      tabBarActiveTintColor: '#f44336',
                      tabBarInactiveTintColor: 'gray',
                      tabBarStyle: {
                          backgroundColor: scheme === 'dark' ? darkTheme.viewColor : lightTheme.viewColor,
                      },
                  })}
              >
                  <Tab.Screen name="Activities" component={Activities} options={{ tabBarBadge:2, headerShown: false }} />
                  <Tab.Screen name="Profil" component={Profil} options={{ headerShown: false }} />
              </Tab.Navigator>
          </NavigationContainer>
      </ThemeProvider>
  );
};
StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
