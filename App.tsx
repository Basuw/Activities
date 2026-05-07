import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'styled-components';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Activities from './src/screens/Activity/Activities';
import Profil from './src/screens/Profil';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { darkTheme, lightTheme } from './src/theme/theme';
import { authService } from './src/services/AuthService';
import UserModel from './src/models/UserModel';

const Tab = createBottomTabNavigator();

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

  const handleLoginSuccess = (loggedInUser: UserModel) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Don't render anything while restoring session to avoid flicker
  if (bootstrapping) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        {user ? (
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  const iconName = route.name === 'Activities'
                    ? 'tasks'
                    : focused ? 'user-alt' : 'user';
                  return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.purple,
                tabBarInactiveTintColor: theme.secondary,
                tabBarStyle: {
                  backgroundColor: theme.surface,
                  borderTopColor: theme.border,
                },
                headerShown: false,
              })}
            >
              <Tab.Screen
                name="Activities"
                children={() => <Activities user={user} />}
              />
              <Tab.Screen
                name="Profil"
                children={() => <Profil user={user} onLogout={handleLogout} />}
              />
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
