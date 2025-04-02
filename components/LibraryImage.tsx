import React, { useState, useEffect } from "react";
import { Alert, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "../types/navigation";
import { IconSymbol } from "@/components/ui/IconSymbol";

type LibraryImageNavigationProps = RootStackScreenProps<"Main">["navigation"];
const LibraryImage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<LibraryImageNavigationProps>();

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Library permissions not granted");
        Alert.alert(
          "Library permissions not granted",
          "Please go to your settings and enable library permissions for this app."
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });
      if (result.canceled) {
        setError("No Image selected");
        return;
      }

      if (result.assets?.[0].uri) {
        navigation.navigate("ImagePreview", { imageUri: result.assets[0].uri });
        setError(null);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert(
        "Error picking image",
        "Failed to select image. Please try again."
      );
    }
  };

  return (
    <View style={styles.Imagecontainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        <IconSymbol size={50} name="folder" color="white" />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default LibraryImage;

const styles = StyleSheet.create({
  Imagecontainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 150,
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
