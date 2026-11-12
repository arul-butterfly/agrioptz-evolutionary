"""Dataset management API routes."""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
from typing import List, Dict, Any
from ..services.dataset_service import (
    process_uploaded_csv,
    get_current_dataset,
    get_sample_csv_content,
    set_current_dataset
)
from ..models.schemas import CropData

router = APIRouter(prefix="/api", tags=["dataset"])


@router.get("/crops")
async def get_crops():
    """Retrieve current crop dataset."""
    crops = get_current_dataset()
    return {"crops": crops, "n_crops": len(crops)}


@router.post("/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload and validate a CSV dataset."""
    if not file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are accepted.")
    
    content = await file.read()
    result = process_uploaded_csv(content)
    
    if not result['success']:
        raise HTTPException(
            status_code=422,
            detail={
                'message': 'Dataset validation failed.',
                'errors': result['errors'],
                'warnings': result.get('warnings', [])
            }
        )
    
    return result


@router.get("/dataset/sample")
async def download_sample_dataset():
    """Download the official demonstration crop dataset."""
    content = get_sample_csv_content()
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sample_crops.csv"}
    )


@router.put("/crops")
async def update_crops(crops: List[CropData]):
    """Update current working dataset in memory."""
    crops_dict = [c.model_dump() for c in crops]
    set_current_dataset(crops_dict)
    return {"status": "success", "n_crops": len(crops_dict)}
