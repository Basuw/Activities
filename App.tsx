import React, { useEffect, useState } from 'react';
import {Platform, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { ThemeProvider } from 'styled-components';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Activities from './src/screens/Activity/Activities';
import Profile from './src/screens/Profile';
import Login from './src/screens/Login';
import Training from './src/screens/Training';
import Register from './src/screens/Register';
import { darkTheme, lightTheme } from './src/theme/theme';
import { authService } from './src/services/AuthService';
import UserModel from './src/models/UserModel';

const Tab = createNativeBottomTabNavigator();

const App = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [user, setUser] = useState<UserModel | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  useEffect(() => {
    authService.restoreSession().then(restored => {
      setUser(restored);
      setBootstrapping(false);
    });
  }, []);

  const handleLoginSuccess = (loggedInUser: UserModel) => setUser(loggedInUser);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (bootstrapping) return null;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        {user ? (
          <NavigationContainer>
            <Tab.Navigator
              tabBarActiveTintColor={theme.main}
              tabBarInactiveTintColor={theme.secondary}>
              <Tab.Screen
                name="Activities"
                options={{
                  tabBarLabel: 'Activities',

                  tabBarIcon : () =>  Platform.select({
                    ios: {
                      type: 'sfSymbol',
                      name: 'checklist',
                    },
                    android: {
                      type: 'materialSymbol',
                      name: 'home',
                    },
                  }),
                }}>
                {() => <Activities user={user} />}
              </Tab.Screen>

              <Tab.Screen
                name="Training"
                options={{
                  tabBarLabel: 'Training',
                  tabBarIcon: ({focused}) => ({
                    sfSymbol: focused ? 'workout.fill' : '',
                  }),
                }}>
                {() => <Training user={user} onLogout={handleLogout} />}
              </Tab.Screen>

              <Tab.Screen
                name="Profile"
                options={{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({focused}) => ({
                    sfSymbol: focused ? 'person.fill' : 'person',
                  }),
                }}>
                {() => <Profile user={user} onLogout={handleLogout} />}
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        ) : authScreen === 'register' ? (
          <Register
            onRegisterSuccess={handleLoginSuccess}
            onNavigateToLogin={() => setAuthScreen('login')}
          />
        ) : (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setAuthScreen('register')}
          />
        )}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
