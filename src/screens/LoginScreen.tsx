import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, InteractionManager } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/stack';
import HandyColors from "../../colors";
import { useUser } from '../context/UserContext';
import { login } from '../api/user';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setToken, setUserData } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      const { token, id, email: userEmail, name } = response;

      if (!token) {
        throw new Error('로그인에 실패했습니다.');
      }

      // 사용자 데이터 저장
      const userData = {
        id,
        email: userEmail,
        name,
      };

      // 토큰과 사용자 데이터를 AsyncStorage에 저장
      await setToken(token);
      await setUserData(userData);
    } catch (error) {
      console.error('Login error:', error);
      InteractionManager.runAfterInteractions(() => {
        Alert.alert('오류', '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label="이메일"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
          loading={isLoading}
          disabled={isLoading}
        >
          로그인
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.signUpButton}
        >
          회원가입
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  loginButton: {
    padding: 4,
  },
  signUpButton: {
    padding: 4,
  },
});

export default LoginScreen;
