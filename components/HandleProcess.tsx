import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import ProcessedImageResult from "../types/api";

export async function handleProcess(
  imageUri: string,
  setIsProcessing: (value: boolean) => void,
  navigation: NavigationProp<RootStackParamList>
): Promise<void> {
  if (!imageUri) {
    Alert.alert("No Image Selected", "Please select an image to proceed");
    return;
  }

  setIsProcessing(true);

  try {
    const formData = new FormData();
    const formattedUri = imageUri.startsWith("file://")
      ? imageUri
      : "file://" + imageUri;
    const originalFileName = formattedUri.split("/").pop() || "image.jpg";
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10);
    const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    const fileNameWithTimestamp = `${datePart}_${timePart}_${originalFileName}`;
    console.log(formattedUri);
    formData.append("file", {
      uri: formattedUri,
      type: "image/jpeg",
      name: fileNameWithTimestamp,
    } as any);

    const response = await fetch("http://10.130.230.116:8000/image/process", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result: ProcessedImageResult = await response.json();

    navigation.navigate("DetectImage", {
      croppedImageS3Url: result.urls.processed,
      originalImageS3Url: result.urls.Original,
      removedbgImageS3Url: result.urls.removedbg,
      resizedImageS3Url: result.urls.cropped,
      plotImageS3Url: result.urls.plot,
      controlLineValue: result.intensity.controlLine,
      testLineValue: result.intensity.testLine,
    });

    Alert.alert("Success", "Image detected successfully");
  } catch (error) {
    console.error("Error processing image:", error);
    Alert.alert(
      "Error",
      error instanceof Error ? error.message : "Failed to process image"
    );
  } finally {
    setIsProcessing(false);
  }
}

export default handleProcess;
