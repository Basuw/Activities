import {StyleSheet, useColorScheme} from 'react-native';
import React from 'react';
import Activities from './src/screens/Activities.tsx';
import Profil from './src/screens/Profil.tsx';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//import {useTheme} from './src/hooks/useTheme.tsx';
import {ThemeProvider} from 'styled-components';

const darkTheme = {
    background: '#282828',
    foreground: '#FAFAFA',
    viewColor: '#383838',
    subViewColor: '#575757',
    buttonColor: '#282828',
    buttonTextColor: 'white',
};
const lightTheme = {
    background: '#FAFAFA',
    foreground: '#1A1A1A',
    viewColor: 'white',
    subViewColor: 'white',
    buttonColor: 'blue',
    buttonTextColor: 'white',
};


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App: React.JSX.Element = (props) => {
  //const [theme, setTheme] = useTheme();
  const scheme = useColorScheme();
  return (
      <ThemeProvider theme={scheme==='dark' ? darkTheme : lightTheme}>
          <NavigationContainer >
              <Tab.Navigator>
                  <Stack.Screen name="Activities" component={Activities} options={{headerShown:false}} />
                  <Stack.Screen name="Profil" component={Profil} options={{headerShown:false}}/>
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
