import _ from "lodash";

declare global {
  const _: typeof _;
  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
  type PromiseVal<T> = ThenArg<ReturnType<T>>;
}
