<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { useToastStore } from "@/stores/ToastStore";
import { useCreateItemValue } from "@/use/useCreateItemValue";
import { useFirstLetterUppercase } from "@/use/useFirstLetterUppercase";
import { usePriceToWords } from "@/use/usePriceToWords";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

import {
  BUYER,
  DATE_OF_ISSUE,
  INVOICE,
  NIP,
  NUMBER,
  PAYMENT,
  PAYMENT_METHOD,
  PLACE_OF_ISSUE,
  SELLER,
  DATE_OF_PAYMENT,
  ACCOUNT_NUMBER,
  BANK_NAME,
  TRANSFER,
  CASH,
  STANDARD,
  QUANTITY,
  PRICE,
  TOTAL_PRICE,
  NAME,
  LP,
  AMOUN_DUE_IN_WORDS,
  TOTAL,
  INVOICE_BOTTOM_TEXT,
  ADDRES_START,
  MAILS_SEND,
} from "@/data/labels/LabelsGlobal";
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

export interface IInvoiceFinallState {
  contractor: IContractor;
  company: ICompany;
  invoiceSettings: IInvoiceSettings;
  paymentSettings: IPaymentSettings;
  items: IItem[];
  totalItemsValue: number;
  hidden?: boolean;
  render?: boolean | Object;
  sendMails?: boolean | Object;
  mailData?: any;
}

const renderHook = ref();
const toastStore = useToastStore();

const emit = defineEmits(["renderEnd", "sendEnd"]);

const emitRenderEnd = () => {
  emit("renderEnd");
};

const emitSendEnd = () => {
  emit("sendEnd");
};

defineExpose({ renderHook });

const getPaymentMethod = computed(() => {
  return props.paymentSettings.paymentMethod === "transfer" ? TRANSFER : CASH;
});

const isHidden = computed(() => {
  return props.hidden ? "absolute top-[10000000%] " : "";
});

const props = withDefaults(defineProps<IInvoiceFinallState>(), {
  render: false,
  hidden: false,
  sendMails: false,
  mailData: false,
});

const pdfOpertaion = async (type: "save" | "send") => {
  try {
    const data = await html2canvas(renderHook.value, { scale: 3 });
    const pdf = new jsPDF("portrait", "pt", "a4");
    const img = data.toDataURL("image/png");
    const imgProperties = pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight, "SLOW", "SLOW");
    if (type === "save") {
      pdf.save(`${INVOICE}_${props.invoiceSettings.invoiceNumber}_${props.invoiceSettings.invoiceYear}.pdf`);
      emitRenderEnd();
    } else if (type === "send") {
      const formData = new FormData();
      formData.append("file", pdf.output("blob"));
      const sendFile = await axios.post(import.meta.env.VITE_API_SEND_FILE, formData);
      if (sendFile.data) {
        const sendMail = await axios.post(import.meta.env.VITE_API_SEND_MAIL, props.mailData);
        if (sendMail.data) {
          toastStore.setToast("success", MAILS_SEND, true, "ri-mail-send-line");
          toastStore.showToastAction();
        }
      }
      emitSendEnd();
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toastStore.setToast("error", error.message, false);
      toastStore.showToastAction();
    } else {
      console.error(error);
    }
  }
};

watchEffect(() => {
  if (props.render) pdfOpertaion("save");
  if (props.sendMails) pdfOpertaion("send");
});
</script>
<template>
  <div :class="isHidden">
    <div ref="renderHook" class="invoice-render render-hook">
      <div class="invoice-pdf">
        <div class="invoice-pdf__top">
          <div className="invoice-pdf__top-logo">
            <img class="logo-image" src="../../../assets/images/logo.png" />
            <span class="logo-text">E-MONITORING-24</span>
          </div>
          <div class="invoice-pdf__top-text-section">
            <div class="top-text-section__section top-text-section__section--border-bottom">
              <div class="top-text-section__section-sub">
                <div class="section-sub-column">
                  <span class="font-extrabold">{{ SELLER }}</span>
                </div>
                <div class="section-sub-column">
                  <div class="row">
                    <span class="font-bold">{{ props.company.name }}</span>
                  </div>
                  <div class="row">
                    <span class="font-semibold">{{ ADDRES_START }} {{ props.company.address }}</span>
                  </div>
                  <div class="row">
                    <span class="font-semibold"> {{ props.company.zipcode }} {{ props.company.city }} </span>
                  </div>
                  <div class="row">
                    <div>
                      <span class="font-bold">{{ NIP }}: </span>
                      <span class="font-semibold">{{ props.company.nip }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="top-text-section__section-sub">
                <div class="section-sub-column">
                  <span class="text-4xl font-extrabold">{{ INVOICE.toUpperCase() }}</span>
                  <span class="font-semibold">{{ NUMBER }}: {{ props.invoiceSettings.invoiceNumber }}/{{ props.invoiceSettings.invoiceYear }}r</span>
                </div>

                <div class="section-sub-column">
                  <div class="row row--border">
                    <span class="font-bold">{{ DATE_OF_ISSUE }}:</span>
                    <span class="font-medium">{{ props.invoiceSettings.dateOfIssue }}</span>
                  </div>
                  <div class="row row--border">
                    <span class="font-bold">{{ PLACE_OF_ISSUE }}:</span>
                    <span class="font-medium">{{ props.invoiceSettings.placeOfIssue }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="top-text-section__section top-text-section__section--border-bottom">
              <div class="top-text-section__section-sub">
                <div class="section-sub-column">
                  <span class="font-extrabold">{{ BUYER }}</span>
                </div>
                <div class="section-sub-column">
                  <div class="row">
                    <span class="font-bold">{{ props.contractor.name }}</span>
                  </div>
                  <div class="row">
                    <span class="font-semibold">{{ ADDRES_START }} {{ props.contractor.address }}</span>
                  </div>
                  <div class="row">
                    <span class="font-semibold">{{ props.contractor.zipcode }} {{ props.contractor.city }}</span>
                  </div>
                  <div class="row">
                    <div>
                      <span class="font-bold">{{ NIP }}: </span>
                      <span class="font-semibold">{{ props.contractor.nip }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                :class="[
                  props.paymentSettings.paymentMethod !== 'transfer' ? 'top-text-section__section-sub--flex-start' : '',
                  'top-text-section__section-sub',
                ]"
              >
                <div class="section-sub-column">
                  <span class="font-extrabold">{{ PAYMENT }}</span>
                </div>
                <div class="section-sub-column">
                  <div class="row">
                    <span class="font-bold">{{ PAYMENT_METHOD }}:</span>
                    <span class="font-medium">{{ getPaymentMethod }}</span>
                  </div>
                  <div v-if="getPaymentMethod === TRANSFER" class="row">
                    <span class="font-bold">{{ DATE_OF_PAYMENT }}:</span>
                    <span class="font-medium"> {{ props.paymentSettings.daysOfPayment }} dni ({{ props.paymentSettings.dateOfPayment }})</span>
                  </div>
                  <div v-if="getPaymentMethod === TRANSFER" class="row">
                    <span class="font-bold">{{ ACCOUNT_NUMBER }}:</span>
                    <span class="font-medium"> {{ props.paymentSettings.accountNumber }}</span>
                  </div>
                  <div v-if="getPaymentMethod === TRANSFER" class="row">
                    <span class="font-bold">{{ BANK_NAME }}:</span>
                    <span class="font-medium"> {{ props.paymentSettings.bankName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class="items-table">
          <thead class="items-thead">
            <tr>
              <th class="items-th">{{ LP }}</th>
              <th class="items-th">{{ NAME }}</th>
              <th class="items-th">{{ STANDARD }}</th>
              <th class="items-th">{{ QUANTITY }}</th>
              <th class="items-th">{{ PRICE }}</th>
              <th class="items-th">{{ TOTAL_PRICE }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in props.items" :key="index" class="items-tr">
              <td class="items-td items-td--ion">{{ index + 1 }}</td>
              <td class="items-td items-td--name">{{ item.name }}</td>
              <td class="items-td">{{ item.standard === "meter" ? "Metr" : "Sztuka" }}</td>
              <td class="items-td">{{ item.quantity }}</td>
              <td class="items-td">{{ useCreateItemValue(item.price) }}</td>
              <td class="items-td">{{ useCreateItemValue(item.totalPrice) }}</td>
            </tr>
            <tr>
              <td colSpan="4"></td>
              <td class="items-td items-td--total-word font-extrabold">{{ TOTAL }}:</td>
              <td class="items-td items-td--total-price font-semibold">{{ useCreateItemValue(props.totalItemsValue) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-price">
          <span class="font-bold">{{ AMOUN_DUE_IN_WORDS }}:&nbsp; </span>
          <span class="font-semibold">{{ useFirstLetterUppercase(usePriceToWords(props.totalItemsValue).toLocaleLowerCase()) }}</span>
        </div>

        <div class="invoice-pdf__footer">
          <div class="footer-items">
            <div class="footer-item">
              <span> <i class="ri-phone-line font-light"></i></span>
              <span>{{ props.company.phoneNumber }}</span>
            </div>
            <div class="footer-item">
              <span> <i class="ri-mail-line font-light"></i> </span>
              <span>{{ props.company.email }}</span>
            </div>
            <div class="footer-item">{{ props.company.siteAddress }}</div>
          </div>
          <div class="text-right font-bold">{{ INVOICE_BOTTOM_TEXT }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.invoice-render {
  font-family: "EnergyRegular";
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  row-gap: 50px;
  width: 100%;
  overflow: auto;
}

.invoice-pdf {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  width: 1240px;
  height: 1754px;
  margin: 0 auto;
  padding: 30px;
  background-color: var(--colorWhite);
  color: var(--colorOne);
}

.invoice-pdf__top {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-column-gap: 20px;
  -moz-column-gap: 20px;
  column-gap: 20px;
}

.invoice-pdf__top-logo {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 280px;
  text-align: center;
}

.logo-image {
  width: 180px;
  height: 180px;
}

.logo-text {
  font-weight: 700;
  font-size: 1.8rem;
}

.invoice-pdf__top-text-section {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  width: calc(100% - 140px);
  border-top: 3px solid var(--colorOne);
  padding: 20px 0 0 0;
}

.top-text-section__section {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-column-gap: 20px;
  -moz-column-gap: 20px;
  column-gap: 20px;
  width: 100%;
}

.top-text-section__section--border-bottom {
  margin: 0 0 20px 0;
  padding: 0 0 10px 0;
  border-bottom: 2px dotted var(--colorOne);
}

.top-text-section__section-sub {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  row-gap: 15px;
  width: 50%;
}

.section-sub-column {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  row-gap: 5px;
}

.row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 0 5px 0;
}

.row--border {
  border-bottom: 1px solid var(--colorFive);
  margin: 0 0 5px 0px;
}

.items-table {
  border-collapse: collapse;
  margin-top: 45px;
}

.items-thead {
  border-bottom: 2px solid var(--colorOne);
}

.items-th {
  padding: 0 0 10px 0;
}

.items-tr {
  border-bottom: 1px dotted var(--colorOne);
}

.items-td {
  text-align: center;
  padding: 10px 0;
}

.items-td--ion {
  padding: 10px 15px;
}

.items-td--name {
  width: 450px;
  text-align: left;
  font-weight: 500;
  line-height: 25px;
}

.items-td--total-word {
  padding: 30px 0;
  border-bottom: 1px solid var(--colorOne);
}
.items-td--total-price {
  padding: 30px 0;
  border-bottom: 1px solid var(--colorOne);
}

.total-price {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid var(--colorOne);
}

.invoice-pdf__footer {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;

  position: absolute;
  width: calc(100% - 60px);
  bottom: 30px;
  left: 30px;
}

.footer-items {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  width: 100%;
  padding: 0 0 10px 0;
  border-bottom: 1px solid var(--colorOne);
  margin-bottom: 20px;
}

.footer-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-column-gap: 15px;
  -moz-column-gap: 15px;
  column-gap: 15px;
  font-weight: 600;
}

.top-text-section__section-sub--flex-start {
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
}
</style>
