export interface Package {
    id: string;
    weight: number;
    value: number;
}

export interface PlanResponse {
    selected_packages: string[];
    total_value: number;
    total_weight: number;
}