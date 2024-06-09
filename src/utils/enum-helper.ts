export class EnumHelper {
  static createObjectEnum<T extends string>(arr: readonly [...T[]]) {
    return arr.reduce((obj, item) => ((obj[item] = item), obj), {} as { [K in T]: K });
  }

  static createEnumFromObjectArray<T extends ReadonlyArray<{ [key: string]: any }>, K extends keyof T[number]>(arr: T, key: K): { [P in T[number][K]]: P } {
    return arr.reduce((acc, item) => {
      const enumKey = item[key as keyof typeof item] as unknown as T[number][K];
      acc[enumKey] = enumKey;
      return acc;
    }, {}) as { [P in T[number][K]]: P };
  }
}

export type ExtractEnumValues<T extends Record<string, unknown>> = T[keyof T];
