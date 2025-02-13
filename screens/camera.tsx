import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, PanResponder } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Svg, { Line } from 'react-native-svg';
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

const CARD_WIDTH_MM = 85.6; // 신용카드 너비 (mm)
const CARD_HEIGHT_MM = 53.98; // 신용카드 높이 (mm)

const MeasureDistanceScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [points, setPoints] = useState<{ x: number }[]>([{ x: 50 }, { x: 250 }]);
  const [scale, setScale] = useState<number | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const requestPermissions = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const storagePermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    const writePermission = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    return cameraPermission === RESULTS.GRANTED && storagePermission === RESULTS.GRANTED && writePermission === RESULTS.GRANTED;
  };

  requestPermissions();

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      // if (!hasPermission) {
      //   console.log("권한이 필요합니다.");
      //   return;
      // }

      const selectedImage = await ImagePicker.openPicker({ mediaType: 'photo', cropping: false });
      const result = await ImagePicker.openCropper({
        mediaType: 'photo',
        path: selectedImage.path,
        width: 428,
        height: 269.9,
      });

      const imageUri = result.sourceURL || (result.path.startsWith('file://') ? result.path : `file://${result.path}`);
      if (!imageUri) throw new Error('이미지를 찾을 수 없습니다.');

      setImage(imageUri);
      setPoints([{ x: 50 }, { x: 250 }]);
      setScale(null);
      setDistance(null);
    } catch (error) {
      console.error('이미지 선택 오류:', error);
    }
  };

  const calculateDistance = () => {
    if (points.length < 2 || !scale) return;
    const pixelDistance = Math.abs(points[1].x - points[0].x);
    setDistance(Math.round(pixelDistance / scale));
  };

  const onImageLoad = (event: any) => {
    const { width } = event.nativeEvent.source;
    setImageWidth(width);
    setScale(width / CARD_WIDTH_MM);
  };

  const createPanResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setPoints((prevPoints) => {
          const newPoints = [...prevPoints];
          newPoints[index] = { x: Math.max(0, Math.min(imageWidth || 300, newPoints[index].x + gestureState.dx)) };
          return newPoints;
        });
      },
    });

  return (
    <View style={styles.container}>
      {image ? (
        <View>
          <Image source={{ uri: image }} style={styles.image} onLoad={onImageLoad} />
          <Svg style={[styles.svg, { width: imageWidth, height: 200 }]}>
            {points.map((point, index) => (
              <Line key={index} x1={point.x} y1={0} x2={point.x} y2={200} stroke="red" strokeWidth={2} {...createPanResponder(index).panHandlers} />
            ))}
          </Svg>
        </View>
      ) : (
        <Text style={styles.infoText}>이미지를 선택해주세요</Text>
      )}

      {distance !== null && (
        <Text style={styles.resultText}>거리: {distance} mm</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>이미지 선택</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={calculateDistance}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  resultText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MeasureDistanceScreen;
