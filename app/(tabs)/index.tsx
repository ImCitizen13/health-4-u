import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Text, View } from "@/components/Themed";
import { Link, Stack } from "expo-router";
import Colors from "@/constants/Colors";
import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import {
  CardSvg1,
  CardSvg2,
  CardSvg3,
  CardSvg4,
  BlueCardBg,
} from "@/components/svg/Svgs";

function Card({
  path,
  style,
  textColor,
  icon,
}: {
  path: string;
  style: ViewStyle;
  textColor: string;
  icon: React.JSX.Element;
}) {
  return (
    <Link
      href={path}
      asChild
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: "100%",
            height: "100%",
          }}
        >
          <BlueCardBg width={"100%"} height={"100%"} />
        </View>
        <Pressable style={style}>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              color: textColor,
              fontWeight: "bold",
            }}
          >
            vision-camera-ocr
          </Text>
          {icon}
          {/* <CardSvg1 /> */}
        </Pressable>
      </>
    </Link>
  );
}

type WaveBgProps = {
  props: SvgProps;
  dimensions: { width: number; height: number };
};

const WaveBg = (props: SvgProps) => (
  <Svg
    style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}
    height={props.height}
    width={props.width}
    fill="none"
    viewBox="0 0 1816 837"
    preserveAspectRatio="none"
    {...props}
  >
    <Path
      fill="#E2E1CE"
      d="M.66 0h1815v721.857s-231.77 185.74-478 85.408C1051.96 690.849 723.84 501 530.5 501 337.16 501 .66 779.428.66 779.428V0Z"
    />
  </Svg>
);

export default function TabOneScreen() {
  // Firebase auth
  // const user = auth().currentUser;
  // const image = { uri: "/images/wavy_bg.png" };
  const bgImage = require("../../assets/images/wavy_bg.png");
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: Colors.light.background },
          // animation: "fade",
          // headerBlurEffect: true
          headerShadowVisible: false,
          headerLargeStyle: false,
          // header
        }}
      />
      <View
        style={{
          backgroundColor: Colors.light.background_2,
          width: "100%",
          height: "30%",
        }}
      >
        <WaveBg width={"100%"} height={"100%"}></WaveBg>
        <Text style={styles.title} numberOfLines={2}>
          {"Machine Learning \nDemos"}
        </Text>
      </View>

      <View style={styles.centerContainer}>
        {/* <Text> Welcome {user?.email}</Text> */}
        <Card
          path={"../vision-camera-ocr"}
          style={styles.card_1}
          textColor="#ffffff"
          icon={<CardSvg1 width={"30%"} height={"90%"} color={"#596A9F"} />}
        />
        <Card
          path={"../vision-camera-ocr_2"}
          style={styles.card_2}
          textColor="#ffffff"
          icon={<CardSvg2 width={"30%"} height={"90%"} color={"#596A9F"} />}
        />
        <Card
          path={"../vision-camera-ocr_2"}
          style={styles.card_3}
          textColor="#000000"
          icon={<CardSvg3 width={"30%"} height={"90%"} color={"#596A9F"} />}
        />
        <Card
          path={"../vision-camera-ocr_2"}
          style={styles.card_4}
          textColor="#000000"
          icon={<CardSvg4 width={"50%"} height={"100%"} color={"#596A9F"} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "100%",
    height: "100%",
    // alignItems: 'center',
    // justifyContent: "center",
    backgroundColor: Colors.light.background_2,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background_2,
  },
  image: {
    padding: 20,
    width: "100%",
  },
  title: {
    paddingHorizontal: 10,
    fontSize: 38,
    fontWeight: "bold",
    color: Colors.light.text,
  },

  card_1: {
    backgroundColor: "#65b0a3", //#5ca79a//#7cbdaf
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: -5,
    borderRadius: 10,
    maxHeight: 90,
    marginTop: 5,
    marginHorizontal: 15,
  },
  card_2: {
    backgroundColor: "#5869a2", //#475a99//#7a8ac3
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    maxHeight: 90,
    marginTop: 10,
    marginHorizontal: 15,
  },
  card_3: {
    backgroundColor: "#f3cd93", //#eac695//#fce6bf
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    maxHeight: 90,
    marginTop: 10,
    marginHorizontal: 15,
  },
  card_4: {
    backgroundColor: "#fdb5a1", //FEBCAC//EE9A83
    alignSelf: "stretch",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 12,
    borderRadius: 10,
    maxHeight: 90,
    marginTop: 10,
    marginHorizontal: 15,
  },
});
