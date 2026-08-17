export const COMPANY = {
  name: 'Nexora Technologies',
  shortName: 'Nexora',
  tagline: 'Clarity for every asset. Control for every team.',
  productName: 'Nexora AssetOps',
  emailDomain: 'nexora.io',
  logoFull: '/nexora-mark.svg',
  logoWhite: '/nexora-mark-white.svg',
  developedBy: 'Saiman Hussein Mohamed',
  brandColors: {
    navy: '#0D47A1',
    teal: '#11B5A6',
    orange: '#FF8C00',
  },
} as const;

export const DEPARTMENTS = ['IT','Finance','Operations','Human Resources','Administration','Engineering','Sales','Customer Success'] as const;
export type Department = (typeof DEPARTMENTS)[number];
export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((d) => ({ value: d, label: d }));
