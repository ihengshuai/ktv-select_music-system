import path from "path";
import process from "process";

export const rootDir = process.cwd();

export const resolvePath = (p = "") => path.resolve(rootDir, p);
