import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { UserProvider, useUser } from './src/context/UserContext';
import { RootStackParamList } from './src/navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MainTabs from './src/navigation/tabs';
import ModalStack from './src/navigation/modalStack';
import PrivacyAgreementScreen from "./src/screens/PrivacyAgreementScreen";
import PrivacyCollectionScreen from "./src/screens/PrivacyCollectionScreen";

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
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="PrivacyAgreement" component={PrivacyAgreementScreen} />
          <Stack.Screen name="PrivacyCollection" component={PrivacyCollectionScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ModalStack" component={ModalStack} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer ref={navigationRef}>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
