import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageScreen from '../screens/my_page';
import NailMeasurementScreen from '../screens/NailMeasurementScreen';
import NailCameraScreen from '../screens/NailCameraScreen';
import InquiryScreen from '../screens/InquiryScreen';
import MyInquiryScreen from '../screens/MyInquiryScreen';
import NoticeStack from './noticeStack';

export type MyPageStackParamList = {
  MyPageMain: undefined;
  NailMeasurement: undefined;
  NailCamera: undefined;
  Inquiry: undefined;
  MyInquiry: undefined;
  NoticeStack: undefined;
  ModalStack: {
    screen?: string;
    params?: any;
  };
};

const Stack = createNativeStackNavigator<MyPageStackParamList>();

const MyPageStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyPageMain" component={MyPageScreen} />
      <Stack.Screen name="NailMeasurement" component={NailMeasurementScreen} />
      <Stack.Screen name="NailCamera" component={NailCameraScreen} />
      <Stack.Screen name="Inquiry" component={InquiryScreen} />
      <Stack.Screen name="MyInquiry" component={MyInquiryScreen} />
      <Stack.Screen name="NoticeStack" component={NoticeStack} />
    </Stack.Navigator>
  );
};

export default MyPageStack;
