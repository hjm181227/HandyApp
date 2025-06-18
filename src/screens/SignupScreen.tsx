import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCollectionAgreed, setIsCollectionAgreed] = useState(false);

  const handleSignup = async () => {
    if (!isAgreed || !isCollectionAgreed) {
      Alert.alert('알림', '모든 약관에 동의해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/auth/signup', {
        email,
        password,
        name,
      });

      Alert.alert('회원가입 성공', '로그인 화면으로 이동합니다.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      Alert.alert('회원가입 실패', '입력하신 정보를 확인해주세요.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <View style={styles.agreementContainer}>
        <Checkbox
          status={isAgreed ? 'checked' : 'unchecked'}
          onPress={() => setIsAgreed(!isAgreed)}
        />
        <View style={styles.agreementTextContainer}>
          <Text style={styles.agreementText}>
            개인정보처리방침에 동의합니다.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyAgreement')}
          >
            <Text style={styles.agreementLink}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.agreementContainer}>
        <Checkbox
          status={isCollectionAgreed ? 'checked' : 'unchecked'}
          onPress={() => setIsCollectionAgreed(!isCollectionAgreed)}
        />
        <View style={styles.agreementTextContainer}>
          <Text style={styles.agreementText}>
            개인정보수집동의서에 동의합니다.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyCollection')}
          >
            <Text style={styles.agreementLink}>자세히 보기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, (!isAgreed || !isCollectionAgreed) && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={!isAgreed || !isCollectionAgreed}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>로그인하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  agreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  agreementText: {
    fontSize: 14,
    color: '#333',
  },
  agreementLink: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default SignupScreen; 