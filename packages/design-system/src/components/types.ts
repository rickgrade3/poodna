export interface TimerPolicy {
  unit: "seconds";
  maximum: number;
  danger: number;
  warning: number;
}

export enum ThemeEnum {
  LIGHT = "LIGHT",
  DARK = "DARK",
}
export type Theme = keyof typeof ThemeEnum;
