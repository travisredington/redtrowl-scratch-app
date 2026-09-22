import type { AxisKey, TraitKey } from './types';

export interface AxisMeta {
    key: AxisKey;
    label: string;
    min: number;
    max: number;
    diverging: boolean;
    negPole?: string;
    posPole?: string;
    negPoleShort?: string;
    posPoleShort?: string;
}

export const TRAITS: (AxisMeta & { key: TraitKey })[] = [
    { key: 'O', label: 'Openness', min: 0, max: 100, diverging: false },
    { key: 'C', label: 'Conscientiousness', min: 0, max: 100, diverging: false },
    { key: 'E', label: 'Extraversion', min: 0, max: 100, diverging: false },
    { key: 'A', label: 'Agreeableness', min: 0, max: 100, diverging: false },
    { key: 'N', label: 'Neuroticism', min: 0, max: 100, diverging: false },
];

export const POLITICAL_AXES: AxisMeta[] = [
    {
        key: 'econ',
        label: 'Economic (Left–Right)',
        min: -10,
        max: 10,
        diverging: true,
        negPole: 'Left',
        posPole: 'Right',
        negPoleShort: 'L',
        posPoleShort: 'R',
    },
    {
        key: 'soc',
        label: 'Social (Libertarian–Authoritarian)',
        min: -10,
        max: 10,
        diverging: true,
        negPole: 'Libertarian',
        posPole: 'Authoritarian',
        negPoleShort: 'Lib',
        posPoleShort: 'Auth',
    },
];

export const ALL_AXES: AxisMeta[] = [...TRAITS, ...POLITICAL_AXES];
