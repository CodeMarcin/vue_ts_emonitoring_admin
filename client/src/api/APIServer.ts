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

export interface SettingsAPI {
  _id: string;
  company: SettingsCompanyAPI;
  site: SettingsSiteAPI;
}

export interface SettingsCompanyAPI {
  name: string;
  address: string;
  zipcode: string;
  city: string;
  email: string;
  nip: string;
  phoneNumber: string;
  siteAddress: string;
  accountNumber: string;
  bankName: string;
}

export interface SettingsSiteAPI {
  accountantEmail: string;
  lastInvoiceNumber: string;
  lastInvoiceYear: string;
  placeOfIssue: string;
}

export const APIserver = axios.create({ baseURL: "http://localhost:8000" });
