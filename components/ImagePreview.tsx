import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { RootStackScreenProps } from "@/types/navigation";
import { handleProcess } from "@/components/HandleProcess";
import { useNavigation } from "@react-navigation/native";

type ImagePreviewProps = RootStackScreenProps<"ImagePreview">;

const ImagePreview: React.FC<ImagePreviewProps> = ({ route }) => {
  const imageUri = route.params.imageUri;
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const navigation = useNavigation();

  const handleProcessImage = async () => {
    try {
      setConnectionFailed(false);
      setIsProcessing(true);
      await handleProcess(imageUri, setIsProcessing, navigation);
    } catch (error) {
      console.error("Process error:", error);
      setConnectionFailed(true);
    }
  };

  return (
    <View style={styles.imagePreviewPage}>
      <View style={styles.imagePreviewBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imageInBox} />
        ) : (
          <Text>No image selected</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.processButton, connectionFailed && { opacity: 0.5 }]}
        onPress={handleProcessImage}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.processButtonText}>
            {connectionFailed ? "Connection Failed" : "Process"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({
  imagePreviewPage: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  imagePreviewBox: {
    marginTop: 100,
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "#3b5998",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imageInBox: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  processButton: {
    padding: 15,
    backgroundColor: "#3b5998",
    borderRadius: 8,
    alignItems: "center",
  },
  processButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});
