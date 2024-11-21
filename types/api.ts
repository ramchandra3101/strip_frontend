export default interface ProcessedImageResult {
  urls: {
    processed: string;
    Original: string;
    removedbg: string;
    cropped: string;
    plot: string;
  };
  intensity: {
    controlLine: number;
    testLine: number;
  };
}
