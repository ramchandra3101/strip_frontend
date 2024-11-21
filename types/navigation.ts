import { NativeStackScreenProps } from "@react-navigation/native-stack"; //provide screen props for navigation

export type RootStackParamList = {
  StackNavigator: undefined; //no params
  Main: undefined; //no params
  ImagePreview: { imageUri: string }; //giving the screen a param of imageUri(taking mobile phone image location)
  DetectImage: {
    croppedImageS3Url: string;
    originalImageS3Url: string;
    removedbgImageS3Url: string;
    resizedImageS3Url: string;
    plotImageS3Url: string;
    controlLineValue: number;
    testLineValue: number;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {} //extends global RootParamList interface with our RootStackParamList.Enables autocomplete for our navigation
  }
}
