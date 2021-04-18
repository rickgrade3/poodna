import React, { useState } from "react";
export enum BoilerPlateSizeEnum {
  auto = "auto",
  xl2 = "xl2",
  xl = "xl",
  lg = "lg",
  md = "md",
  sm = "sm",
}
export type BoilerPlateSize = keyof typeof BoilerPlateSizeEnum;
export interface BoilerPlateProps {
  size?: BoilerPlateSizeEnum;
}

export default (p: BoilerPlateProps) => {
  return <div></div>;
};
