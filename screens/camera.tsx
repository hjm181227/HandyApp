import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Svg, { Line } from 'react-native-svg';
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

const CARD_WIDTH_MM = 85.6; // 신용카드 너비 (mm)
const CARD_HEIGHT_MM = 53.98; // 신용카드 높이 (mm)

const MeasureDistanceScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [points, setPoints] = useState<{ x: number }[]>([]);
  const [scale, setScale] = useState<number | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  const requestPermissions = async () => {
    const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
    const storagePermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

    console.log(cameraPermission, storagePermission);
    if (cameraPermission === RESULTS.GRANTED && storagePermission === RESULTS.GRANTED) {
      console.log('Permissions granted');
    } else {
      console.log('Permissions denied');
    }
  };

  requestPermissions();

  // 이미지 선택 및 크롭
  const pickImage = async () => {
    try {
      const selectedImage = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: false,
        cropperToolbarTitle: '신용카드 크기로 조정하세요',
      });

      const result = await ImagePicker.openCropper({
        mediaType: 'photo',
        path: selectedImage.path,
        width: 428,
        height: 269.9,
      });

      const imageUri = result.sourceURL || (result.path.startsWith('file://') ? result.path : `file://${result.path}`);
      // const imageUri = result.sourceURL || result.path; // iOS와 Android 호환 처리
      if (!imageUri) throw new Error('Image path not found');

      setImage(imageUri);
      setPoints([]);
      setScale(null);
    } catch (error) {
      console.error('Image selection error:', error);
    }
  };

  // 터치하여 두 개의 점 선택 (수직선의 x좌표 기록)
  const handleTouch = (event: any) => {
    if (image && points.length < 2) {
      const { locationX } = event.nativeEvent;
      setPoints([...points, { x: locationX }]);
    }
  };

  // 두 수직선 간 거리 계산 (픽셀 -> mm 변환)
  const calculateDistance = () => {
    if (points.length < 2 || !scale) return null;
    const [p1, p2] = points;
    const pixelDistance = Math.abs(p2.x - p1.x); // 세로선 거리 계산
    const distanceInMm = (pixelDistance / scale).toFixed(2); // mm 단위로 변환 후 소수점 처리

    const decimalPart = parseFloat(distanceInMm.split('.')[1] || '0');

    // 소수점 첫째 자리가 3 이하일 경우 버리고, 4 이상일 경우 올림 처리
    const roundedDistance =
      decimalPart <= 3
        ? Math.floor(parseFloat(distanceInMm))
        : Math.ceil(parseFloat(distanceInMm));

    return roundedDistance;
  };

  // 신용카드 크기를 기준으로 픽셀-실제 크기 비율 계산
  const onImageLoad = (event: any) => {
    const { width, height } = event.nativeEvent.source;
    setImageWidth(width);
    setImageHeight(height);
    setScale(width / CARD_WIDTH_MM);
  };

  return (
    <View style={styles.container}>
      {image ? (
        <TouchableOpacity onPress={handleTouch} activeOpacity={1}>
          <View>
            <Image source={{ uri: image }} style={styles.image} onLoad={onImageLoad} />

            {/* 선택한 두 개의 수직선 표시 */}
            {imageWidth && imageHeight && (
              <Svg style={[styles.svg, { width: imageWidth, height: imageHeight }]}>
                {points.map((point, index) => (
                  <Line
                    key={index}
                    x1={point.x}
                    y1={0}
                    x2={point.x}
                    y2={imageHeight}
                    stroke="red"
                    strokeWidth={2}
                  />
                ))}
              </Svg>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoText}>이미지를 선택해주세요</Text>
      )}

      {points.length === 2 && (
        <Text style={styles.resultText}>
          평행선 간 거리: {calculateDistance()} mm
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => requestPermissions().then(() => pickImage())}>
        <Text style={styles.buttonText}>이미지 선택</Text>
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
    marginTop: 20,
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
