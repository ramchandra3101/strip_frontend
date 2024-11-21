import { StyleSheet, Text, View } from "react-native";
import CameraButton from "@/components/CameraOption";
import LibraryImage from "@/components/LibraryImage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.main_container}>
        <View style={styles.options_container}>
          <CameraButton />
          <LibraryImage />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  options_container: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
  },
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
