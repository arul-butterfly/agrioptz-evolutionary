"""Pydantic schemas for AgriOpt API."""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Any, Dict
from enum import Enum


class AlgorithmType(str, Enum):
    genetic = "genetic"
    greedy = "greedy"
    compare = "compare"


class CropData(BaseModel):
    crop_name: str
    yield_per_hectare: float = Field(gt=0, description="Yield in kg or quintals per hectare")
    price_per_unit: float = Field(gt=0, description="Selling price per unit in INR")
    cost_per_hectare: float = Field(gt=0, description="Cultivation cost per hectare in INR")
    water_per_hectare: float = Field(gt=0, description="Water requirement in m3 per hectare")
    season: Optional[str] = None
    category: Optional[str] = None
    minimum_area: Optional[float] = Field(default=0.0, ge=0)
    maximum_area: Optional[float] = Field(default=None)

    @field_validator('crop_name')
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Crop name cannot be empty')
        return v.strip()


class ResourceConstraints(BaseModel):
    total_land_ha: float = Field(gt=0, description="Total available land in hectares")
    total_water_m3: float = Field(gt=0, description="Total available water in cubic meters")
    total_budget_inr: float = Field(gt=0, description="Total cultivation budget in INR")


class GAParameters(BaseModel):
    population_size: int = Field(default=100, ge=10, le=1000)
    generations: int = Field(default=200, ge=10, le=2000)
    crossover_prob: float = Field(default=0.8, ge=0.0, le=1.0)
    mutation_prob: float = Field(default=0.15, ge=0.0, le=1.0)
    tournament_size: int = Field(default=3, ge=2, le=20)
    elitism_count: int = Field(default=2, ge=1, le=20)
    random_seed: Optional[int] = Field(default=42)
    penalty_coefficient: float = Field(default=1e6, gt=0)


class OptimizationRequest(BaseModel):
    crops: List[CropData]
    constraints: ResourceConstraints
    ga_params: Optional[GAParameters] = Field(default_factory=GAParameters)
    algorithm: AlgorithmType = AlgorithmType.genetic


class CompareRequest(BaseModel):
    crops: List[CropData]
    constraints: ResourceConstraints
    ga_params: Optional[GAParameters] = Field(default_factory=GAParameters)
    n_runs: int = Field(default=5, ge=1, le=20)


class ConstraintValidationRequest(BaseModel):
    crops: List[CropData]
    constraints: ResourceConstraints
