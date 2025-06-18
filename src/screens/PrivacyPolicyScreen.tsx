import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/stack';

type PrivacyPolicyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation<PrivacyPolicyScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>개인정보처리방침</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>1. 수집하는 개인정보 항목</Text>
        <Text style={styles.text}>
          • 필수항목: 이름, 이메일, 전화번호, 배송지 주소{'\n'}
          • 선택항목: 생년월일, 성별, 관심사항
        </Text>

        <Text style={styles.sectionTitle}>2. 개인정보의 수집 및 이용목적</Text>
        <Text style={styles.text}>
          • 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산{'\n'}
          • 회원 관리{'\n'}
          • 마케팅 및 광고에 활용
        </Text>

        <Text style={styles.sectionTitle}>3. 개인정보의 보유 및 이용기간</Text>
        <Text style={styles.text}>
          회원탈퇴 시까지 또는 법정 보유기간
        </Text>

        <Text style={styles.sectionTitle}>4. 개인정보의 파기절차 및 방법</Text>
        <Text style={styles.text}>
          • 파기절차: 목적 달성 후 별도 보관 후 파기{'\n'}
          • 파기방법: 전자적 파일 삭제 및 기록물 파쇄
        </Text>

        <Text style={styles.sectionTitle}>5. 개인정보 제공 및 공유</Text>
        <Text style={styles.text}>
          • 배송업체: 배송 서비스 제공{'\n'}
          • 결제대행사: 결제 처리
        </Text>

        <Text style={styles.sectionTitle}>6. 이용자 및 법정대리인의 권리와 행사방법</Text>
        <Text style={styles.text}>
          • 개인정보 열람요구{'\n'}
          • 오류 정정 요구{'\n'}
          • 삭제 요구{'\n'}
          • 처리정지 요구
        </Text>

        <Text style={styles.sectionTitle}>7. 개인정보 보호책임자</Text>
        <Text style={styles.text}>
          • 이름: 홍길동{'\n'}
          • 직위: 개인정보보호책임자{'\n'}
          • 연락처: 02-123-4567{'\n'}
          • 이메일: privacy@handy.com
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});

export default PrivacyPolicyScreen; 