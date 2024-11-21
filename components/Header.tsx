import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface HeaderProps {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList
  >;
  route: { name: keyof RootStackParamList };
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ navigation, route, title }) => {
  const isMainScreen = route.name === "Main";

  const handleHomePress = () => {
    if (route.name !== "Main") {
      Alert.alert(
        "Return Home",
        "Do you want to go back to the home screen?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => navigation.navigate("Main"),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      Alert.alert(
        "Go Back",
        "Do you want to go back to the previous screen?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const getScreenTitle = () => {
    if (title) return title;

    switch (route.name) {
      case "Main":
        return "StripLens";
      case "ImagePreview":
        return "Image Preview";
      case "DetectImage":
        return "Test Results";
      default:
        return "";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleBackPress}
          disabled={!navigation.canGoBack()}
        >
          {navigation.canGoBack() && (
            <IconSymbol
              name="chevron.backward.2"
              color="#007AFF"
              size={24}
              style={styles.icon}
              weight="medium"
            />
          )}
        </TouchableOpacity>

        <Text style={styles.title}>{getScreenTitle()}</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleHomePress}
          disabled={isMainScreen}
        >
          {!isMainScreen && (
            <IconSymbol
              name="house"
              color="#007AFF"
              size={24}
              style={styles.icon}
              weight="medium"
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    height: 56,
    paddingTop: 8,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    flex: 1,
  },
  iconButton: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 8,
  },
});

export default Header;
