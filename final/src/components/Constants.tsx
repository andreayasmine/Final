export type LabelClass = {
    name: string;
    color: string;
};

export const labelsClasses: readonly LabelClass[] = [
    { name: 'Red Event', color: 'hsl(0, 75%, 60%)' },
    { name: 'Blue Event', color: 'hsl(200, 80%, 50%)' },
    { name: 'Green Event', color: 'hsl(150, 80%, 30%)' },
] as const;
