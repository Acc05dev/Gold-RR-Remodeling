import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "links/**", "scripts/**", "data/*.generated.ts", "next-env.d.ts"] },
];
export default config;
