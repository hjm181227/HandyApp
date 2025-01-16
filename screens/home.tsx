import { StaticScreenProps } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            <Button 
                title="Click Here"
                onPress={() => Alert.alert('Button Clicked!')}></Button>
        </View>
    )
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});