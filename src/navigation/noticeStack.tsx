import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoticeListScreen from '../screens/NoticeListScreen';
import NoticeDetailScreen from '../screens/NoticeDetailScreen';

export type NoticeStackParamList = {
  NoticeList: undefined;
  NoticeDetail: {
    notice: {
      noticeId: number;
      title: string;
      content: string;
      createdAt: string;
    };
  };
};

const Stack = createNativeStackNavigator<NoticeStackParamList>();

const NoticeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="NoticeList" component={NoticeListScreen} />
      <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
    </Stack.Navigator>
  );
};

export default NoticeStack; 