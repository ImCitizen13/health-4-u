import { Button, Pressable, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useSkiaFrameProcessor,
  useFrameProcessor,
  Frame,
  DrawableFrame,
  useCameraFormat,
  Templates,
  PhotoFile,
} from "react-native-vision-camera";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useRef, useState } from "react";
import { useTensorflowModel } from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";
import "react-native-reanimated";
import Animated, { runOnJS } from "react-native-reanimated";
import {
  Canvas,
  useImage,
  Skia,
  Image,
  SkImage,
} from "@shopify/react-native-skia";
import { Stack, router } from "expo-router";
import { resizeFrame } from "@/utils/TextRecognition";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import CameraBottom from "@/components/CameraBottom";
import PreviewView from "@/components/PreviewView";
import PreviewImage from "@/components/PreviewImage";

export default function TabTwoScreen() {
  const { hasPermission: hasCameraPermission, requestPermission } =
    useCameraPermission();
  const device = useCameraDevice("back");
  const format = useCameraFormat(device, Templates.Snapchat);
  // console.log("DEVICE Formats: ", device?.formats)
  const { resize } = useResizePlugin();
  // console.log("Has Permission:", hasCameraPermission);
  // console.log("UseCameraDevice :", device != null);

  const camera = useRef<Camera>(null);
  // On press
  const onPressCamera = async () => {
    if (hasCameraPermission) {
      // console.log("Has Permission");
    }
    if (device) {
      // console.log("Has back camera: ", device != null);
    }
    if (!hasCameraPermission) {
      console.log("Requesting permission");
      await requestPermission();
      console.log("Does not have Permission");
    }
  };

  // Option B: Hook in a Function Component
  // const textDetection = useTensorflowModel(
  //   require("../assets/text_detection.tflite")
  // );
  // console.log(textDetection);
  // When model loads
  // const model =
  //   textDetection.state === "loaded" ? textDetection.model : undefined;
  const [imagePath, setImagePath] = useState<string>("");
  const [width, setWidth] = useState<number>(256);
  const [height, setHeight] = useState<number>(256);

  const [skImage, setSkImage] = useState<SkImage | null>(null);
  useEffect(() => {
    if (imagePath === "") return;
  }, [imagePath]);

  const onImageCapture = (imageFile: PhotoFile) => {
    if (!imageFile) return;

    router.setParams({
      imagePath: "file:/" + imageFile.path,
      width: "" + imageFile.width,
      height: "" + imageFile.height,
    });
    router.push({
      pathname: "../preview",
      params: {
        imagePath: "file://" + imageFile.path,
        width: "" + imageFile.width,
        height: "" + imageFile.height,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
          options={{
            headerTransparent: true,
            // headerBlurEffect: true
            
          }}
        />
      {!hasCameraPermission && (
        <Button title="Camera" onPress={onPressCamera}></Button>
      )}
      {device && hasCameraPermission && (
        <View style={styles.cameraContainer}>
          {/* <Text style={{color: "white", fontSize: 30}}>Camera</Text> */}
          <Camera
            // frameProcessor={frameProcessor}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
            format={format}
            pixelFormat="yuv"
            ref={camera}
          />
          
            <CameraBottom
              camera={camera}
              onImageCapture={onImageCapture}
            />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
  cameraContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // backgroundColor: "red",
  },
  skiaCanvas: {
    ...StyleSheet.absoluteFillObject,
    // semi-transparent black
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    // backgroundColor: "blue",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
