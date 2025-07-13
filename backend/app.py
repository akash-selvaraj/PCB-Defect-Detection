from fastapi import FastAPI, UploadFile, File, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2.data import MetadataCatalog
import cv2
import numpy as np
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "192.168.208.220"],  # Replace '*' with ["http://localhost:3000"] for stricter control
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load configuration and model at startup
cfg = get_cfg()
cfg.merge_from_file("yaml/ssd/faster_rcnn_R_50_SSD_FPN_3x.yaml")
cfg.MODEL.WEIGHTS = "model/model_final.pth"
cfg.MODEL.ROI_HEADS.NUM_CLASSES = 6
cfg.MODEL.DEVICE = "cpu"  # Set to "cuda" if using GPU

predictor = DefaultPredictor(cfg)
pcb_metadata = MetadataCatalog.get("pcb_defects_train")
pcb_metadata.thing_classes = [
    "missing hole",
    "mouse bite",
    "open circuit",
    "short",
    "spur",
    "spurious copper",
]

@app.post("/detect-defects")
async def detect_defects(
    file: UploadFile = File(...),
    confidence_threshold: float = Query(0.5, ge=0.0, le=1.0)
):
    """
    Detect defects in PCB images. Returns bounding box coordinates, class names, and scores.
    """
    # Read and decode the uploaded image
    image_bytes = await file.read()
    image_np = np.frombuffer(image_bytes, np.uint8)
    im = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # Run the predictor
    outputs = predictor(im)
    instances = outputs["instances"].to("cpu")
    
    # Filter predictions by confidence threshold
    scores = instances.scores if instances.has("scores") else []
    classes = instances.pred_classes if instances.has("pred_classes") else []
    boxes = instances.pred_boxes if instances.has("pred_boxes") else []

    results = []
    for i, score in enumerate(scores):
        if score >= confidence_threshold:
            results.append({
                "bbox": boxes[i].tensor.numpy().tolist()[0],  # Convert to list
                "class": pcb_metadata.thing_classes[classes[i]],
                "score": float(score)
            })

    # Return results as JSON
    return JSONResponse(content={"results": results})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
