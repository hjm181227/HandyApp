import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './tabs';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors } from '../../colors';
import SettingScreen from '../screens/setting';
import CategoryProductListScreen from '../screens/CategoryProductListScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyAgreementScreen from '../screens/PrivacyAgreementScreen';
import PrivacyCollectionScreen from '../screens/PrivacyCollectionScreen';
import SnapStack from './snapStack';

export type RootStackParamList = {
  MainTabs: {
    screen?: string;
    params?: {
      screen?: string;
    };
  };
  ModalStack: {
    screen?: string;
    params?: any;
  };
  Login: undefined;
  SignUp: undefined;
  Setting: undefined;
  ProductUpload: undefined;
  CategoryProductList: {
    category: string;
    subcategory: string;
  };
  PrivacyPolicy: undefined;
  Terms: undefined;
  PrivacyAgreement: undefined;
  PrivacyCollection: undefined;
  SnapStack: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: colors.text,
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyAgreement"
        component={PrivacyAgreementScreen}
        options={{
          title: '개인정보처리동의서',
        }}
      />
      <Stack.Screen
        name="PrivacyCollection"
        component={PrivacyCollectionScreen}
        options={{
          title: '개인정보수집동의서',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailHeaderRight = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerButton}>
        <Icon source="home-variant-outline" size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.navigate('ModalStack', {
          screen: 'Cart'
        })}
      >
        <Icon source="shopping-outline" size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton}>
        <Icon source="magnify" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerButton: {
    marginHorizontal: 8,
  },
});
