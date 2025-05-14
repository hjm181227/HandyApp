import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, useUser } from './src/context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import RootStack from "./src/navigation/stack";

const Stack = createStackNavigator();

const Navigation = () => {
  const { token } = useUser();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      {token == null ? (
        // 인증되지 않은 상태
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
          />
        </>
      ) : (
        // 인증된 상태
        <Stack.Screen
          name="Home"
          component={RootStack}
        />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default App;
