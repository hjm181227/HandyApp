import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './tabs';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors } from '../../colors';
import SettingScreen from '../screens/setting';
import CartScreen from '../screens/CartScreen';
import SellerPage from '../screens/seller_page';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  MainTabs: {
    screen?: string;
    params?: {
      screen?: string;
    };
  };
  ProductDetail: {
    productId: string;
    title: string;
    price: number;
    image: string;
    description: string;
  };
  Setting: undefined;
  Cart: undefined;
  SellerPage: undefined;
  ProductUpload: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

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
        onPress={() => navigation.navigate('Cart')}
      >
        <Icon source="shopping-outline" size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton}>
        <Icon source="magnify" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

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
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: '상품 상세',
          headerRight: () => <ProductDetailHeaderRight />,
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
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
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

export default RootStack;
