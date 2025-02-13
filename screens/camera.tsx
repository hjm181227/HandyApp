import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, PanResponder, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Svg, { Line, Circle } from 'react-native-svg';
import { PixelRatio } from 'react-native';

const CARD_WIDTH_MM = 85.6;
const ppi = PixelRatio.get() * 160;
const pixelPerMm = ppi / 25.4;
console.log("Pixel per mm:", ppi, pixelPerMm);
//53.5mm = 300px;

const MeasureDistanceScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [points, setPoints] = useState<{ x: number }[]>([{ x: 50 }, { x: 250 }]);
  const [scale, setScale] = useState<number | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // const captureImage = async () => {
  //   try {
  //     const capturedImage = await ImagePicker.openCamera({ mediaType: 'photo' });
  //     const result = await ImagePicker.openCropper({
  //       mediaType: 'photo',
  //       path: capturedImage.path,
  //       width: 428,
  //       height: 269.9,
  //     });
  //     const imageUri = result.path.startsWith('file://') ? result.path : `file://${result.path}`;
  //     setImage(imageUri);
  //     setScale(null);
  //   } catch (error) {
  //     console.error('Image selection error:', error);
  //   }
  // };

  const pickImage = async () => {
    console.log(ppi, pixelPerMm);
    try {
      const selectedImage = await ImagePicker.openPicker({ mediaType: 'photo' });
      const result = await ImagePicker.openCropper({
        mediaType: 'photo',
        path: selectedImage.path,
        width: 428,
        height: 269.9,
      });
      console.log('selectedImage: ', selectedImage);
      console.log('cropped image: ', result);
      const imageUri = result.path.startsWith('file://') ? result.path : `file://${result.path}`;
      setImage(imageUri);
      setScale(null);
    } catch (error) {
      console.error('Image selection error:', error);
    }
  };

  const onImageLoad = (event: any) => {
    const { width, height } = event.nativeEvent.source;
    setImageWidth(width);
    setImageHeight(height);
    setScale(428/300);
  };

  const calculateDistance = () => {

    if (!scale) return null;
    const pixelDistance = Math.abs(points[1].x - points[0].x);
    const distanceInMm = (pixelDistance * 0.178 * scale).toFixed(2);
    const result = Math.ceil(parseFloat(distanceInMm));
    console.log(distanceInMm)

    return result;
  };

  const panResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setPoints((prev) => {
          const updated = [...prev];
          updated[index] = { x: Math.max(0, Math.min(imageWidth || 0, updated[index].x + gestureState.dx)) };
          return updated;
        });
      },
      onPanResponderRelease: () => setSelectedIndex(null),
    });

  return (
    <View style={styles.container}>
      {image ? (
        <View>
          <Image source={{ uri: image }} style={styles.image} onLoad={onImageLoad} />
          {imageWidth && imageHeight && (
            <Svg style={[styles.svg, { width: imageWidth, height: imageHeight }]}>
              {points.map((point, index) => (
                <React.Fragment key={index}>
                  <Line
                    key={index}
                    x1={point.x}
                    y1={-50}
                    x2={point.x}
                    y2={imageHeight}
                    stroke="black"
                    strokeWidth={2}
                  />
                  <Circle
                    cx={point.x}
                    cy={10}
                    r={10}
                    fill="black"
                    {...panResponder(index).panHandlers}
                  />
                  <Circle
                    cx={point.x}
                    cy={imageHeight - 10}
                    r={10}
                    fill="black"
                    {...panResponder(index).panHandlers}
                  />
                </React.Fragment>
              ))}
            </Svg>
          )}
        </View>
      ) : (
        <Text style={styles.infoText}>이미지를 선택해주세요</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert(`거리: ${calculateDistance()} mm`)}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        )}
      </View>
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
  buttonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 36
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default MeasureDistanceScreen;
