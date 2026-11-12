"""
Unit tests for AgriOpt optimization algorithms and fitness logic.
"""
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import numpy as np
from app.algorithms.genetic_algorithm import GeneticAlgorithm
from app.algorithms.greedy_algorithm import GreedyAlgorithm
from app.algorithms.fitness import (
    compute_profit_per_hectare,
    evaluate_fitness,
    is_feasible,
    repair_individual
)

SAMPLE_CROPS = [
    {'crop_name': 'Rice', 'yield_per_hectare': 4500, 'price_per_unit': 25, 'cost_per_hectare': 55000, 'water_per_hectare': 12000},
    {'crop_name': 'Wheat', 'yield_per_hectare': 3500, 'price_per_unit': 28, 'cost_per_hectare': 40000, 'water_per_hectare': 5000},
    {'crop_name': 'Maize', 'yield_per_hectare': 5000, 'price_per_unit': 22, 'cost_per_hectare': 35000, 'water_per_hectare': 6000},
    {'crop_name': 'Groundnut', 'yield_per_hectare': 2000, 'price_per_unit': 55, 'cost_per_hectare': 40000, 'water_per_hectare': 4500},
]

CONSTRAINTS = {
    'total_land': 100.0,
    'total_water': 500000.0,
    'total_budget': 5000000.0
}


def test_profit_per_hectare():
    profits = compute_profit_per_hectare(SAMPLE_CROPS)
    assert len(profits) == 4
    # Rice: 4500 * 25 - 55000 = 112500 - 55000 = 57500
    assert abs(profits[0] - 57500.0) < 1.0
    # Wheat: 3500 * 28 - 40000 = 98000 - 40000 = 58000
    assert abs(profits[1] - 58000.0) < 1.0
    # Maize: 5000 * 22 - 35000 = 110000 - 35000 = 75000
    assert abs(profits[2] - 75000.0) < 1.0


def test_is_feasible_and_repair():
    water_per_ha = np.array([c['water_per_hectare'] for c in SAMPLE_CROPS], dtype=float)
    cost_per_ha = np.array([c['cost_per_hectare'] for c in SAMPLE_CROPS], dtype=float)
    
    # Clearly infeasible: 100 ha of each (total 400 ha > 100 ha)
    infeasible = np.array([100.0, 100.0, 100.0, 100.0])
    assert not is_feasible(infeasible, water_per_ha, cost_per_ha, 100.0, 500000.0, 5000000.0)
    
    # Repair
    repaired = repair_individual(infeasible, water_per_ha, cost_per_ha, 100.0, 500000.0, 5000000.0)
    assert is_feasible(repaired, water_per_ha, cost_per_ha, 100.0, 500000.0, 5000000.0)
    assert np.all(repaired >= 0)
    assert np.sum(repaired) <= 100.0 + 1e-4


def test_genetic_algorithm_execution():
    ga = GeneticAlgorithm(
        population_size=30,
        generations=25,
        crossover_prob=0.8,
        mutation_prob=0.15,
        random_seed=42
    )
    result = ga.run(
        SAMPLE_CROPS,
        CONSTRAINTS['total_land'],
        CONSTRAINTS['total_water'],
        CONSTRAINTS['total_budget']
    )
    
    assert result['algorithm'] == 'Genetic Algorithm'
    assert result['is_feasible'] == True
    assert result['estimated_net_profit'] > 0
    assert result['land_used_ha'] <= CONSTRAINTS['total_land'] + 0.01
    assert result['water_used_m3'] <= CONSTRAINTS['total_water'] + 0.01
    assert result['budget_used_inr'] <= CONSTRAINTS['total_budget'] + 0.01
    assert len(result['convergence_history']) == 25
    assert len(result['allocations']) > 0


def test_greedy_algorithm_execution():
    greedy = GreedyAlgorithm()
    result = greedy.run(
        SAMPLE_CROPS,
        CONSTRAINTS['total_land'],
        CONSTRAINTS['total_water'],
        CONSTRAINTS['total_budget']
    )
    
    assert result['algorithm'] == 'Greedy Algorithm'
    assert result['is_feasible'] == True
    assert result['estimated_net_profit'] > 0
    assert result['land_used_ha'] <= CONSTRAINTS['total_land'] + 0.01
    assert result['water_used_m3'] <= CONSTRAINTS['total_water'] + 0.01
    assert result['budget_used_inr'] <= CONSTRAINTS['total_budget'] + 0.01
    assert len(result['allocations']) > 0


def run_all_tests():
    test_profit_per_hectare()
    print("[PASS] test_profit_per_hectare")
    test_is_feasible_and_repair()
    print("[PASS] test_is_feasible_and_repair")
    test_genetic_algorithm_execution()
    print("[PASS] test_genetic_algorithm_execution")
    test_greedy_algorithm_execution()
    print("[PASS] test_greedy_algorithm_execution")
    print("\nAll algorithm tests passed successfully!")


if __name__ == "__main__":
    run_all_tests()
