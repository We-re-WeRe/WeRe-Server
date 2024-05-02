export const TARGET_TYPES = {
  STORAGE: 'storage',
  REVIEW: 'review',
  WEBTOON: 'webtoon',
} as const;
export type TargetTypes = (typeof TARGET_TYPES)[keyof typeof TARGET_TYPES];
