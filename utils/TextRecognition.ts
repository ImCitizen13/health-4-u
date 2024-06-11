import { Frame } from "react-native-vision-camera";
import { DataType, Options, OutputArray } from "vision-camera-resize-plugin";

type ResizeFrameReturn = {
  resizedFrame: Float32Array;
  rW: number;
  rH: number;
};

function resizeFrame(
  frame: Frame,
  width: number,
  height: number,
  resize: <T extends DataType>(
    frame: Frame,
    options: Options<T>
  ) => OutputArray<T>
): ResizeFrameReturn {
  'worklet'
  const resizedFrame: Float32Array = resize(frame, {
    scale: { width: 320, height: 320 },
    pixelFormat: "rgb",
    dataType: "float32",
  });
  const rW = frame.width / 320;
  const rH = frame.height / 320;

  return { resizedFrame: resizedFrame, rW: rW, rH: rH };
}

const interpretModelOutputs = (outputs: any[]) => {
  "worklet";
  if (!outputs) {
    return;
  }
  // We need to have this shape:  (1, 1, 80, 80) (1, 5, 80, 80)
  const scores = outputs[0];
  // console.log("Scores", scores)
  const geometry = outputs[1];
  // console.log("Geometry", geometry)

  // console.log(`Detected ${num_detections[0]} objects`);
};

function postProcessRecognitionData(
  score: Map<string, number>,
  geo: Map<string, number>,
  ratioW: number,
  ratioH: number
) {
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
}

export { resizeFrame };
export type { ResizeFrameReturn };
