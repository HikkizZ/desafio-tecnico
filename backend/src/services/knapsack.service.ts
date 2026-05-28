import type { Package } from '../types/index.js';

export function knapsack(packages: Package[], capacity: number): Package[] {
    const n = packages.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    /* Valor máximo que se puede obtener con i paquetes y capacidad w */
    for (let i = 1; i <= n; i++) {
        const pkg = packages[i - 1]!;
        for (let w = 0; w <= capacity; w++) {
            dp[i]![w] = dp[i - 1]![w]!;
            if (pkg.weight <= w) {
                dp[i]![w] = Math.max(dp[i]![w]!, dp[i - 1]![w - pkg.weight]! + pkg.value);
            }
        }
    }

    const selected: Package[] = [];
    let w = capacity;

    /* Recorre la tabla para encontrar los paquetes seleccionados */
    for (let i = n; i > 0; i--) {
        if (dp[i]![w] !== dp[i - 1]![w]) {
            selected.push(packages[i - 1]!);
            w -= packages[i - 1]!.weight;
        }
    }
    return selected;
}