import type { AxisKey, PersonResult } from './types';

const AXIS_KEYS: AxisKey[] = ['O', 'C', 'E', 'A', 'N', 'econ', 'soc'];

export type IdentityGroupAverage = { identity: string; n: number } & Record<AxisKey, number>;

export function groupByIdentity(data: PersonResult[]): Record<string, PersonResult[]> {
    const groups: Record<string, PersonResult[]> = {};

    data.forEach((person) => {
        if (person.identity === undefined) return;
        (groups[person.identity] ??= []).push(person);
    });

    return groups;
}

export function identityGroupAverages(data: PersonResult[]): IdentityGroupAverage[] {
    const groups = groupByIdentity(data);

    return Object.keys(groups)
        .sort()
        .map((identity) => {
            const members = groups[identity];
            const row = { identity, n: members.length } as IdentityGroupAverage;

            AXIS_KEYS.forEach((axis) => {
                row[axis] = Math.round((members.reduce((sum, p) => sum + p[axis], 0) / members.length) * 10) / 10;
            });

            return row;
        });
}
