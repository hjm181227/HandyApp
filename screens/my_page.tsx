import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const MyPageScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>My Page Screen</Text>
            <Button 
                title="Click Here"
                onPress={() => Alert.alert('Button Clicked!')}></Button>
        </View>
    )
};

export default MyPageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});