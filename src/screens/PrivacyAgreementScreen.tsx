import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors } from '../../colors';
import { useNavigation } from '@react-navigation/native';

const PrivacyAgreementScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>개인정보처리동의서</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>개인정보처리동의서</Text>
          <Text style={styles.introText}>
            에르모세아르(이하 '회사'라고 합니다)는 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며 귀하의 개인정보보호에 최선을 다하고 있습니다. 회사는 개인정보보호법에 근거하여 다음과 같은 내용으로 개인정보를 수집 및 처리하고자 합니다.
          </Text>

          <Text style={styles.noticeText}>
            다음의 내용을 자세히 읽어보시고 모든 내용을 이해하신 후에 동의 여부를 결정해주시기 바랍니다.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>제1조(회원 가입을 위한 정보)</Text>
            <Text style={styles.sectionContent}>
              회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은 정보를 수집합니다.
            </Text>
            <Text style={styles.requiredInfo}>
              [필수 수집 정보] : 이메일 주소, 비밀번호, 이름, 닉네임, 생년월일 및 휴대폰 번호
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>제2조(본인 인증을 위한 정보)</Text>
            <Text style={styles.sectionContent}>
              회사는 이용자의 본인인증을 위하여 다음과 같은 정보를 수집합니다.
            </Text>
            <Text style={styles.requiredInfo}>
              [필수 수집 정보] : 휴대폰 번호, 이메일 주소, 이름, 생년월일, 성별, 이동통신사 및 내/외국인 여부
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>제3조(회사 서비스 제공을 위한 정보)</Text>
            <Text style={styles.sectionContent}>
              회사는 이용자에게 회사의 서비스를 제공하기 위하여 다음과 같은 정보를 수집합니다.
            </Text>
            <Text style={styles.requiredInfo}>
              [필수 수집 정보] : 아이디, 이메일 주소, 이름, 생년월일 및 연락처
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>제4조(서비스 이용 및 부정 이용 확인을 위한 정보)</Text>
            <Text style={styles.sectionContent}>
              회사는 이용자의 서비스 이용에 따른 통계•분석 및 부정이용의 확인 • 분석을 위하여 다음과 같은 정보를 수집합니다.
            </Text>
            <Text style={styles.explanationText}>
              (부정이용이란 회원탈퇴 후 재가입, 상품구매 후 구매취소 등을 반복적으로 행하는 등 회사가 제공하는 할인쿠폰, 이벤트 혜택 등의 경제상 이익을 불·편법적으로 수취하는 행위, 이용약관 등에서 금지하고 있는 행위, 명의도용 등의 불•편법행위 등을 말합니다.)
            </Text>
            <Text style={styles.requiredInfo}>
              [필수 수집 정보] : 서비스 이용기록, 쿠키, 접속지 정보 및 기기정보
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>제5조(개인정보 보유 및 이용 기간)</Text>
            <Text style={styles.sectionContent}>
              1. 수집한 개인정보는 수집•이용 동의일로부터 3년간 보관 및 이용합니다.{'\n'}
              2. 개인정보 보유기간의 경과, 처리목적의 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>제6조(동의 거부 관리)</Text>
            <Text style={styles.sectionContent}>
              귀하는 본 안내에 따른 개인정보 수집•이용에 대하여 동의를 거부할 권리가 있습니다. 다만, 귀하가 개인정보 동의를 거부하시는 경우에 서비스 이용 중 일부 제한의 불이익이 발생할 수 있음을 알려드립니다.
            </Text>
          </View>

          <View style={styles.agreementSection}>
            <Text style={styles.agreementText}>
              본인은 위의 동의서 내용을 충분히 숙지하였으며, 위와 같이 개인정보를 수집•이용하는데 동의합니다.
            </Text>
            <Text style={styles.dateText}>
              2025.06.17.
            </Text>
          </View>
        </View>
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
    height: 56,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 30,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 8,
  },
  requiredInfo: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 5,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: 8,
  },
  agreementSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  agreementText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
});

export default PrivacyAgreementScreen;
