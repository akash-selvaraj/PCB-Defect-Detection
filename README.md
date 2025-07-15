# 🧠 PCB Defect Detection Web Application

A full-stack web application for detecting **six types of PCB defects** using a deep learning model (Detectron2). The system enables users to upload PCB images through a modern Next.js interface, which communicates with a Python backend inference service to return annotated predictions. It includes powerful features like **zoom magnification** and **light/dark mode toggle** for enhanced inspection.

---

## 📌 Features

* ✅ Upload and analyze PCB images
* ✅ Automatically detect **6 defect classes**:

  * `missing_hole`
  * `mouse_bite`
  * `open_circuit`
  * `short`
  * `spur`
  * `spurious_copper`
* ✅ Model returns annotated images highlighting the defect regions
* 🔍 Built-in **magnifier tool** for zooming into PCB areas
* 🌗 Toggle between **Light and Dark modes** for user comfort
* ⚡ Fast REST API integration between frontend and backend

---

## 🖼️ Demo

> 📽️ Add screenshots or link to a demo (e.g., deployed app or video walkthrough).

---

## 🏗️ System Architecture

The application has two main components:

### 🟦 Frontend: Next.js

* Receives user image uploads
* Sends REST API requests
* Displays annotated images
* Provides UI features (theme switch, magnifier)

### 🟩 Backend: Python + Flask (or FastAPI)

* Receives images from frontend
* Loads a pre-trained Detectron2 model
* Performs inference
* Sends back predictions and image overlays

![Architecture Diagram](diagram.png)

---

## ⚙️ Technologies Used

### 🖥️ Frontend

* [Next.js](https://nextjs.org/)
* TypeScript
* Tailwind CSS
* PostCSS
* ESLint
* Inbuilt zoom tool
* Light/Dark mode toggle

### ⚙️ Backend

* Python 3.7
* Flask or FastAPI
* Detectron2
* PyTorch
* YAML for model configuration

---

## 🛠️ System Requirements

* ✅ **Linux OS is mandatory** (Detectron2 does not support Windows reliably)
* ✅ **Python 3.7** or compatible environment
* ⚠️ `requirements_cpu.txt` is provided but **may not work** (Detectron2 prefers CUDA-enabled environments)
* 🧠 Pre-trained model (`model_final.pth`) must be placed in the specified location

---

## 🐍 Backend Setup (Inference Service)

### 1. Clone the repository & enter backend directory:

```bash
cd backend/
```

### 2. Create a virtual environment and activate it:

```bash
python3.7 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies (preferably use GPU):

```bash
pip install -r requirements.txt
```

If you're on a CPU-only machine, try:

```bash
pip install -r requirements_cpu.txt  # ⚠️ May not work reliably
```

### 4. Install Detectron2:

```bash
python -m pip install 'git+https://github.com/facebookresearch/detectron2.git'
```

### 5. Start the backend API service:

```bash
python app.py
```

The backend will be available at: `http://localhost:5000`

---

## 🌐 Frontend Setup (Next.js)

### 1. Navigate to frontend folder:

```bash
cd frontend/
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Run the frontend app:

```bash
npm run dev
```

App will be available at: `http://localhost:3000`

---

## 📂 Directory Structure

```
.
├── backend/
│   ├── app.py
│   ├── model_final.pth
│   ├── YAML Configs/
│   ├── requirements.txt
│   └── requirements_cpu.txt
│
├── frontend/
│   ├── api.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── fonts/
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   └── public/
│
├── diagram.png
└── README.md
```

---

## 📦 Model

* **File:** `model_final.pth`
* **Location:** `backend/`
* **Config:** YAML files defining preprocessing and model architecture

---

## 📡 API Endpoint

```http
POST /predict
Content-Type: multipart/form-data
```

Form Data:

* `file`: image file

**Response**: JSON with defect predictions + annotated image

```json
{
  "predictions": [
    {"class": "short", "score": 0.91, "box": [34, 56, 120, 160]},
    {"class": "spur", "score": 0.88, "box": [200, 100, 300, 180]}
  ],
  "image_url": "http://localhost:5000/static/annotated_image.png"
}
```

---

## ❗ Notes

* If Detectron2 fails to build, ensure:

  * Linux system
  * PyTorch version matches CUDA
  * C++ build tools installed (e.g., `build-essential` on Ubuntu)

---

## 📝 License

This project is released under the MIT License.

---
