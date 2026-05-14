# EduLocal

EduLocal is a local-first education project with:

- **Frontend**: React + TypeScript + Vite app in `/edulocal`
- **Backend**: FastAPI OCR service (PaddleOCR) in `/backend`

## Repository structure

- `/edulocal` — web app
- `/backend` — OCR API server (`ocr_server.py`)

## Frontend (React + Vite)

```bash
cd edulocal
npm install
npm run dev
```

Available scripts:

- `npm run dev` — start dev server
- `npm run build` — type-check and production build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

## Backend (FastAPI OCR)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn paddleocr pillow numpy python-multipart
uvicorn ocr_server:app --reload --host 0.0.0.0 --port 8000
```

Default endpoints:

- `GET /` — health/info message
- `POST /ocr` — accepts an uploaded image file and returns extracted text + confidence

## Notes

- The frontend currently contains the default Vite starter UI.
- CORS is enabled in the backend to allow frontend access.
