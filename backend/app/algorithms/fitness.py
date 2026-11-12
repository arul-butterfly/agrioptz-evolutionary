"""
Fitness evaluation for AgriOpt Genetic Algorithm.
"""
import numpy as np
from typing import List, Dict, Any, Optional


def compute_profit_per_hectare(crops: List[Dict[str, Any]]) -> np.ndarray:
    """
    Compute profit per hectare for each crop.
    profit_i = (yield_per_hectare * price_per_unit) - cost_per_hectare
    """
    profits = []
    for crop in crops:
        p = (float(crop['yield_per_hectare']) * float(crop['price_per_unit'])) - float(crop['cost_per_hectare'])
        profits.append(p)
    return np.array(profits, dtype=float)


def evaluate_fitness(
    individual: np.ndarray,
    profit_per_ha: np.ndarray,
    water_per_ha: np.ndarray,
    cost_per_ha: np.ndarray,
    total_land: float,
    total_water: float,
    total_budget: float,
    penalty_coefficient: float = 1e6
) -> float:
    """
    Evaluate the fitness of an individual.
    Fitness = Total Profit - Penalty for constraint violations.
    Returns the fitness value (higher is better).
    """
    total_profit = float(np.dot(profit_per_ha, individual))
    land_used = float(np.sum(individual))
    water_used = float(np.dot(water_per_ha, individual))
    budget_used = float(np.dot(cost_per_ha, individual))

    land_violation = max(0.0, land_used - total_land)
    water_violation = max(0.0, water_used - total_water)
    budget_violation = max(0.0, budget_used - total_budget)

    land_penalty = (land_violation / max(total_land, 1e-9)) * penalty_coefficient
    water_penalty = (water_violation / max(total_water, 1e-9)) * penalty_coefficient
    budget_penalty = (budget_violation / max(total_budget, 1e-9)) * penalty_coefficient

    fitness = total_profit - land_penalty - water_penalty - budget_penalty
    return fitness


def is_feasible(
    individual: np.ndarray,
    water_per_ha: np.ndarray,
    cost_per_ha: np.ndarray,
    total_land: float,
    total_water: float,
    total_budget: float,
    tolerance: float = 1e-4
) -> bool:
    """Check if an individual satisfies all resource constraints."""
    land_used = float(np.sum(individual))
    water_used = float(np.dot(water_per_ha, individual))
    budget_used = float(np.dot(cost_per_ha, individual))
    return bool(
        land_used <= total_land + tolerance and
        water_used <= total_water + tolerance and
        budget_used <= total_budget + tolerance and
        np.all(individual >= -tolerance)
    )


def repair_individual(
    individual: np.ndarray,
    water_per_ha: np.ndarray,
    cost_per_ha: np.ndarray,
    total_land: float,
    total_water: float,
    total_budget: float,
    min_areas: Optional[np.ndarray] = None,
    max_areas: Optional[np.ndarray] = None
) -> np.ndarray:
    """
    Repair an individual to make it strictly feasible through proportional scaling.
    Ensures non-negative allocations and respects upper limits.
    """
    ind = np.maximum(individual, 0.0)

    if max_areas is not None:
        ind = np.minimum(ind, max_areas)

    for _ in range(100):
        land_used = float(np.sum(ind))
        water_used = float(np.dot(water_per_ha, ind))
        budget_used = float(np.dot(cost_per_ha, ind))

        factors = [1.0]
        if land_used > total_land + 1e-9:
            factors.append(total_land / land_used)
        if water_used > total_water + 1e-9:
            factors.append(total_water / water_used)
        if budget_used > total_budget + 1e-9:
            factors.append(total_budget / budget_used)

        scale = min(factors)
        if scale >= 1.0:
            break
        ind = ind * scale

    # Apply minimum areas if total min areas do not exceed land
    if min_areas is not None and np.sum(min_areas) <= total_land:
        ind = np.maximum(ind, min_areas)
        # Rescale if needed
        for _ in range(100):
            land_used = float(np.sum(ind))
            water_used = float(np.dot(water_per_ha, ind))
            budget_used = float(np.dot(cost_per_ha, ind))
            factors = [1.0]
            if land_used > total_land + 1e-9:
                factors.append(total_land / land_used)
            if water_used > total_water + 1e-9:
                factors.append(total_water / water_used)
            if budget_used > total_budget + 1e-9:
                factors.append(total_budget / budget_used)
            scale = min(factors)
            if scale >= 1.0:
                break
            ind = ind * scale

    return ind
