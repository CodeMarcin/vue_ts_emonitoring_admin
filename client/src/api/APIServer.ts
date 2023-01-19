import axios from "axios";

export interface ContractorsInterfaceAPI {
  _id: string;
  name: string;
  address: string;
  zipcode: string;
  city: string;
  email: string;
  nip: string;
}

export const APIserver = axios.create({ baseURL: "http://localhost:8000" });
