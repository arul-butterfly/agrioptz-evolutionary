"""Dataset management service for AgriOpt."""
import pandas as pd
import io
import os
from typing import Dict, Any, List, Tuple

REQUIRED_COLUMNS = [
    'crop_name',
    'yield_per_hectare',
    'price_per_unit',
    'cost_per_hectare',
    'water_per_hectare'
]

OPTIONAL_COLUMNS = ['season', 'category', 'minimum_area', 'maximum_area', 'source']

SAMPLE_DATASET_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    'datasets', 'sample_crops.csv'
)

# Current active dataset in-memory cache
_current_dataset: List[Dict[str, Any]] = []


def validate_dataset(df: pd.DataFrame) -> Tuple[bool, List[str], List[str], pd.DataFrame]:
    """
    Validate a crop DataFrame.
    Returns: (is_valid, errors, warnings, cleaned_df)
    """
    errors = []
    warnings = []
    
    # Strip column names
    df.columns = [str(c).strip().lower() for c in df.columns]
    
    # Check required columns
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        errors.append(f"Missing required columns: {', '.join(missing_cols)}")
        return False, errors, warnings, df
    
    # Drop duplicates by crop_name
    orig_len = len(df)
    df = df.drop_duplicates(subset=['crop_name']).copy()
    if len(df) < orig_len:
        warnings.append(f"Removed {orig_len - len(df)} duplicate crop name rows.")
    
    # Check required string column
    df['crop_name'] = df['crop_name'].astype(str).str.strip()
    empty_names = df['crop_name'].isin(['', 'nan', 'none', 'null'])
    if empty_names.any():
        errors.append(f"Found {empty_names.sum()} rows with empty crop names.")
        df = df[~empty_names].copy()
    
    # Check numeric columns
    numeric_cols = ['yield_per_hectare', 'price_per_unit', 'cost_per_hectare', 'water_per_hectare']
    for col in numeric_cols:
        converted = pd.to_numeric(df[col], errors='coerce')
        nan_count = converted.isna().sum()
        if nan_count > 0:
            errors.append(f"Column '{col}' has {nan_count} non-numeric or missing values.")
        df[col] = converted
    
    if errors:
        return False, errors, warnings, df
    
    # Check non-positive values
    for col in numeric_cols:
        non_positive = (df[col] <= 0)
        if non_positive.any():
            invalid_crops = df[non_positive]['crop_name'].tolist()
            warnings.append(f"Excluded {len(invalid_crops)} crops with zero or negative values in '{col}': {invalid_crops}")
            df = df[~non_positive].copy()
    
    if len(df) == 0:
        errors.append("Dataset has no valid crop rows after removing non-positive values.")
        return False, errors, warnings, df
    
    # Optional columns handling
    if 'minimum_area' in df.columns:
        df['minimum_area'] = pd.to_numeric(df['minimum_area'], errors='coerce').fillna(0.0)
    else:
        df['minimum_area'] = 0.0
    
    if 'maximum_area' in df.columns:
        df['maximum_area'] = pd.to_numeric(df['maximum_area'], errors='coerce')
    else:
        df['maximum_area'] = None
    
    if 'season' not in df.columns:
        df['season'] = 'All Season'
    else:
        df['season'] = df['season'].fillna('All Season').astype(str)
        
    if 'category' not in df.columns:
        df['category'] = 'General'
    else:
        df['category'] = df['category'].fillna('General').astype(str)
    
    return True, errors, warnings, df


def process_uploaded_csv(content: bytes) -> Dict[str, Any]:
    """Process an uploaded CSV byte string."""
    global _current_dataset
    
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        return {
            'success': False,
            'errors': [f"Failed to parse CSV file: {str(e)}"],
            'warnings': [],
            'crops': [],
            'n_crops': 0
        }
    
    is_valid, errors, warnings, df_clean = validate_dataset(df)
    
    if not is_valid:
        return {
            'success': False,
            'errors': errors,
            'warnings': warnings,
            'crops': [],
            'n_crops': 0
        }
    
    # Clean records
    crops = []
    for _, row in df_clean.iterrows():
        crops.append({
            'crop_name': str(row['crop_name']),
            'yield_per_hectare': float(row['yield_per_hectare']),
            'price_per_unit': float(row['price_per_unit']),
            'cost_per_hectare': float(row['cost_per_hectare']),
            'water_per_hectare': float(row['water_per_hectare']),
            'season': str(row.get('season', 'All Season')),
            'category': str(row.get('category', 'General')),
            'minimum_area': float(row.get('minimum_area', 0.0) or 0.0),
            'maximum_area': float(row.get('maximum_area')) if pd.notna(row.get('maximum_area')) and row.get('maximum_area') is not None else None
        })
    
    _current_dataset = crops
    
    return {
        'success': True,
        'errors': errors,
        'warnings': warnings,
        'crops': crops,
        'n_crops': len(crops),
        'columns': list(df_clean.columns)
    }


def get_current_dataset() -> List[Dict[str, Any]]:
    """Get active dataset, loading default sample if empty."""
    global _current_dataset
    if not _current_dataset:
        if os.path.exists(SAMPLE_DATASET_PATH):
            try:
                with open(SAMPLE_DATASET_PATH, 'rb') as f:
                    content = f.read()
                res = process_uploaded_csv(content)
                if res['success']:
                    _current_dataset = res['crops']
            except Exception:
                _current_dataset = []
    return _current_dataset


def set_current_dataset(crops: List[Dict[str, Any]]) -> None:
    """Set active dataset."""
    global _current_dataset
    _current_dataset = crops


def get_sample_csv_content() -> bytes:
    """Get sample CSV file bytes."""
    if os.path.exists(SAMPLE_DATASET_PATH):
        with open(SAMPLE_DATASET_PATH, 'rb') as f:
            return f.read()
    return b"crop_name,yield_per_hectare,price_per_unit,cost_per_hectare,water_per_hectare,season,category\nRice,4500,25,55000,12000,Kharif,Cereal\nWheat,3500,28,40000,5000,Rabi,Cereal\n"
