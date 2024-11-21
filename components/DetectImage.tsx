import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageStyle,
} from "react-native";
import { RootStackScreenProps } from "@/types/navigation";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

type DetectImageProps = RootStackScreenProps<"DetectImage">;

// Separate ImageDownload component
const ImageDownload: React.FC<{
  source: { uri: string };
  style: ImageStyle;
}> = ({ source, style }) => {
  const downloadImage = async (url: string) => {
    try {
      Alert.alert("Downloading Image", "Do you want to download the image?", [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const fileName = url.split("/").pop();
              const localUri = `${FileSystem.documentDirectory}${fileName}`;
              const downloadResult = await FileSystem.downloadAsync(
                url,
                localUri
              );
              await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
              Alert.alert("Downloaded", "Image downloaded successfully");
            } catch (error) {
              console.error("Download error:", error);
              Alert.alert("Download Failed", "Failed to download image");
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Download Failed", "Failed to download image");
    }
  };

  return (
    <TouchableOpacity onPress={() => downloadImage(source.uri)}>
      <Image source={source} style={style} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const DetectImage: React.FC<DetectImageProps> = ({ route }) => {
  const {
    croppedImageS3Url,
    originalImageS3Url,
    removedbgImageS3Url,
    resizedImageS3Url,
    plotImageS3Url,
    controlLineValue,
    testLineValue,
  } = route.params;

  const [showResult, setShowResult] = useState(false);
  const [controlLine, setControlLine] = useState<string>("0");
  const [testLine, setTestLine] = useState<string>("0");
  const [inputRatio, setInputRatio] = useState<string>("0.18");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    setControlLine(controlLineValue.toFixed(3));
    setTestLine(testLineValue > 0 ? testLineValue.toFixed(3) : "0.000");
  }, [controlLineValue, testLineValue]);

  const handleCalculate = () => {
    const ratio = parseFloat(testLine) / parseFloat(controlLine);
    const thresholdRatio = parseFloat(inputRatio || "0.18");
    setResult(
      ratio > thresholdRatio ? "Result is Positive" : "Result is Negative"
    );
    setShowResult(true);
  };

  const handleInputChange = (text: string) => {
    setInputRatio(text);
    setShowResult(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.croppedimageContainer}>
          <ImageDownload
            source={{ uri: croppedImageS3Url }}
            style={styles.image}
          />
        </View>

        <View style={styles.croppedimageContainer}>
          <ImageDownload
            source={{ uri: resizedImageS3Url }}
            style={styles.image}
          />
        </View>

        <View style={styles.plotimageContainer}>
          <ImageDownload
            source={{ uri: plotImageS3Url }}
            style={styles.image}
          />
        </View>

        <View style={styles.lineContainer}>
          <Text style={styles.lineLabel}>Control Line:</Text>
          <View style={styles.lineValueBox}>
            <Text style={styles.lineValue}>{controlLine}</Text>
          </View>
        </View>

        <View style={styles.lineContainer}>
          <Text style={styles.lineLabel}>Test Line:</Text>
          <View style={styles.lineValueBox}>
            <Text style={styles.lineValue}>{testLine}</Text>
          </View>
        </View>

        <View style={styles.lineContainer}>
          <Text style={styles.lineLabel}>Threshold Ratio(input value):</Text>
          <View style={styles.lineValueBox}>
            <TextInput
              style={styles.lineValue}
              value={inputRatio}
              keyboardType="numeric"
              onChangeText={handleInputChange}
              placeholder="0.18"
            />
          </View>
        </View>

        {!showResult && (
          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Calculate Result</Text>
          </TouchableOpacity>
        )}

        {showResult && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultText,
                { color: result.includes("Positive") ? "#28a745" : "#dc3545" },
              ]}
            >
              {result}
            </Text>
          </View>
        )}

        <View style={styles.originalimageContainer}>
          <ImageDownload
            source={{ uri: removedbgImageS3Url }}
            style={styles.image}
          />
        </View>

        <View style={styles.originalimageContainer}>
          <ImageDownload
            source={{ uri: originalImageS3Url }}
            style={styles.image}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  originalimageContainer: {
    width: width * 0.9,
    height: height * 0.25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  croppedimageContainer: {
    width: width * 0.9,
    height: height * 0.1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  plotimageContainer: {
    width: width * 0.9,
    height: height * 0.1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  lineLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    flex: 1,
  },
  lineValueBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    flex: 1,
  },
  lineValue: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default DetectImage;
