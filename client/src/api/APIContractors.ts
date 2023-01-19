import { APIserver } from "./APIServer";
import type { ContractorsInterfaceAPI } from "./APIServer";

export const APIFindContractorByNIP = (nip: string, limit: number) => {
  return APIserver.get<ContractorsInterfaceAPI[]>(`contractors/getContracorByNIP/${nip}/${limit}`);
};

export const APIGetAllContractorsBySort = (sortBy: string, sortType: string, limit: number) => {
  return APIserver.get<ContractorsInterfaceAPI[]>(`contractors/getAllContractors/${sortBy}/${sortType}/${limit}`);
};

export const APIAddContractor = (contractor: ContractorsInterfaceAPI) => {
  return APIserver.post("/contractors/addContractor", contractor);
};

export const APIDeleteContractorByNIP = (id: string, deleteAllInvoices: boolean) => {
  return APIserver.delete(`/contractors/delteContractorByID/${id}/${deleteAllInvoices}`);
};
