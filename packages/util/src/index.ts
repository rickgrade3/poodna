require("dotenv").config();
import bcrypt from "bcryptjs";
export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

const encryptPassword = async (password: string) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = async (dbPassword: string, password: string) =>
  bcrypt.compareSync(password, dbPassword);

const wait = async (intv: number) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, intv);
  });
};
const batch = (cb: () => void, intv?: number) => {
  let bd = false;
  const ge = async () => {
    if (bd) {
      return;
    }
    bd = true;
    try {
      await cb();
    } catch (error) {}
    await wait(intv || 1000);
    bd = false;
  };
  setInterval(ge, 1000);
};
export const utils = {
  wait,
  batch,
  encryptPassword,
  comparePassword,
};
