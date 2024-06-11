import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useImage, SkImage } from "@shopify/react-native-skia";
import { Camera, PhotoFile } from "react-native-vision-camera";
import { router } from "expo-router";

export default function CameraBottom({
  camera,
  onImageCapture,
}: {
  camera: React.RefObject<Camera | null>;
  onImageCapture: (imageFile: PhotoFile) => void;
}) {
  const [snapshotPath, setSnapshotPath] = useState<PhotoFile | null>(null);
  async function onTakePicture() {
    if (!camera || camera.current == null) {
      return;
    }
    try {
      const snapshot: PhotoFile = await camera.current.takeSnapshot({
        quality: 90,
      });
      // On Image Capture
      onImageCapture(snapshot) 
      setSnapshotPath(snapshot);
    } catch (err) {
      console.error(err);
    }
  }
  const BOTTOM_BAR_SIZE = 75
  return (
    <View style={styles.container}>
      <View style={styles.bottomBar}>
        <Pressable onPress={onTakePicture}>
          <View
            style={{
              backgroundColor: "white",
              width: BOTTOM_BAR_SIZE,
              height: BOTTOM_BAR_SIZE,
              borderRadius: BOTTOM_BAR_SIZE / 2,
            }}
          >
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  bottomBar: {
    width: "100%",
    height: 150,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
});
