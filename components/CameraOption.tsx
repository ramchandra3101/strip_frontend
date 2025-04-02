import React, { useState, useEffect } from "react";
import { Alert, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../types/navigation";
import { IconSymbol } from "@/components/ui/IconSymbol";

type CameraNavigationProps = RootStackScreenProps<"Main">["navigation"];
const CameraButton: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<CameraNavigationProps>();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error requesting camera permissions: ", error);
        setHasPermission(false);
      }
    })();
  }, []);

  const takePhoto = async () => {
    try {
      if (!hasPermission) {
        setError("Camera permissions not granted");
        Alert.alert(
          "Camera permissions not granted",
          "Please go to your settings and enable camera permissions for this app.",
          [
            {
              text: "OK",
              onPress: () => setError(null),
            },
          ]
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) {
        setError("No photo Selected");
        return;
      }

      if (result.assets?.[0].uri) {
        navigation.navigate("ImagePreview", { imageUri: result.assets[0].uri });
        setError(null);
      }
    } catch (error) {
      console.error("Error taking photo: ", error);
      Alert.alert("Error taking photo", "Please try again.");
    }
  };

  return (
    <View style={styles.Cameracontainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={takePhoto}
        activeOpacity={0.7}
      >
        <IconSymbol name="camera" color="#FFF" size={48} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
export default CameraButton;

const styles = StyleSheet.create({
  Cameracontainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 200,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2196F3", // Modern blue color
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    transform: [{ scale: 1 }], // For smooth scaling animation
  },

  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
  },
});
