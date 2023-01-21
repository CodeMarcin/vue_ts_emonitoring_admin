import { APIserver } from "./APIServer";
import type { SettingsAPI } from "./APIServer";

export const getSettingsAPI = () => {
  return APIserver.get<SettingsAPI>(`settings/getSettings`);
};
