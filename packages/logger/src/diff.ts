import logDiff from 'jest-diff';

const DIFF_OPTIONS = {
  aAnnotation: 'Expected',
  bAnnotation: 'Result'
};

export function diff<T>(expected: T, result: T): string | null {
  return logDiff(expected, result, DIFF_OPTIONS);
}
