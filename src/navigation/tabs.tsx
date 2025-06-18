import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MyPageStack from './myPageStack';
import MeasureDistanceScreen from "../screens/camera";
import { BottomNavigation, Icon } from "react-native-paper";
import { CommonActions } from '@react-navigation/native';
import SnapPage from "../screens/snap_page";
import CategoryStack from "./categoryStack";
import CartScreen from "../screens/CartScreen";
import ProductUploadScreen from "../screens/ProductUploadScreen";
import { colors } from '../../colors';
import SnapStack from './snapStack';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
      }}
      initialRouteName="Home"
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          shifting={false}
          style={{ backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
          activeIndicatorStyle={{ backgroundColor: 'none' }}
          navigationState={state}
          safeAreaInsets={insets}
          activeColor={'rgba(93, 0, 30, 1)'}
          inactiveColor={'rgba(224, 172, 157, 1)'}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            const iconMap = {
              'Home': 'home-variant',
              'Category': 'text-box-search',
              'Snap': 'heart',
              'MyPage': 'account',
            }
            const iconName = focused
              ? iconMap[route.name] // 활성화된 탭 아이콘 이름
              : `${iconMap[route.name]}-outline`; // 비활성화된 탭 아이콘 이름

            if (options.tabBarIcon) {
              return <Icon source={iconName} size={28} color={color}/>;
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen name="Category"
                  component={CategoryStack}
                  options={{
                    tabBarLabel: '카테고리',
                    tabBarIcon: ({ color, size }) => {
                      return <Icon source="text-box-search" size={size} color={color}/>;
                    },
                  }}
      >
      </Tab.Screen>
      <Tab.Screen name="Home"
                  component={HomeScreen}
                  options={{
                    tabBarLabel: '핸디 홈',
                    tabBarIcon: ({ color, size }) => {
                      return <Icon source="home-variant-outline" size={size} color={color}/>;
                    },
                  }}
      ></Tab.Screen>
      <Tab.Screen name="Snap"
                  component={SnapPage}
                  options={{
                    tabBarLabel: '스냅',
                    tabBarIcon: ({ color, size }) => {
                      return <Icon source="heart" size={size} color={color}/>;
                    },
                  }}
      ></Tab.Screen>
      <Tab.Screen name="MyPage"
                  component={MyPageStack}
                  options={{
                    tabBarLabel: 'My',
                    tabBarIcon: ({ color, size }) => {
                      return <Icon source="account" size={size} color={color}/>;
                    },
                  }}
      ></Tab.Screen>
    </Tab.Navigator>
  )
}

export default BottomTabs;
