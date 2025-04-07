import React from 'react';
import { StyleSheet } from 'react-native';
import BottomTabs from './navigation/tabs';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {

  return (
    <PaperProvider>
      <NavigationContainer>
        <BottomTabs/>
      </NavigationContainer>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 32,
    marginBottom: 16,
  },
});
