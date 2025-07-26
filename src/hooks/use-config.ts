type Config = {
  radius: number;
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
  installationType: "cli" | "manual";
};
