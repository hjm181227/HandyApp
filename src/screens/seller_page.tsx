import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB, IconButton } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HandyColors from "../../colors";

const Drawer = createDrawerNavigator();

// Placeholder screens - we'll implement these later
const ProductListScreen = () => (
  <View style={styles.container}>
    <Text>상품 목록</Text>
    <FAB
      style={styles.fab}
      icon="plus"
      onPress={() => {}}
      label="상품 등록"
    />
  </View>
);

const OrderManagementScreen = () => <View style={styles.container}><Text>주문 관리</Text></View>;
const EventManagementScreen = () => <View style={styles.container}><Text>이벤트/할인 관리</Text></View>;
const DashboardScreen = () => <View style={styles.container}><Text>대시보드</Text></View>;
const ProductInquiryScreen = () => <View style={styles.container}><Text>상품 문의</Text></View>;
const ReviewManagementScreen = () => <View style={styles.container}><Text>리뷰 관리</Text></View>;

const SellerPage = () => {
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
        headerLeft: () => null, // Remove the default hamburger menu
        drawerPosition: 'right', // Move drawer to the right side
        drawerType: 'front', // Drawer will appear on top of the screen
        overlayColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
      }}
    >
      <Drawer.Screen
        name="ProductList"
        component={ProductListScreen}
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
      <Drawer.Screen
        name="EventManagement"
        component={EventManagementScreen}
        options={{
          title: '이벤트/할인 관리',
          drawerLabel: '이벤트/할인 관리',
          drawerIcon: ({ color, size }) => (
            <IconButton icon="tag-multiple" size={size} iconColor={color} />
          ),
        }}
      />
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
