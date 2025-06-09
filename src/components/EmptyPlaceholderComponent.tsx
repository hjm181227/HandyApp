import React, { ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from "react-native-paper";

interface EmptyPlaceholderComponentProps {
  icon: string;
  message: string;
  actionButton?: ReactNode;
}

const EmptyPlaceholderComponent = ({ icon, message, actionButton }: EmptyPlaceholderComponentProps) => {
  return (
    <View style={styles.container}>
      <Icon source={icon} size={80}/>
      <Text style={styles.message}>{message}</Text>
      {actionButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
});

export default EmptyPlaceholderComponent;
