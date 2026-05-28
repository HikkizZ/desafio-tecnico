export interface Package {
    id: string;
    weight: number;
    value: number;
}

export interface PlanRequest {
    capacity: number;
    packages: Package[];
}

export interface PlanResponse {
    selected_packages: string[];
    total_value: number;
    total_weight: number;
}

export interface VerifyRequest {
    capacity: number;
    selected_packages: string[];
    packages: Package[];
}

export interface VerifyResponse {
    optimal: boolean;
    message: string;
    best_possible_value?: number;
}