import { APIserver } from "./APIServer";
import type { InterfaceData } from "./APIServer";
export const APIFindContractorByNIP = (nip: string, limit: number) => {
  return APIserver.get<InterfaceData[]>(`contractors/getContracorByNIP/${nip}/${limit}`);
};
