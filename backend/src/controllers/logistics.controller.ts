import type { Request, Response, NextFunction } from 'express';
import { knapsack } from '../services/knapsack.service.js';
import type { PlanRequest, PlanResponse, VerifyRequest, VerifyResponse } from '../types/index.js';

export function plan(req: Request, res: Response, next: NextFunction): void {
    try {
        const { capacity, packages }: PlanRequest = req.body;
        if (!capacity || !packages || !Array.isArray(packages)) {
            res.status(400).json({ error: 'Bad Request', message: 'capacity y packages son requeridos' });
            return;
        }

        const selected = knapsack(packages, capacity);

        const response: PlanResponse = {
            selected_packages: selected.map(p => p.id),
            total_value: selected.reduce((sum, p) => sum + p.value, 0),
            total_weight: selected.reduce((sum, p) => sum + p.weight, 0),
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

export function verify(req: Request, res: Response, next: NextFunction): void {
    try {
        const { capacity, selected_packages, packages }: VerifyRequest = req.body;

        if (!capacity || !selected_packages || !packages) {
            res.status(400).json({ error: 'Bad Request', message: 'capacity, selected_packages y packages son requeridos' });
            return;
        }

        const optimal = knapsack(packages, capacity);
        const optimalValue = optimal.reduce((sum, p) => sum + p.value, 0);

        const selectedPkgs = packages.filter(p => selected_packages.includes(p.id));
        const selectedValue = selectedPkgs.reduce((sum, p) => sum + p.value, 0);

        const response: VerifyResponse = selectedValue === optimalValue
            ? { optimal: true, message: 'La selección es óptima' }
            : { optimal: false, best_possible_value: optimalValue, message: 'Existe una combinación mejor posible' };
        
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}