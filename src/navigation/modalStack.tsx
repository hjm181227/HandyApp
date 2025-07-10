import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SettingScreen from '../screens/setting';
import CartScreen from '../screens/CartScreen';
import SellerPage from '../screens/seller_page';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import { colors } from '../../colors';
import SnapExploreScreen from "../../screens/SnapExploreScreen";
import SnapProfileScreen from "../../screens/SnapProfileScreen";

export type ModalStackParamList = {
  ProductDetail: {
    productId: string;
    title: string;
    price: number;
    image: string;
    description: string;
    rank?: number;
  };
  Setting: undefined;
  Cart: undefined;
  SellerPage: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  SearchResult: {
    keyword: string;
  };
  SnapExplore: {
    initialSnapId: number;
    userId?: number;
  };
  SnapProfile: {
    userId: number;
  };
};

const Stack = createStackNavigator<ModalStackParamList>();

const ModalStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: colors.text,
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: '상품 상세',
        }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: '설정',
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: '장바구니',
        }}
      />
      <Stack.Screen
        name="SellerPage"
        component={SellerPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchResult"
        component={SearchResultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SnapExplore" component={SnapExploreScreen} />
      <Stack.Screen
        name="SnapProfile"
        component={SnapProfileScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default ModalStack;
