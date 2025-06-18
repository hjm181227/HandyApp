import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/stack';

type TermsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Terms'>;

const TermsScreen = () => {
  const navigation = useNavigation<TermsScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>이용약관</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>제1조 (목적)</Text>
        <Text style={styles.text}>
          이 약관은 Handy(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </Text>

        <Text style={styles.sectionTitle}>제2조 (정의)</Text>
        <Text style={styles.text}>
          • "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.{'\n'}
          • "회원"이란 회사와 서비스 이용계약을 체결한 자를 말합니다.{'\n'}
          • "상품"이란 회사가 판매하는 모든 제품을 의미합니다.
        </Text>

        <Text style={styles.sectionTitle}>제3조 (서비스의 제공)</Text>
        <Text style={styles.text}>
          • 회사는 회원에게 아래와 같은 서비스를 제공합니다.{'\n'}
          - 상품 판매 서비스{'\n'}
          - 맞춤형 상품 추천 서비스{'\n'}
          - 기타 회사가 정하는 서비스
        </Text>

        <Text style={styles.sectionTitle}>제4조 (서비스 이용)</Text>
        <Text style={styles.text}>
          • 서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을 원칙으로 합니다.{'\n'}
          • 회사는 시스템 정기점검, 증설 및 교체를 위해 서비스를 일시 중단할 수 있으며, 예정된 작업으로 인한 서비스 일시 중단은 서비스 내 공지사항을 통해 사전에 공지합니다.
        </Text>

        <Text style={styles.sectionTitle}>제5조 (회원의 의무)</Text>
        <Text style={styles.text}>
          • 회원은 관계법령, 이 약관의 규정, 이용안내 및 주의사항 등 회사가 통지하는 사항을 준수하여야 합니다.{'\n'}
          • 회원은 회사의 명시적인 동의가 없는 한 서비스의 이용권한, 기타 이용계약상의 지위를 타인에게 양도, 증여할 수 없습니다.
        </Text>

        <Text style={styles.sectionTitle}>제6조 (회사의 의무)</Text>
        <Text style={styles.text}>
          • 회사는 안정적인 서비스 제공을 위해 최선을 다합니다.{'\n'}
          • 회사는 회원의 개인정보를 보호하기 위해 보안시스템을 갖추고 개인정보처리방침을 공시하고 준수합니다.
        </Text>

        <Text style={styles.sectionTitle}>제7조 (책임제한)</Text>
        <Text style={styles.text}>
          • 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 인한 서비스 중단에 대하여 책임을 지지 않습니다.{'\n'}
          • 회사는 서비스 이용과 관련하여 회원의 귀책사유로 인한 손해에 대하여 책임을 지지 않습니다.
        </Text>

        <Text style={styles.sectionTitle}>제8조 (분쟁해결)</Text>
        <Text style={styles.text}>
          • 회사와 회원 간 발생한 분쟁은 상호 협의하여 해결합니다.{'\n'}
          • 협의가 이루어지지 않을 경우, 관련 법령 및 상관례에 따릅니다.
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

export default TermsScreen; 