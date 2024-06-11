import { Button, StyleSheet } from "react-native";
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
} from "react-native-vision-camera";
import {
  Canvas,
  useImage,
  Skia,
  Image,
  SkImage,
} from "@shopify/react-native-skia";
import { Text, View } from "@/components/Themed";
import React, { useEffect } from "react";
import { useTensorflowModel } from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";

export default function TabTwoScreen() {
  const { hasPermission: hasCameraPermission, requestPermission } =
    useCameraPermission();
  const device = useCameraDevice("back");
  const format = useCameraFormat(device, Templates.Snapchat);
  // console.log("DEVICE Formats: ", device?.formats)
  const { resize } = useResizePlugin();
  console.log("Has Permission:", hasCameraPermission);
  // console.log("UseCameraDevice :", device != null);

  // On press
  const onPressCamera = async () => {
    if (hasCameraPermission) {
      console.log("Has Permission");
    }
    if (device) {
      console.log("Has back camera: ", device != null);
    }
    if (!hasCameraPermission) {
      console.log("Requesting permission");
      await requestPermission();
      console.log("Does not have Permission");
    }
  };


  const postProcessRecognitionData = (
    score: Map<string, number>,
    geo: Map<string, number>,
    ratioW: number,
    ratioH: number
  ) => {
    // grab the number of rows and columns from the scores volume, then
    // initialize our set of bounding box rectangles and corresponding
    // confidence scores
    const numRows = score.keys.length;
    const numCols = 5;
    let rects: any[] = [];
    let confidences: number[] = [];

    // # loop over the number of rows
    Array(numRows)
      .fill(0)
      .forEach((_, y) => {
        // # extract the scores (probabilities), followed by the geometrical
        // # data used to derive potential bounding box coordinates that
        // # surround text
        const scoresData = score.get(y + "") ?? 0;
        const xData0 = geo.get(y + "") ?? 0;
        const xData1 = geo.get(Number(y) + 1 + "") ?? 0;
        const xData2 = geo.get(Number(y) + 2 + "") ?? 0;
        const xData3 = geo.get(Number(y) + 3 + "") ?? 0;
        const anglesData = geo.get(Number(y) + 4 + "") ?? 0;

        // # loop over the number of columns
        Array(numCols)
          .fill(0)
          .forEach((_, x) => {
            // # if our score does not have sufficient probability, ignore it
            if (scoresData ?? 0 < 0.7) {
              return;
            }

            // # compute the offset factor as our resulting feature maps will
            // # be 4x smaller than the input image
            const offsetX = x * 4.0;
            const offsetY = y * 4.0;

            // # extract the rotation angle for the prediction and then
            // # compute the sin and cosine
            const angle: number = anglesData ?? 0;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // # use the geometry volume to derive the width and height of
            // # the bounding box
            const h = xData0 + xData2;
            const w = xData1 + xData3;

            // # compute both the starting and ending (x, y)-coordinates for
            // # the text prediction bounding box
            const endX = offsetX + cos * xData1 + sin * xData2;
            const endY = offsetY - sin * xData1 + cos * xData2;
            const startX = endX - w;
            const startY = endY - h;

            // # add the bounding box coordinates and probability score to
            // # our respective lists
            // rects.push((startX, startY, endX, endY))
            confidences.push(scoresData);
          });
      });

    // # apply non-maxima suppression to suppress weak, overlapping bounding
    // # boxes
    // boxes = non_max_suppression(np.array(rects), probs=confidences)

    // # loop over the bounding boxes
    // for (startX, startY, endX, endY) in boxes:
    //     // # scale the bounding box coordinates based on the respective
    //     // # ratios
    //     startX = int(startX * ratioW)
    //     startY = int(startY * ratioH)
    //     endX = int(endX * ratioW)
    //     endY = int(endY * ratioH)

    //     // # draw the bounding box on the image
    //     cv2.rectangle(original, (startX, startY), (endX, endY), (0, 255, 0), 2)

    // // # show the output image
    // plt.imshow(original)
  };

  const data = Skia.Data.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
  const image = Skia.Image.MakeImageFromEncoded(data);
  const image2 = useImage("https://picsum.photos/200/300");
  const image3 = useImage("file://data/user/0/com.meltohamy.health4u/cache/mrousavy-765669036428689427.jpg")
  useEffect(() => {
    console.log("Image3: ", image3)
  } , [image3])
  return (
    <View style={styles.container}>
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
          style={"fill"}
          image={image3}
          width={500}
          height={1000
          }
          // width={image ? image.width() : 256}
          // height={image ? image.height() : 256}
          fit={"cover"}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    // backgroundColor: 'red',
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
