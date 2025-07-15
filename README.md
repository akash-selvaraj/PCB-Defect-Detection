# ⚡ PCB Perfect – Web-Based PCB Defect Detection System

**PCB Perfect** is a full-stack, AI-powered web application designed to detect six common types of PCB (Printed Circuit Board) defects. It features a fast, user-friendly interface and a powerful Detectron2 model served via a Python backend.

> Upload → Detect → Zoom → Filter → Explore with Ease.

---

## 📸 Final Product

🚀 <img width="1920" height="1080" alt="Demo" src="https://github.com/user-attachments/assets/e4f7bb9b-dc06-4f35-b272-4e23d060cf12" />

---

## 🧠 Supported Defect Classes

This system detects the following defect types:

| Defect Class      | Description                           |
| ----------------- | ------------------------------------- |
| `missing_hole`    | Expected hole is absent               |
| `mouse_bite`      | Irregular copper notches              |
| `open_circuit`    | Broken trace disrupting connectivity  |
| `short`           | Unwanted electrical connection        |
| `spur`            | Extra trace branching off main path   |
| `spurious_copper` | Random or unintended copper fragments |

---

## 🖼️ Interface Features

![UI Overview](./f701db5d-97d8-43dc-aa74-252a5a21b0e6.png)

* 🖼️ **Image Upload** – Upload your PCB image
* 🧠 **Detect Button** – Trigger model inference
* 🎚️ **Confidence Score Slider** – Filter predictions by confidence (e.g., show only >60%)
* 🔍 **Magnifier** – Zoom into specific PCB areas
* 🌙 **Dark/Light Mode** – Toggle interface theme

---

## 📂 Dataset Used

**Source**: [Roboflow PCB Dataset](https://universe.roboflow.com/project-5o3tr/pcb-wgcpv/dataset/1)

* **Total Images**: 1386

  * Train: 969 (70%)
  * Validation: 277 (20%)
  * Test: 140 (10%)

**Preprocessing Steps**:

* ✅ Auto-Orient
* 🖼️ Resize: 640×640 (stretch)
* 🚫 No augmentations applied

---

## 🔧 System Architecture

![System Architecture](./diagram.png)

### Frontend – Next.js

* Uploads files and makes API calls
* Renders bounding boxes and overlays
* Offers theme toggle, magnifier, and filtering UI

### Backend – FastAPI (or Flask) + Python

* Loads Detectron2 model using `.pth` and `.yaml`
* Accepts image input and returns JSON + annotated image

---

## 🧰 Technologies Used

* **Frontend**: Next.js, Tailwind CSS, TypeScript, PostCSS
* **Backend**: Python 3.7, FastAPI or Flask, PyTorch, Detectron2
* **Deployment**: REST APIs, static asset serving
* **Utilities**: ESLint, modern config management

---

## 💻 Installation & Usage

### ✅ Requirements

* Linux OS (Detectron2 is Linux-specific)
* Python 3.7
* CUDA-compatible GPU for inference speed

---

### 🔹 Backend Setup

```bash
cd backend/
python3.7 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Optional CPU-only fallback (may not always work):

```bash
pip install -r requirements_cpu.txt
```

Install Detectron2:

```bash
python -m pip install 'git+https://github.com/facebookresearch/detectron2.git'
```

Start backend server:

```bash
python app.py
```

**API URL**: `http://localhost:5000`

---

### 🔸 Frontend Setup

```bash
cd frontend/
npm install
npm run dev
```

Open in browser: `http://localhost:3000`

---

## 📡 API Details

### Endpoint

`POST /predict`
**Content-Type**: `multipart/form-data`
**Field**: `file` (image input)

### Sample Response

```json
{
  "predictions": [
    {"class": "short", "score": 0.91, "box": [34, 56, 120, 160]},
    {"class": "spur", "score": 0.88, "box": [200, 100, 300, 180]}
  ],
  "annotated_image_url": "http://localhost:5000/static/image_annotated.png"
}
```

---

## 🧠 Model Artifacts

| File              | Purpose                                |
| ----------------- | -------------------------------------- |
| `model_final.pth` | Pre-trained weights for inference      |
| Config YAML       | Network architecture & hyperparameters |

---

## 📝 License

This project is under the **MIT License**.
Free to use, modify, and distribute.

---

## 🙋‍♂️ Contributing

Pull requests are welcome!
Please keep your code clean and well-tested.

---

## 👏 Acknowledgments

* [Roboflow](https://universe.roboflow.com/) – Dataset provider
* [Facebook Research](https://github.com/facebookresearch/detectron2) – Detectron2 framework
