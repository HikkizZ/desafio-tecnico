import axios from 'axios';
import type { Package, PlanResponse, VerifyResponse } from '../types/index.js';

const API_URL = '/logistics';

export async function planLoad(capacity: number, packages: Package[]): Promise<PlanResponse> {
    const { data } = await axios.post<PlanResponse>(`${API_URL}/plan`, { capacity, packages });
    return data;
}

export async function verifyLoad(capacity: number, selected_packages: string[], packages: Package[]): Promise<VerifyResponse> {
    const { data } = await axios.post<VerifyResponse>(`${API_URL}/verify`, { capacity, selected_packages, packages });
    return data;
}