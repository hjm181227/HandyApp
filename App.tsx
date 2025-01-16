import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import BottomTabs from './navigation/tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/home';

export default function App() {

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
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