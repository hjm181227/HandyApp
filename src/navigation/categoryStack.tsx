import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CategoryScreen from '../screens/category';
import CategoryProductListScreen from '../screens/CategoryProductListScreen';
import { colors } from '../../colors';

export type CategoryStackParamList = {
  CategoryMain: undefined;
  CategoryProductList: {
    category: string;
    subcategory: string;
  };
  ModalStack: {
    screen?: string;
    params?: any;
  };
};

const Stack = createStackNavigator<CategoryStackParamList>();

const CategoryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="CategoryMain"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryProductList"
        component={CategoryProductListScreen}
        options={({ route }) => ({
          title: route.params?.subcategory || '상품 목록',
        })}
      />
    </Stack.Navigator>
  );
};

export default CategoryStack; 