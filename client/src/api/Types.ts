export interface IContractorsResponse {
  id?: string;
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

export interface ISettingsInvoiceResponse {
  invoiceNumber: number;
  invoiceYear: number;
  placeOfIssue: string;
}

export interface ISettingsSiteResponse {
  accountantEmail: string;
  mailHost: string;
  mailPort: number;
  mailUser: string;
  mailPassword: string;
}

export interface ISettingsPaymentAPI {
  accountNumber: string;
  bankName: string;
}

export type TItemStandard = "piece" | "meter";

export interface IContractor {
  selectedId: string;
  name: string;
  address: string;
  zipcode: string;
  city: string;
  nip: string;
  email: string;
}

export interface ICompany {
  name: string;
  address: string;
  zipcode: string;
  city: string;
  nip: string;
  email: string;
  phoneNumber: string;
  siteAddress: string;
}

export interface IInvoiceSettings {
  invoiceNumber: number;
  invoiceYear: number;
  placeOfIssue: string;
  dateOfIssue: string;
}

export interface IPaymentSettings {
  paymentMethod: "transfer" | "cash";
  accountNumber: string;
  bankName: string;
  daysOfPayment: number;
  dateOfPayment: string;
}

export interface IItem {
  name: string;
  price: number;
  quantity: number;
  standard: TItemStandard;
  totalPrice: number;
}

export interface IInvoicesResponse {
  id?: string;
  contractor: IContractor;
  company: ICompany;
  invoiceSettings: IInvoiceSettings;
  paymentSettings: IPaymentSettings;
  items: IItem[];
  totalItemsValue: number;
}
