"""Optimization API routes for AgriOpt."""
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from ..models.schemas import (
    OptimizationRequest,
    CompareRequest,
    ConstraintValidationRequest
)
from ..services.optimization_service import (
    run_genetic_algorithm,
    run_greedy_algorithm,
    run_comparison,
    get_history,
    get_optimization_by_id
)
from ..services.report_service import (
    generate_csv_report,
    generate_comparison_csv,
    generate_pdf_report
)

router = APIRouter(prefix="/api", tags=["optimization"])


@router.post("/constraints/validate")
async def validate_constraints(request: ConstraintValidationRequest):
    """
    Validate configured resource constraints against the crop dataset.
    Detects impossible constraints, severe bottlenecks, or zero profit potentials.
    """
    crops = request.crops
    constraints = request.constraints
    
    if len(crops) == 0:
        raise HTTPException(status_code=400, detail="Cannot validate constraints with an empty crop dataset.")
    
    warnings = []
    errors = []
    
    # Check if any crop has positive profit
    positive_profit_crops = []
    for c in crops:
        profit_per_ha = (c.yield_per_hectare * c.price_per_unit) - c.cost_per_hectare
        if profit_per_ha > 0:
            positive_profit_crops.append(c.crop_name)
            
    if not positive_profit_crops:
        errors.append("None of the crops yield positive net profit with current prices and costs.")
    elif len(positive_profit_crops) < len(crops):
        warnings.append(f"{len(crops) - len(positive_profit_crops)} crop(s) have negative profit per hectare and will likely be avoided by optimizer.")
        
    # Check minimum resource requirements
    min_water = min(c.water_per_hectare for c in crops)
    if constraints.total_water_m3 < min_water:
        warnings.append(
            f"Total water ({constraints.total_water_m3:,.0f} m³) cannot cover even 1 hectare of the lowest water-demanding crop ({min_water:,.0f} m³/ha)."
        )
        
    min_cost = min(c.cost_per_hectare for c in crops)
    if constraints.total_budget_inr < min_cost:
        warnings.append(
            f"Total budget (₹{constraints.total_budget_inr:,.0f}) cannot cover 1 hectare of the lowest cost crop (₹{min_cost:,.0f}/ha)."
        )
        
    sum_min_area = sum(c.minimum_area or 0.0 for c in crops)
    if sum_min_area > constraints.total_land_ha:
        errors.append(
            f"Sum of minimum crop areas ({sum_min_area:.2f} ha) exceeds total available land ({constraints.total_land_ha:.2f} ha)."
        )
        
    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "n_crops": len(crops),
        "positive_profit_crops_count": len(positive_profit_crops)
    }


@router.post("/optimize/genetic")
async def optimize_genetic(request: OptimizationRequest):
    """Run Genetic Algorithm optimization."""
    try:
        result = run_genetic_algorithm(
            request.crops,
            request.constraints,
            request.ga_params
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GA Optimization error: {str(e)}")


@router.post("/optimize/greedy")
async def optimize_greedy(request: OptimizationRequest):
    """Run Greedy baseline algorithm optimization."""
    try:
        result = run_greedy_algorithm(request.crops, request.constraints)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greedy Optimization error: {str(e)}")


@router.post("/optimize/compare")
async def compare_algorithms(request: CompareRequest):
    """Run empirical comparison between GA (multiple seeds) and Greedy baseline."""
    try:
        result = run_comparison(
            request.crops,
            request.constraints,
            request.ga_params,
            request.n_runs
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Algorithm comparison error: {str(e)}")


@router.get("/optimization/history")
async def get_optimization_history():
    """Retrieve historical optimization runs."""
    return {"history": get_history()}


@router.get("/optimization/{opt_id}")
async def get_optimization(opt_id: str):
    """Retrieve detailed result of a past optimization by ID."""
    entry = get_optimization_by_id(opt_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Optimization record not found.")
    return entry


@router.get("/reports/{opt_id}/csv")
async def download_csv(opt_id: str):
    """Export optimization results as CSV."""
    entry = get_optimization_by_id(opt_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Optimization record not found.")
    
    result = entry.get('result', {})
    if 'genetic_best' in result:
        content = generate_comparison_csv(result)
        filename = f"agriopt_comparison_{opt_id[:8]}.csv"
    else:
        content = generate_csv_report(result)
        filename = f"agriopt_optimization_{opt_id[:8]}.csv"
        
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/reports/{opt_id}/pdf")
async def download_pdf(opt_id: str):
    """Export optimization results as a styled PDF report."""
    entry = get_optimization_by_id(opt_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Optimization record not found.")
    
    result = entry.get('result', {})
    if 'genetic_best' in result:
        target_result = result['genetic_best']
    else:
        target_result = result
        
    content = generate_pdf_report(target_result, entry.get('constraints'))
    filename = f"agriopt_report_{opt_id[:8]}.pdf"
    
    return Response(
        content=content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
