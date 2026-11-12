"""Optimization service layer for AgriOpt."""
import uuid
import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..algorithms.genetic_algorithm import GeneticAlgorithm
from ..algorithms.greedy_algorithm import GreedyAlgorithm
from ..models.schemas import CropData, ResourceConstraints, GAParameters

_optimization_history: List[Dict[str, Any]] = []


def run_genetic_algorithm(
    crops: List[CropData],
    constraints: ResourceConstraints,
    ga_params: GAParameters
) -> Dict[str, Any]:
    """Run GA optimization and store result."""
    crops_dict = [c.model_dump() for c in crops]
    
    ga = GeneticAlgorithm(
        population_size=ga_params.population_size,
        generations=ga_params.generations,
        crossover_prob=ga_params.crossover_prob,
        mutation_prob=ga_params.mutation_prob,
        tournament_size=ga_params.tournament_size,
        elitism_count=ga_params.elitism_count,
        penalty_coefficient=ga_params.penalty_coefficient,
        random_seed=ga_params.random_seed
    )
    
    result = ga.run(
        crops_dict,
        constraints.total_land_ha,
        constraints.total_water_m3,
        constraints.total_budget_inr
    )
    
    opt_id = str(uuid.uuid4())
    history_entry = {
        'id': opt_id,
        'timestamp': datetime.now().isoformat(),
        'algorithm': 'Genetic Algorithm',
        'n_crops': len(crops),
        'constraints': constraints.model_dump(),
        'result': result
    }
    _optimization_history.append(history_entry)
    
    return {'id': opt_id, **result}


def run_greedy_algorithm(
    crops: List[CropData],
    constraints: ResourceConstraints
) -> Dict[str, Any]:
    """Run Greedy baseline optimization and store result."""
    crops_dict = [c.model_dump() for c in crops]
    
    greedy = GreedyAlgorithm()
    result = greedy.run(
        crops_dict,
        constraints.total_land_ha,
        constraints.total_water_m3,
        constraints.total_budget_inr
    )
    
    opt_id = str(uuid.uuid4())
    history_entry = {
        'id': opt_id,
        'timestamp': datetime.now().isoformat(),
        'algorithm': 'Greedy Algorithm',
        'n_crops': len(crops),
        'constraints': constraints.model_dump(),
        'result': result
    }
    _optimization_history.append(history_entry)
    
    return {'id': opt_id, **result}


def run_comparison(
    crops: List[CropData],
    constraints: ResourceConstraints,
    ga_params: GAParameters,
    n_runs: int = 5
) -> Dict[str, Any]:
    """
    Run GA across multiple random seeds and compare against Greedy baseline.
    Computes rigorous experimental metrics.
    """
    crops_dict = [c.model_dump() for c in crops]
    greedy = GreedyAlgorithm()
    
    # Run greedy once
    greedy_result = greedy.run(
        crops_dict,
        constraints.total_land_ha,
        constraints.total_water_m3,
        constraints.total_budget_inr
    )
    
    # Run GA across multiple seeds
    ga_results = []
    base_seed = ga_params.random_seed if ga_params.random_seed is not None else 42
    seeds = [base_seed + i * 17 for i in range(n_runs)]
    
    for s in seeds:
        ga = GeneticAlgorithm(
            population_size=ga_params.population_size,
            generations=ga_params.generations,
            crossover_prob=ga_params.crossover_prob,
            mutation_prob=ga_params.mutation_prob,
            tournament_size=ga_params.tournament_size,
            elitism_count=ga_params.elitism_count,
            penalty_coefficient=ga_params.penalty_coefficient,
            random_seed=s
        )
        r = ga.run(
            crops_dict,
            constraints.total_land_ha,
            constraints.total_water_m3,
            constraints.total_budget_inr
        )
        ga_results.append(r)
    
    ga_profits = [r['estimated_net_profit'] for r in ga_results]
    ga_feasible = [r['is_feasible'] for r in ga_results]
    
    best_idx = int(np.argmax(ga_profits))
    best_ga_result = ga_results[best_idx]
    
    greedy_profit = greedy_result['estimated_net_profit']
    best_ga_profit = best_ga_result['estimated_net_profit']
    
    if abs(greedy_profit) < 1e-6:
        profit_improvement = 0.0 if best_ga_profit == 0 else 100.0
    else:
        profit_improvement = ((best_ga_profit - greedy_profit) / abs(greedy_profit)) * 100.0
    
    comparison = {
        'greedy': greedy_result,
        'genetic_best': best_ga_result,
        'genetic_all_runs': ga_results,
        'statistics': {
            'n_runs': n_runs,
            'seeds_used': seeds,
            'mean_profit': round(float(np.mean(ga_profits)), 2),
            'best_profit': round(float(np.max(ga_profits)), 2),
            'worst_profit': round(float(np.min(ga_profits)), 2),
            'std_profit': round(float(np.std(ga_profits)), 2),
            'feasibility_rate': round(100.0 * sum(ga_feasible) / max(1, len(ga_feasible)), 1),
            'profit_improvement_pct': round(profit_improvement, 2)
        }
    }
    
    opt_id = str(uuid.uuid4())
    history_entry = {
        'id': opt_id,
        'timestamp': datetime.now().isoformat(),
        'algorithm': 'Comparison',
        'n_crops': len(crops),
        'constraints': constraints.model_dump(),
        'result': comparison
    }
    _optimization_history.append(history_entry)
    
    return {'id': opt_id, **comparison}


def get_history() -> List[Dict[str, Any]]:
    """Return list of past optimization runs."""
    summary = []
    for entry in reversed(_optimization_history):
        s = {
            'id': entry['id'],
            'timestamp': entry['timestamp'],
            'algorithm': entry['algorithm'],
            'n_crops': entry['n_crops'],
            'constraints': entry['constraints']
        }
        res = entry.get('result', {})
        if 'estimated_net_profit' in res:
            s['estimated_net_profit'] = res['estimated_net_profit']
            s['land_utilization_pct'] = res.get('land_utilization_pct', 0)
            s['water_utilization_pct'] = res.get('water_utilization_pct', 0)
            s['budget_utilization_pct'] = res.get('budget_utilization_pct', 0)
            s['is_feasible'] = res.get('is_feasible', True)
        elif 'genetic_best' in res:
            s['estimated_net_profit'] = res['genetic_best']['estimated_net_profit']
            s['land_utilization_pct'] = res['genetic_best'].get('land_utilization_pct', 0)
            s['water_utilization_pct'] = res['genetic_best'].get('water_utilization_pct', 0)
            s['budget_utilization_pct'] = res['genetic_best'].get('budget_utilization_pct', 0)
            s['is_feasible'] = res['genetic_best'].get('is_feasible', True)
            s['profit_improvement_pct'] = res.get('statistics', {}).get('profit_improvement_pct', 0)
        summary.append(s)
    return summary


def get_optimization_by_id(opt_id: str) -> Optional[Dict[str, Any]]:
    """Find optimization entry by ID."""
    for entry in _optimization_history:
        if entry['id'] == opt_id:
            return entry
    return None
