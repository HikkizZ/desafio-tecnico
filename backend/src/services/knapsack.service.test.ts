import { describe, expect, it } from 'vitest';
import type { Package } from '../types/index.js';
import { knapsack } from './knapsack.service.js';

function totalValue(packages: Package[]): number {
    return packages.reduce((sum, pkg) => sum + pkg.value, 0);
}

function totalWeight(packages: Package[]): number {
    return packages.reduce((sum, pkg) => sum + pkg.weight, 0);
}

describe('knapsack', () => {
    it('retorna una lista vacía cuando la capacidad es 0', () => {
        const packages: Package[] = [
            { id: 'A', weight: 1, value: 10 },
            { id: 'B', weight: 2, value: 20 },
        ];

        expect(knapsack(packages, 0)).toEqual([]);
    });

    it('incluye un paquete que cabe en la capacidad', () => {
        const packages: Package[] = [{ id: 'A', weight: 3, value: 5 }];

        expect(knapsack(packages, 5)).toEqual([packages[0]]);
    });

    it('excluye un paquete que no cabe en la capacidad', () => {
        const packages: Package[] = [{ id: 'A', weight: 10, value: 5 }];

        expect(knapsack(packages, 5)).toEqual([]);
    });

    it('encuentra la combinación óptima con múltiples paquetes', () => {
        const packages: Package[] = [
            { id: 'A', weight: 1, value: 1 },
            { id: 'B', weight: 3, value: 4 },
            { id: 'C', weight: 4, value: 5 },
            { id: 'D', weight: 5, value: 7 },
        ];

        const result = knapsack(packages, 7);

        expect(result.map((pkg) => pkg.id).sort()).toEqual(['B', 'C']);
        expect(totalValue(result)).toBe(9);
        expect(totalWeight(result)).toBe(7);
    });
});
