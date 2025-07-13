"use client";

import React, { useState, useRef } from "react";
import { detectDefects, DetectionResult } from "@/utils/api";

// Defining colors for defects based on theme
const defectColors = {
  "missing hole": { light: "blue-500", dark: "blue-300" },
  "mouse bite": { light: "yellow-500", dark: "yellow-300" },
  "open circuit": { light: "purple-500", dark: "purple-300" },
  "short": { light: "red-500", dark: "red-300" },
  "spur": { light: "orange-500", dark: "orange-300" },
  "spurious copper": { light: "green-500", dark: "green-400" },
};

// Example defect descriptions and solutions
const defectSolutions = {
  "missing hole": "Ensure proper drill settings during PCB manufacturing.",
  "mouse bite": "Inspect routing paths and clean irregular edges.",
  "open circuit": "Check for broken traces and solder the gaps.",
  "short": "Remove excess solder causing shorts between traces.",
  "spur": "Eliminate stray connections by refining etching processes.",
  "spurious copper": "Remove unwanted copper patterns using fine etching tools.",
};

const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState<{ x: number; y: number } | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    setLoading(true);
    try {
      const response = await detectDefects(file, confidenceThreshold);
      setDetectionResults(response.results);
    } catch (error) {
      console.error("Error detecting defects:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const currentTheme = darkMode ? "dark" : "light";

  const getScaledBBox = (bbox: [number, number, number, number]) => {
    if (!imageRef.current || !imageLoaded) return bbox;

    const imgWidth = imageRef.current.naturalWidth;
    const imgHeight = imageRef.current.naturalHeight;
    const imgElement = imageRef.current;
    const scaleX = imgElement.width / imgWidth;
    const scaleY = imgElement.height / imgHeight;

    const [x1, y1, x2, y2] = bbox;
    return [
      x1 * scaleX,
      y1 * scaleY,
      x2 * scaleX,
      y2 * scaleY,
    ] as [number, number, number, number];
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"}`}
    >
      {/* Navbar */}
      <nav
        className={`p-4 sticky top-0 z-50 shadow-md ${darkMode ? "bg-gray-900 text-white" : "bg-white text-green-600"
          }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/icon.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">PCB Perfect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm">Filter:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className={`slider ${darkMode ? "accent-green-400" : "accent-green-400"}`}
            />
            <span>{Math.round(confidenceThreshold * 100)}%</span>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
                className="sr-only"
              />
              <div
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${darkMode ? "bg-gray-700" : "bg-yellow-400"
                  }`}
              >
                {/* Moon Icon */}
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 left-1 transition-all duration-300 ${darkMode ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.752 15.002A9.718 9.718 0 0 1 12 22a9.718 9.718 0 0 1-6.002-9.752c.119-5.416 4.652-9.749 10.002-9.75a9.712 9.712 0 0 1 6.502 2.598 1 1 0 0 1-1.123 1.663A7.736 7.736 0 0 0 16 5.236a7.715 7.715 0 0 0-4.252 14.002 7.745 7.745 0 0 0 9.044-3.2 1 1 0 0 1 1.66 1.124A9.737 9.737 0 0 1 21.752 15.002Z" />
                  </svg>
                </div>

                {/* Sun Icon */}
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 right-1 transition-all duration-300 ${darkMode ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm6 9a6 6 0 1 1-6-6 6 6 0 0 1 6 6Zm-1 0a5 5 0 1 0-5 5 5 5 0 0 0 5-5Zm-5 7a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1Zm-9-6H3a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2Zm16 0h1a1 1 0 0 1 0-2h-1a1 1 0 0 1 0 2ZM5.64 5.64a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.42 1.42l-.7-.71a1 1 0 0 1 0-1.42Zm12.02.71a1 1 0 0 1 1.42-1.42l.71.71a1 1 0 0 1-1.42 1.42l-.71-.7ZM4.93 17.36a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.42 1.42l-.7-.71a1 1 0 0 1 0-1.42Zm14.14.71a1 1 0 0 1 1.42-1.42l.71.71a1 1 0 0 1-1.42 1.42l-.71-.7Z" />
                  </svg>
                </div>

                {/* Toggle Ball */}
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                ></div>
              </div>
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMagnifierEnabled(!magnifierEnabled)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-200 ease-in-out ${magnifierEnabled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-610 hover:bg-gray-200 text-white"
                  }`}
                title={magnifierEnabled ? "Disable Magnifier" : "Enable Magnifier"} // Tooltip for better UX
              >
                {magnifierEnabled ? "❌" : "🔍"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto mt-8 p-4">
        <div
          className={`p-6 rounded shadow-md ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white"}`}
        >
          <h2 className="text-lg font-bold mb-4">Upload PCB Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm border rounded cursor-pointer"
          />
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded ${darkMode
              ? "bg-green-500 text-gray-800 hover:bg-green-400"
              : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            Detect Defects
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
          </div>
        )}

        {/* Results */}
        {!loading && detectionResults.length > 0 && (
          <div className="mt-8">
            {/* Image with Bounding Boxes */}
            <div className="flex justify-center">
              <div
                className="relative"
                onMouseMove={(e) => {
                  if (magnifierEnabled && imageRef.current) {
                    const rect = imageRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    setMagnifierPosition({ x, y });
                  }
                }}
                onMouseLeave={() => setMagnifierPosition(null)}
              >
                {file && (
                  <img
                    ref={imageRef}
                    src={URL.createObjectURL(file)}
                    alt="Uploaded PCB"
                    className={`max-w-4xl w-full h-auto object-contain ${magnifierEnabled ? "cursor-magnifier" : ""
                      }`}
                    onLoad={handleImageLoad}
                  />
                )}
                {/* Bounding Boxes */}
                {detectionResults.map((result, index) => {
                  const scaledBBox = getScaledBBox(result.bbox);
                  return (
                    <div
                      key={index}
                      className={`absolute border-4 ${defectColors[result.class]
                        ? `border-${defectColors[result.class][currentTheme]}`
                        : "border-gray-500"
                        }`}
                      style={{
                        left: `${scaledBBox[0]}px`,
                        top: `${scaledBBox[1]}px`,
                        width: `${scaledBBox[2] - scaledBBox[0]}px`,
                        height: `${scaledBBox[3] - scaledBBox[1]}px`,
                      }}
                    >
                      <span
                        className={`absolute top-0 left-0 transform -translate-y-full px-2 py-1 rounded text-xs ${darkMode ? "bg-green-500 text-gray-900" : "bg-green-600 text-white"
                          }`}
                      >
                        {result.class.charAt(0).toUpperCase() + result.class.slice(1)}
                      </span>
                    </div>
                  );
                })}
                {/* Magnifier */}
                {magnifierEnabled && magnifierPosition && (
                  <div
                    className="absolute z-10 border border-gray-400 rounded-full overflow-hidden"
                    style={{
                      width: "150px",
                      height: "150px",
                      left: `${magnifierPosition.x - 75}px`,
                      top: `${magnifierPosition.y - 75}px`,
                      backgroundImage: `url(${URL.createObjectURL(file)})`,
                      backgroundSize: `${imageRef.current!.width * 2}px ${imageRef.current!.height * 2}px`,
                      backgroundPosition: `-${magnifierPosition.x * 2 - 75}px -${magnifierPosition.y * 2 - 75}px`,
                      pointerEvents: "none",
                    }}
                  ></div>
                )}
              </div>
            </div>


            {/* Defect Table */}
            <div className="mt-8 w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <h3 className="text-lg font-bold mb-2 text-center">Detected Defects</h3>
                <table className="table-auto w-full border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                  <thead>
                    <tr
                      className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      <th className="px-4 py-3 text-sm font-semibold uppercase border-b border-gray-300">
                        Defect
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold uppercase border-b border-gray-300">
                        Confidence
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold uppercase border-b border-gray-300">
                        Solution
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detectionResults.map((result, index) => (
                      <tr
                        key={index}
                        className={`${darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-white hover:bg-gray-100 text-gray-700"
                          } ${index % 2 === 0
                            ? darkMode
                              ? "bg-gray-600"
                              : "bg-gray-50"
                            : ""
                          } transition duration-200 ease-in-out`}
                      >
                        <td className="px-4 py-3 text-center border-b border-gray-300 text-sm font-medium capitalize">
                          {result.class}
                        </td>
                        <td className="px-4 py-3 text-center border-b border-gray-300 text-sm">
                          {(result.score * 100).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-center border-b border-gray-300 text-sm">
                          {defectSolutions[result.class]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
