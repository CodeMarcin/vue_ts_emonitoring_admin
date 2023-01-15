import { APIserver } from "./APIServer";

export const APIFindContractorByNIP = (nip: string, limit: number) => {
  return APIserver.get(`contractors/getContracorByNIP/${nip}/${limit}`);
};