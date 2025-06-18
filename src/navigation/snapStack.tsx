import React from 'react';
import SnapPage from '../screens/snap_page';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SnapExploreScreen from "../../screens/SnapExploreScreen";

export type SnapStackParamList = {
  SnapMain: undefined;
  SnapExplore: {
    initialSnapId: number;
  };
};

const Stack = createNativeStackNavigator<SnapStackParamList>();

const SnapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"SnapMain"}
    >
      <Stack.Screen name="SnapMain" component={SnapPage} />
      <Stack.Screen
        name="SnapExplore"
        component={SnapExploreScreen}
      />
    </Stack.Navigator>
  );
};

export default SnapStack;
