"""
Greedy Algorithm baseline for AgriOpt Crop Planning Optimizer.

Strategy:
Rank crops by profitability per hectare. At each step, allocate the maximum
possible area to the highest-ranking crop considering remaining land,
water, and budget constraints, as well as bounds.
"""
import numpy as np
import time
from typing import List, Dict, Any
from .fitness import compute_profit_per_hectare, is_feasible


class GreedyAlgorithm:
    """
    Resource-aware greedy crop allocation baseline.
    """
    
    def run(
        self,
        crops: List[Dict[str, Any]],
        total_land: float,
        total_water: float,
        total_budget: float
    ) -> Dict[str, Any]:
        """Run the Greedy Algorithm."""
        start_time = time.time()
        n_crops = len(crops)
        
        if n_crops == 0:
            raise ValueError("No crops provided for optimization.")
        if total_land <= 0 or total_water <= 0 or total_budget <= 0:
            raise ValueError("Resource constraints must all be strictly positive.")
        
        profit_per_ha = compute_profit_per_hectare(crops)
        water_per_ha = np.array([float(c['water_per_hectare']) for c in crops], dtype=float)
        cost_per_ha = np.array([float(c['cost_per_hectare']) for c in crops], dtype=float)
        
        min_areas = np.array([float(c.get('minimum_area', 0.0) or 0.0) for c in crops], dtype=float)
        max_areas = np.array([float(c.get('maximum_area', total_land) or total_land) for c in crops], dtype=float)
        
        # Sort crops by profit per hectare descending
        order = np.argsort(profit_per_ha)[::-1]
        
        remaining_land = total_land
        remaining_water = total_water
        remaining_budget = total_budget
        
        allocated = np.zeros(n_crops)
        
        for idx in order:
            if remaining_land <= 1e-6 or remaining_water <= 1e-6 or remaining_budget <= 1e-6:
                break
            
            # If crop has non-positive profit, skip unless required by min_area
            if profit_per_ha[idx] <= 0 and min_areas[idx] <= 0:
                continue
            
            max_by_land = remaining_land
            max_by_water = remaining_water / max(water_per_ha[idx], 1e-9)
            max_by_budget = remaining_budget / max(cost_per_ha[idx], 1e-9)
            max_by_cap = max_areas[idx]
            
            max_alloc = min(max_by_land, max_by_water, max_by_budget, max_by_cap)
            min_alloc = min_areas[idx]
            
            if max_alloc < min_alloc:
                continue
            
            area = max(0.0, max_alloc)
            allocated[idx] = area
            
            remaining_land -= area
            remaining_water -= water_per_ha[idx] * area
            remaining_budget -= cost_per_ha[idx] * area
        
        execution_time = time.time() - start_time
        
        land_used = float(np.sum(allocated))
        water_used = float(np.dot(water_per_ha, allocated))
        budget_used = float(np.dot(cost_per_ha, allocated))
        total_profit = float(np.dot(profit_per_ha, allocated))
        
        allocations = []
        for i, crop in enumerate(crops):
            area = float(allocated[i])
            if area > 0.001:
                crop_profit = float(profit_per_ha[i] * area)
                allocations.append({
                    'crop_name': crop['crop_name'],
                    'allocated_area_ha': round(area, 4),
                    'profit_per_hectare': round(float(profit_per_ha[i]), 2),
                    'estimated_total_profit': round(crop_profit, 2),
                    'water_consumed_m3': round(float(water_per_ha[i] * area), 2),
                    'cultivation_cost_inr': round(float(cost_per_ha[i] * area), 2),
                    'yield_total': round(float(crop['yield_per_hectare']) * area, 2)
                })
        
        allocations.sort(key=lambda x: x['estimated_total_profit'], reverse=True)
        feasible = is_feasible(
            allocated, water_per_ha, cost_per_ha,
            total_land, total_water, total_budget
        )
        
        return {
            'algorithm': 'Greedy Algorithm',
            'allocations': allocations,
            'estimated_net_profit': round(total_profit, 2),
            'land_used_ha': round(land_used, 4),
            'water_used_m3': round(water_used, 2),
            'budget_used_inr': round(budget_used, 2),
            'land_remaining_ha': round(max(0.0, total_land - land_used), 4),
            'water_remaining_m3': round(max(0.0, total_water - water_used), 2),
            'budget_remaining_inr': round(max(0.0, total_budget - budget_used), 2),
            'land_utilization_pct': round(100.0 * land_used / max(total_land, 1e-9), 2),
            'water_utilization_pct': round(100.0 * water_used / max(total_water, 1e-9), 2),
            'budget_utilization_pct': round(100.0 * budget_used / max(total_budget, 1e-9), 2),
            'is_feasible': feasible,
            'execution_time_seconds': round(execution_time, 6),
            'convergence_history': []
        }
