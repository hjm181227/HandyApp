import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { colors } from '../../colors';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyPageStackParamList } from '../navigation/myPageStack';
import MeasureDistanceScreen from './camera';

type NailCameraScreenNavigationProp = NativeStackNavigationProp<MyPageStackParamList, 'NailCamera'>;
type NailCameraScreenRouteProp = RouteProp<MyPageStackParamList, 'NailCamera'>;

const NailCameraScreen = () => {
  const navigation = useNavigation<NailCameraScreenNavigationProp>();
  const route = useRoute<NailCameraScreenRouteProp>();
  const [measurement, setMeasurement] = useState<number | null>(null);

  const handleMeasurementComplete = (result: number) => {
    setMeasurement(result);
    route.params.onMeasurementComplete(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>손톱 측정</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          손톱을 카메라 프레임 안에 맞춰주세요.
        </Text>
        <MeasureDistanceScreen onMeasurementComplete={handleMeasurementComplete} />
        {measurement !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>측정 결과: {measurement}mm</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NailCameraScreen; 