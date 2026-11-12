"""
Genetic Algorithm for AgriOpt Crop Planning Optimizer.

Implements a real Genetic Algorithm with:
- Population initialization
- Fitness evaluation
- Tournament selection
- Arithmetic crossover
- Gaussian mutation
- Elitism preservation
- Constraint repair for strict feasibility
- Convergence tracking across generations
"""
import numpy as np
import time
from typing import List, Dict, Any, Optional, Tuple
from .fitness import (
    compute_profit_per_hectare,
    evaluate_fitness,
    is_feasible,
    repair_individual
)


class GeneticAlgorithm:
    """
    Genetic Algorithm for crop area allocation optimization.
    
    Maximizes: Z(X) = sum(profit_i * x_i)
    Subject to:
        sum(x_i) <= total_land
        sum(water_i * x_i) <= total_water
        sum(cost_i * x_i) <= total_budget
        x_i >= 0
    """
    
    def __init__(
        self,
        population_size: int = 100,
        generations: int = 200,
        crossover_prob: float = 0.8,
        mutation_prob: float = 0.15,
        tournament_size: int = 3,
        elitism_count: int = 2,
        penalty_coefficient: float = 1e6,
        random_seed: Optional[int] = 42
    ):
        self.population_size = max(10, population_size)
        self.generations = max(5, generations)
        self.crossover_prob = crossover_prob
        self.mutation_prob = mutation_prob
        self.tournament_size = max(2, min(tournament_size, self.population_size))
        self.elitism_count = max(1, min(elitism_count, self.population_size // 2))
        self.penalty_coefficient = penalty_coefficient
        self.random_seed = random_seed
        
        if random_seed is not None:
            np.random.seed(random_seed)
    
    def _initialize_population(
        self,
        n_crops: int,
        total_land: float,
        water_per_ha: np.ndarray,
        cost_per_ha: np.ndarray,
        total_water: float,
        total_budget: float,
        min_areas: np.ndarray,
        max_areas: np.ndarray
    ) -> np.ndarray:
        """Initialize population with feasible individuals using varied allocation strategies."""
        population = np.zeros((self.population_size, n_crops))
        
        for i in range(self.population_size):
            if i == 0:
                # Equal distribution
                equal = total_land / n_crops
                ind = np.full(n_crops, equal)
            elif i < n_crops:
                # Single crop dominant
                ind = np.zeros(n_crops)
                ind[i % n_crops] = total_land
            else:
                # Dirichlet random distribution
                alpha = np.random.exponential(scale=1.0, size=n_crops)
                alpha = np.maximum(alpha, 1e-6)
                proportions = np.random.dirichlet(alpha)
                fraction = np.random.uniform(0.3, 1.0)
                ind = proportions * total_land * fraction
            
            ind = repair_individual(
                ind, water_per_ha, cost_per_ha,
                total_land, total_water, total_budget,
                min_areas, max_areas
            )
            population[i] = ind
        
        return population
    
    def _evaluate_population(
        self,
        population: np.ndarray,
        profit_per_ha: np.ndarray,
        water_per_ha: np.ndarray,
        cost_per_ha: np.ndarray,
        total_land: float,
        total_water: float,
        total_budget: float
    ) -> np.ndarray:
        """Evaluate fitness for all individuals in population."""
        fitness = np.zeros(len(population))
        for i, ind in enumerate(population):
            fitness[i] = evaluate_fitness(
                ind, profit_per_ha, water_per_ha, cost_per_ha,
                total_land, total_water, total_budget,
                self.penalty_coefficient
            )
        return fitness
    
    def _tournament_selection(self, fitness: np.ndarray) -> int:
        """Select one individual via tournament selection."""
        candidates = np.random.choice(len(fitness), size=self.tournament_size, replace=False)
        best_idx = candidates[np.argmax(fitness[candidates])]
        return int(best_idx)
    
    def _arithmetic_crossover(
        self,
        parent1: np.ndarray,
        parent2: np.ndarray
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Arithmetic blend crossover."""
        alpha = np.random.uniform(0.1, 0.9)
        child1 = alpha * parent1 + (1.0 - alpha) * parent2
        child2 = (1.0 - alpha) * parent1 + alpha * parent2
        return child1, child2
    
    def _gaussian_mutation(
        self,
        individual: np.ndarray,
        total_land: float
    ) -> np.ndarray:
        """Gaussian mutation with 5% land scale step size."""
        mutant = individual.copy()
        sigma = max(0.5, total_land * 0.05)
        
        for i in range(len(mutant)):
            if np.random.random() < self.mutation_prob:
                mutant[i] += np.random.normal(0, sigma)
                mutant[i] = max(0.0, mutant[i])
        
        return mutant
    
    def run(
        self,
        crops: List[Dict[str, Any]],
        total_land: float,
        total_water: float,
        total_budget: float
    ) -> Dict[str, Any]:
        """Run the complete Genetic Algorithm optimization."""
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
        
        if float(np.sum(min_areas)) > total_land:
            raise ValueError(
                f"Sum of minimum areas ({np.sum(min_areas):.2f} ha) exceeds total available land ({total_land:.2f} ha)."
            )
        
        # Initialize
        population = self._initialize_population(
            n_crops, total_land, water_per_ha, cost_per_ha,
            total_water, total_budget, min_areas, max_areas
        )
        
        fitness = self._evaluate_population(
            population, profit_per_ha, water_per_ha, cost_per_ha,
            total_land, total_water, total_budget
        )
        
        convergence_history = []
        best_fitness_overall = -np.inf
        best_individual_overall = population[0].copy()
        
        for gen in range(self.generations):
            sorted_indices = np.argsort(fitness)[::-1]
            
            curr_best_idx = sorted_indices[0]
            curr_best_fit = fitness[curr_best_idx]
            
            if curr_best_fit > best_fitness_overall:
                best_fitness_overall = curr_best_fit
                best_individual_overall = population[curr_best_idx].copy()
            
            convergence_history.append({
                'generation': gen + 1,
                'best_fitness': round(float(best_fitness_overall), 2),
                'mean_fitness': round(float(np.mean(fitness)), 2),
                'worst_fitness': round(float(np.min(fitness)), 2)
            })
            
            # Form next generation with elitism
            new_population = np.zeros_like(population)
            for e in range(self.elitism_count):
                new_population[e] = population[sorted_indices[e]].copy()
            
            idx = self.elitism_count
            while idx < self.population_size:
                p1_idx = self._tournament_selection(fitness)
                p2_idx = self._tournament_selection(fitness)
                parent1 = population[p1_idx]
                parent2 = population[p2_idx]
                
                if np.random.random() < self.crossover_prob:
                    c1, c2 = self._arithmetic_crossover(parent1, parent2)
                else:
                    c1, c2 = parent1.copy(), parent2.copy()
                
                c1 = self._gaussian_mutation(c1, total_land)
                c2 = self._gaussian_mutation(c2, total_land)
                
                c1 = repair_individual(
                    c1, water_per_ha, cost_per_ha,
                    total_land, total_water, total_budget,
                    min_areas, max_areas
                )
                c2 = repair_individual(
                    c2, water_per_ha, cost_per_ha,
                    total_land, total_water, total_budget,
                    min_areas, max_areas
                )
                
                if idx < self.population_size:
                    new_population[idx] = c1
                    idx += 1
                if idx < self.population_size:
                    new_population[idx] = c2
                    idx += 1
            
            population = new_population
            fitness = self._evaluate_population(
                population, profit_per_ha, water_per_ha, cost_per_ha,
                total_land, total_water, total_budget
            )
        
        # Final best individual
        sorted_indices = np.argsort(fitness)[::-1]
        if fitness[sorted_indices[0]] > best_fitness_overall:
            best_individual_overall = population[sorted_indices[0]].copy()
        
        best_individual_overall = repair_individual(
            best_individual_overall, water_per_ha, cost_per_ha,
            total_land, total_water, total_budget, min_areas, max_areas
        )
        
        execution_time = time.time() - start_time
        
        land_used = float(np.sum(best_individual_overall))
        water_used = float(np.dot(water_per_ha, best_individual_overall))
        budget_used = float(np.dot(cost_per_ha, best_individual_overall))
        total_profit = float(np.dot(profit_per_ha, best_individual_overall))
        
        allocations = []
        for i, crop in enumerate(crops):
            area = float(best_individual_overall[i])
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
            best_individual_overall, water_per_ha, cost_per_ha,
            total_land, total_water, total_budget
        )
        
        return {
            'algorithm': 'Genetic Algorithm',
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
            'convergence_history': convergence_history,
            'execution_time_seconds': round(execution_time, 4),
            'parameters': {
                'population_size': self.population_size,
                'generations': self.generations,
                'crossover_prob': self.crossover_prob,
                'mutation_prob': self.mutation_prob,
                'tournament_size': self.tournament_size,
                'elitism_count': self.elitism_count,
                'random_seed': self.random_seed
            }
        }
