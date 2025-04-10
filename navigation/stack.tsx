import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './tabs';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors } from '../colors';
import SettingScreen from '../screens/setting';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: {
    productId: string;
    title: string;
    price: number;
    image: string;
    description: string;
  };
  Setting: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const ProductDetailHeaderRight = () => {
  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerButton}>
        <Icon source="home-variant-outline" size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton}>
        <Icon source="cart-variant" size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton}>
        <Icon source="magnify" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: '상품 상세',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: colors.text,
          headerRight: () => <ProductDetailHeaderRight />,
        }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: '설정',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: colors.text,
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
