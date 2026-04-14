from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from paddleocr import PaddleOCR
import io
from PIL import Image
import numpy as np

app = FastAPI()

# Enable CORS so your React frontend can talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize PaddleOCR (PP-OCRv5)
# use_angle_cls=True helps with rotated text, lang='devanagari' covers Hindi + English
ocr = PaddleOCR(use_angle_cls=True, lang='devanagari', show_log=False)

@app.post("/ocr")
async def process_ocr(image: UploadFile = File(...)):
    try:
        # Read the image bytes from the request
        image_bytes = await image.read()
        
        # Convert bytes to a numpy array (PaddleOCR's preferred format)
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_array = np.array(img)
        
        # Run OCR
        result = ocr.ocr(img_array, cls=True)
        
        extracted_text = []
        confidence_scores = []
        
        # Extract text and confidence scores from the result
        if result and result[0]:
            for line in result[0]:
                text = line[1][0]
                confidence = line[1][1]
                extracted_text.append(text)
                confidence_scores.append(confidence)
                
        # Join all text into a single string for the curriculum engine
        full_text = "\n".join(extracted_text)
        avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
        
        return {
            "status": "success",
            "extracted_text": full_text,
            "confidence": float(avg_confidence)
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def read_root():
    return {"message": "EduLocal PP-OCRv5 Server is running!"}