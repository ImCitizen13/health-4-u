import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Canvas,
  useImage,
  Skia,
  Image,
  SkImage,
} from "@shopify/react-native-skia";
import { useLocalSearchParams } from "expo-router";
export default function PreviewImage() {
  const {imagePath, width, height} = useLocalSearchParams<{
    imagePath: string;
    width: string;
    height: string;
  }>();
  const image = useImage(imagePath);
  console.log(image);
  return (
    <Canvas
      style={[
        styles.skiaCanvas,
        {
          width: "100%",
          height: "100%",
          //   backgroundColor: `rgba(223, 232, 111, 1})`,
        },
      ]}
    >
      <Image
        style="fill"
        image={image}
        fit="contain"
        x={0}
        y={0}
        width={Number(width ?? "0")}
        height={Number(height ?? "0")}
      />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  skiaCanvas: {
    // ...StyleSheet.absoluteFillObject,
    // semi-transparent black
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
