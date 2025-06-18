import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-paper';
import { colors } from '../../colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyPageStackParamList } from '../navigation/myPageStack';

type NailMeasurementScreenNavigationProp = NativeStackNavigationProp<MyPageStackParamList, 'NailMeasurement'>;

const NailMeasurementScreen = () => {
  const navigation = useNavigation<NailMeasurementScreenNavigationProp>();
  const [selectedHand, setSelectedHand] = useState<'left' | 'right' | null>(null);
  const [selectedFinger, setSelectedFinger] = useState<number | null>(null);
  const [measurements, setMeasurements] = useState<Record<string, { width: number }>>({});

  const fingers = [
    { id: '1', name: '엄지' },
    { id: '2', name: '검지' },
    { id: '3', name: '중지' },
    { id: '4', name: '약지' },
    { id: '5', name: '새끼' },
  ];

  const getFingerKey = (hand: 'left' | 'right', fingerId: string) => `${hand}_${fingerId}`;

  const handleMeasurement = () => {
    if (selectedHand && selectedFinger !== null) {
      navigation.navigate('NailCamera', {
        onMeasurementComplete: (result: number) => {
          const fingerKey = getFingerKey(selectedHand, selectedFinger.toString());
          setMeasurements(prev => ({
            ...prev,
            [fingerKey]: { width: result }
          }));
        }
      });
    }
  };

  const renderHandSection = (hand: 'left' | 'right') => (
    <View style={styles.handSection}>
      <Text style={styles.handTitle}>{hand === 'left' ? '왼손' : '오른손'}</Text>
      <View style={styles.fingerGrid}>
        {fingers.map((finger) => {
          const fingerKey = getFingerKey(hand, finger.id);
          const measurement = measurements[fingerKey];
          
          return (
            <View key={finger.id} style={styles.fingerCard}>
              <Text style={styles.fingerName}>{finger.name}</Text>
              {measurement ? (
                <Text style={styles.measurementText}>
                  {measurement.width}mm
                </Text>
              ) : (
                <TouchableOpacity
                  style={styles.measureButton}
                  onPress={() => {
                    setSelectedHand(hand);
                    setSelectedFinger(parseInt(finger.id));
                    handleMeasurement();
                  }}
                >
                  <Text style={styles.measureButtonText}>측정하기</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>손톱 크기 측정</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>손톱 크기 측정 방법</Text>
          <Text style={styles.instructionText}>
            1. 각 손가락을 순서대로 측정해주세요.{'\n'}
            2. 손톱의 가로 길이를 측정해주세요.{'\n'}
            3. 모든 손가락의 측정이 완료되면 저장해주세요.
          </Text>
        </View>

        {renderHandSection('left')}
        {renderHandSection('right')}

        <TouchableOpacity
          style={[
            styles.saveButton,
            Object.keys(measurements).length === fingers.length * 2 && styles.saveButtonActive
          ]}
          disabled={Object.keys(measurements).length !== fingers.length * 2}
          onPress={() => {
            // TODO: 측정 결과 저장 로직 구현
            navigation.goBack();
          }}
        >
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </ScrollView>
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
  instructionContainer: {
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  handSection: {
    marginBottom: 24,
  },
  handTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  fingerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fingerCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  fingerName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  measurementText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  measureButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  measureButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.textSecondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonActive: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NailMeasurementScreen; 