export interface PersonResult {
    id: string;
    name: string;
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
    econ: number;
    soc: number;
    identity?: string;
}

export interface ResultsVisualizationProps {
    data: PersonResult[];
}

export type TraitKey = 'O' | 'C' | 'E' | 'A' | 'N';
export type AxisKey = TraitKey | 'econ' | 'soc';
