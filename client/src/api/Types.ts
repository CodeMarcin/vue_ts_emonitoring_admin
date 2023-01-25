export interface IContractorsResponse {
  _id: string;
  name: string;
  address: string;
  zipcode: string;
  city: string;
  email: string;
  nip: string;
}

export interface ISettingsCompanyResponse {
  name: string;
  address: string;
  zipcode: string;
  city: string;
  email: string;
  nip: string;
  phoneNumber: string;
  siteAddress: string;
}

export interface ISettingsSiteResponse {
  accountantEmail: string;
  lastInvoiceNumber: number;
  lastInvoiceYear: number;
  placeOfIssue: string;
  accountNumber: string;
  bankName: string;
}


