import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/components/HomeScreen";
import ImagePreview from "@/components/ImagePreview";
import DetectImage from "@/components/DetectImage";
import Header from "@/components/Header";
import { RootStackParamList } from "../../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Helper function to get screen titles
const getScreenTitle = (routeName: keyof RootStackParamList): string => {
  switch (routeName) {
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

export default function RootLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        header: ({ navigation, route }) => (
          <Header
            navigation={navigation}
            route={route}
            title={getScreenTitle(route.name as keyof RootStackParamList)}
          />
        ),
      }}
    >
      <Stack.Screen name="Main" component={HomeScreen} />

      <Stack.Screen name="ImagePreview" component={ImagePreview} />

      <Stack.Screen name="DetectImage" component={DetectImage} />
    </Stack.Navigator>
  );
}
