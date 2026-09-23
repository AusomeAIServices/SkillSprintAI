export const LOCAL_DEMO_USER_ID = "local-demo-learner";

export function demoModeEnabled() {
  return process.env.NODE_ENV === "development" && process.env.SKILLSPRINT_LOCAL_DEMO === "true";
}
