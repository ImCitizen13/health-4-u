import { Button, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Canvas,
  useImage,
  Skia,
  Image,
  SkImage,
} from "@shopify/react-native-skia";
import { Stack, useLocalSearchParams } from "expo-router";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export default function PreviewImage() {
  const { imagePath, width, height } = useLocalSearchParams<{
    imagePath: string;
    width: string;
    height: string;
  }>();
  const image = useImage(imagePath, (err: Error) => {
    console.log(err);
  });
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        //setDimensions({window, screen});
        console.log(
          "Window Dimensions: \n Width:",
          window.width,
          "\n Height:",
          window.height
        );
        console.log(
          "Window Screen: \n Width:",
          screen.width,
          "\n Height:",
          screen.height
        );
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  });
  // useEffect(() => {
  //   console.log("New SCREEN Dimenstions: ");
  //   console.log("Width: ", dimensions.screen.width);
  //   console.log("Height: ", dimensions.screen.height);
  //   console.log("======================");
  //   console.log("New WINDOW Dimenstions: ");
  //   console.log("Width: ", dimensions.window.width);
  //   console.log("Height: ", dimensions.window.height);
  //   console.log("======================");
  // }, [dimensions]);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setCanvasHeight(height);
        setCanvasWidth(width);
        // console.log("MainView")
        // console.log("Width: ", width);
        // console.log("Height: ", height);
        // console.log("======================")
      }}
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          animation: "fade",
          // headerBlurEffect: true
        }}
      />
      <Canvas
        style={[
          styles.skiaCanvas,
          {
            width: "100%",
            height: "100%",
            //   backgroundColor: `rgba(223, 232, 111, 1})`,
          },
        ]}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setCanvasHeight(height);
          setCanvasWidth(width);
          //   console.log("Canvas")
          //   console.log("Width: ", width);
          //   console.log("Height: ", height);
          //   console.log("======================")
        }}
      >
        {canvasHeight > 0 && canvasWidth > 0 && width && height && (
          <Image
            image={image}
            fit="contain"
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
          />
        )}
      </Canvas>
      <Button
        title="Press me"
        onPress={() => {
          setCanvasHeight(0);
          setCanvasWidth(0);
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  skiaCanvas: {
    ...StyleSheet.absoluteFillObject,
    // semi-transparent black
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
