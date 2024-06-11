import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Canvas,
  useImage,
  Skia,
  Image,
  SkImage,
  Circle,
} from "@shopify/react-native-skia";

export default async function PreviewView({
  imagePath,
}: {
  imagePath: string;
}) {
  console.log("IMAGE PATH: ", imagePath);
  const image = useImage(imagePath);
  //    const image = useImage("/data/user/0/com.meltohamy.health4u/cache/mrousavy-1726573248119668366.jpg"); // Doesn't matter, you could load the image anywhere
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
      {/* <Circle cx={232} cy={232} r={232} color="lightblue" /> */}
      <Image
        image={image}
        fit="fill"
        x={0}
        y={0}
        width={image ? image.width() : 200}
        height={image ? image.height() : 200}
      />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  skiaCanvas: {
    ...StyleSheet.absoluteFillObject,
    // semi-transparent black
    justifyContent: "center",
    alignItems: "center",
  },
});
