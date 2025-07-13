export interface DetectionResult {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export interface DetectDefectsResponse {
  results: DetectionResult[];
}

const API_BASE_URL = "http://localhost:8000";

export const detectDefects = async (
  file: File,
  confidenceThreshold: number
): Promise<DetectDefectsResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/detect-defects?confidence_threshold=${confidenceThreshold}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to detect defects: ${response.statusText}`);
  }

  const data: DetectDefectsResponse = await response.json();
  return data;
};
