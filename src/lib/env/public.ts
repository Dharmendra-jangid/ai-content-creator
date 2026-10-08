import { getAppUrl } from "@/lib/env/app-url";

export function getPublicEnv() {
  return {
    appUrl: getAppUrl(),
  };
}
