import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/stack';
import HandyColors from "../../colors";

// Import screens
import SellerProductListScreen from './seller/SellerProductListScreen';
import OrderManagementScreen from './seller/OrderManagementScreen';
import DashboardScreen from './seller/DashboardScreen';
import ProductInquiryScreen from './seller/ProductInquiryScreen';
import ReviewManagementScreen from './seller/ReviewManagementScreen';
import ProductUploadScreen from './ProductUploadScreen';

const Drawer = createDrawerNavigator();

type SellerPageNavigationProp = StackNavigationProp<RootStackParamList, 'SellerPage'>;

const SellerPage = () => {
  const navigation = useNavigation<SellerPageNavigationProp>();

  return (
    <Drawer.Navigator
      initialRouteName="ProductList"
      screenOptions={{
        headerStyle: {
          backgroundColor: HandyColors.primary90,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
        ),
        drawerPosition: 'right', // Move drawer to the right side
        drawerType: 'front', // Drawer will appear on top of the screen
        overlayColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
      }}
    >
      <Drawer.Screen
        name="ProductList"
        component={SellerProductListScreen}
        options={{
          title: '상품 목록',
          drawerLabel: '상품 목록',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="package-variant" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="OrderManagement"
        component={OrderManagementScreen}
        options={{
          title: '주문 관리',
          drawerLabel: '주문 관리',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="clipboard-list" size={size} iconColor={color} />
          ),
        }}
      />
      {/*<Drawer.Screen*/}
      {/*  name="EventManagement"*/}
      {/*  component={EventManagementScreen}*/}
      {/*  options={{*/}
      {/*    title: '이벤트/할인 관리',*/}
      {/*    drawerLabel: '이벤트/할인 관리',*/}
      {/*    drawerIcon: ({ color, size }) => (*/}
      {/*      <IconButton icon="tag-multiple" size={size} iconColor={color} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: '대시보드',
          drawerLabel: '대시보드',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="view-dashboard" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProductInquiry"
        component={ProductInquiryScreen}
        options={{
          title: '상품 문의',
          drawerLabel: '상품 문의',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="message-question" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ReviewManagement"
        component={ReviewManagementScreen}
        options={{
          title: '리뷰 관리',
          drawerLabel: '리뷰 관리',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="star" size={size} iconColor={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProductUpload"
        component={ProductUploadScreen}
        options={{
          title: '상품 등록',
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default SellerPage;
