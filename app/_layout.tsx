import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import * as LocalAuthentication from "expo-local-authentication";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  function onAuthenticate(onSuccess: () => void) {
    const auth = LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate using Biometrics",
      fallbackLabel: "Enter Your Password",
    }).then((result) => {
      setIsAuthenticated(result.success);
      if (result.success) onSuccess();
      console.log("User Authenticated");
    });
  }
  useEffect(() => {
    if (loaded) {
      async () => {
        // check if the device has Biometrics
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setHasBiometrics(compatible);
        // Check if the user its signed in
      };
      if (!isAuthenticated)
        onAuthenticate(() => {
          SplashScreen.hideAsync();
        });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  
  
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
