import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, useUser } from './src/context/UserContext';
import { RootStackParamList } from './src/navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import MainTabs from './src/navigation/tabs';
import SettingScreen from './src/screens/setting';
import SellerPage from './src/screens/seller_page';
import CartScreen from './src/screens/CartScreen';

const Stack = createStackNavigator<RootStackParamList>();

// 전역 변수로 선언
let navigationRef: any;

const Navigation = () => {
  const { token } = useUser();
  // 컴포넌트 내부에서 hook 호출
  navigationRef = useNavigationContainerRef();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Setting" component={SettingScreen} />
          <Stack.Screen name="SellerPage" component={SellerPage} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <UserProvider>
        <Navigation />
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
