<script setup lang="ts">
import { ref, reactive, onBeforeMount, toRef, watchEffect, computed } from "vue";
import { useToastStore } from "@/stores/ToastStore";

import type { IInvoicesResponse, ISettingsSiteResponse, IItem } from "@/api/Types";

import LoaderDefault from "@/loaders/LoaderDefault.vue";
import { COLLECTION__INVOICES, COLLECTION__SETTINGS_SITE } from "@/firebase";
import { getDocs, query, orderBy, deleteDoc, doc, getDoc } from "@firebase/firestore";
import {
  ADDRES_START,
  ADD_INVOICE,
  CONFIRM_DELETE,
  DELETE,
  DOWNLOAD,
  EDIT,
  INVOICE,
  NIP,
  PREVIEW,
  SEND,
  YES,
  NO,
  BACK,
  CLOSE,
  ACCOUNTAT,
  CONTRACTOR,
  NUMBER,
  INVOICE_DELETED,
} from "@/data/labels/LabelsGlobal";
import Button from "@/components/parts/Button/Button.vue";
import Modal from "@/components/parts/Modal/Modal.vue";
import TheInvoicePreview from "../TheInvoicePreview/TheInvoicePreview.vue";
import type { IInvoiceFinallState } from "../TheInvoicePreview/TheInvoicePreview.vue";
import { useFormatDate } from "@/use/useFormatDate";
import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";
import router from "@/router";

const defaultItemData: IItem = {
  name: "",
  price: 1,
  quantity: 1,
  standard: "piece",
  totalPrice: 1,
};

const initialState: IInvoiceFinallState = {
  contractor: {
    selectedId: "",
    name: "",
    address: "",
    zipcode: "",
    city: "",
    nip: "",
    email: "",
  },
  company: {
    name: "",
    address: "",
    zipcode: "",
    city: "",
    nip: "",
    email: "",
    phoneNumber: "",
    siteAddress: "",
  },
  invoiceSettings: {
    dateOfIssue: useFormatDate(new Date()),
    invoiceNumber: 0,
    invoiceYear: 0,
    placeOfIssue: "",
  },
  paymentSettings: {
    dateOfPayment: useFormatDate(new Date()),
    daysOfPayment: 14,
    paymentMethod: "transfer",
    accountNumber: "",
    bankName: "",
  },
  items: [{ ...defaultItemData }],
  totalItemsValue: 1,
};

const invoices = reactive<IInvoicesResponse[]>([]);
const siteSettings = reactive<ISettingsSiteResponse>({ accountantEmail: "", mailHost: "", mailPassword: "", mailPort: 0, mailUser: "" });
const loading = ref<boolean>(false);
const download = ref<boolean>(false);
const renderHook = ref<boolean>(false);
const showSendMailModal = ref<boolean>(false);
const sendMails = ref<boolean>(false);
const deliveryMails = reactive({ accountat: true, contractor: false });
const mailsToSendArray = reactive<string[]>([]);
const mailDataFinally = reactive({});
const showDeleteModal = ref<boolean>(false);
const deleting = ref<boolean>(false);
const clickedInvoiceId = ref<string>();
const showPreview = ref<boolean>();
const invoiceStateForRender = reactive<IInvoiceFinallState>({ ...initialState });
const toastStore = useToastStore();

const getAndSetInvoices = async (clear = false) => {
  try {
    loading.value = true;
    const contractorsApiData = await getDocs(query(COLLECTION__INVOICES, orderBy("invoiceSettings.invoiceNumber", "desc")));
    if (clear) invoices.splice(0);
    contractorsApiData.forEach((el) => invoices.push({ ...(el.data() as IInvoicesResponse), id: el.id }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getAndSetSiteSettings = async () => {
  try {
    loading.value = true;
    const siteSettingsApiData = await getDoc(doc(COLLECTION__SETTINGS_SITE, "settings"));
    Object.assign(siteSettings, { ...siteSettingsApiData.data() });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteInvoice = async () => {
  try {
    deleting.value = true;
    await deleteDoc(doc(COLLECTION__INVOICES, clickedInvoiceId.value));
    toastStore.setToast("success", INVOICE_DELETED);
    toastStore.showToastAction();
    await getAndSetInvoices(true);
    toggleDeleteModal();
  } catch (error) {
    console.error(error);
  } finally {
    deleting.value = false;
  }
};

const handleDownloadInvoice = (id: string) => {
  download.value = true;
  Object.assign(invoiceStateForRender, { ...invoices.find((el) => el.id === id) });
  renderHook.value = true;
};

const closeDownloadInvoice = () => {
  renderHook.value = false;
  download.value = false;
};

const toggleDeleteModal = (id?: string) => {
  if (id) clickedInvoiceId.value = id;
  showDeleteModal.value = !showDeleteModal.value;
};

const togglePreview = (id?: string) => {
  if (id) Object.assign(invoiceStateForRender, { ...invoices.find((el) => el.id === id) });
  window.scrollTo({ top: 0, behavior: "smooth" });
  showPreview.value = !showPreview.value;
};

const handleShowSendMailsModal = (id: string) => {
  Object.assign(invoiceStateForRender, { ...invoices.find((el) => el.id === id) });
  Object.assign(deliveryMails, { accountat: true, contractor: invoiceStateForRender.contractor.email ? true : false });
  mailsToSendArray.splice(0);
  mailsToSendArray.push(siteSettings.accountantEmail);
  if (invoiceStateForRender.contractor.email) mailsToSendArray.push(invoiceStateForRender.contractor.email);
  showSendMailModal.value = true;
};

const handleSelectDeliveryMails = (checked: boolean, who: "accountat" | "contractor") => {
  Object.assign(deliveryMails, { ...deliveryMails, [who]: checked });
  if (who === "accountat") {
    if (!checked) mailsToSendArray.splice(mailsToSendArray.indexOf(siteSettings.accountantEmail), 1);
    else {
      if (mailsToSendArray.indexOf(siteSettings.accountantEmail) === -1) mailsToSendArray.push(siteSettings.accountantEmail);
    }
  } else if (who === "contractor") {
    if (!checked) mailsToSendArray.splice(mailsToSendArray.indexOf(invoiceStateForRender.contractor.email), 1);
    else {
      if (mailsToSendArray.indexOf(invoiceStateForRender.contractor.email) === -1) mailsToSendArray.push(invoiceStateForRender.contractor.email);
    }
  }
};

const handleSendMail = () => {
  const finalData = {
    mailHost: siteSettings.mailHost,
    mailPort: siteSettings.mailPort,
    mailUser: siteSettings.mailUser,
    mailPassword: siteSettings.mailPassword,
    mailTitle: `${INVOICE} ${NUMBER} ${invoiceStateForRender.invoiceSettings.invoiceNumber}/${invoiceStateForRender.invoiceSettings.invoiceYear} ${invoiceStateForRender.contractor.name}`,
    mailFileName: `${INVOICE}_${NUMBER}_${invoiceStateForRender.invoiceSettings.invoiceNumber}_${invoiceStateForRender.invoiceSettings.invoiceYear}`,
    mailMails: [...mailsToSendArray],
  };
  Object.assign(mailDataFinally, finalData);
  sendMails.value = true;
};

const closeSendMail = () => {
  showSendMailModal.value = false;
  sendMails.value = false;
};

onBeforeMount(() => {
  getAndSetInvoices();
  getAndSetSiteSettings();
});
</script>

<template>
  <div v-if="!loading && !showPreview" class="flex flex-col divide-y-2 border shadow-lg">
    <div v-for="invoice in invoices" :key="invoice.id" class="flex flex-col gap-y-2 p-2 md:gap-y-2">
      <div class="flex w-full items-center justify-between">
        <div class="flex w-2/3 flex-col gap-y-2 text-sm font-semibold">
          {{ INVOICE }} numer {{ invoice.invoiceSettings.invoiceNumber }}/{{ invoice.invoiceSettings.invoiceYear }}
        </div>
        <div class="flex w-1/3 justify-end gap-x-4">
          <div class="flex md:hidden">
            <Button type="tooltip" outline color="error" icon="ri-more-2-fill">
              <template #tooltip>
                <router-link :to="`/invoices/edit/${invoice.id}`" class="flex items-center gap-x-2 p-2">
                  <i class="ri-edit-2-line"></i> <span class="text-xs font-semibold">{{ EDIT }}</span>
                </router-link>

                <div class="flex items-center gap-x-2 p-2" @click="() => handleShowSendMailsModal(invoice.id!)">
                  <i class="ri-mail-send-line"></i> <span class="text-xs font-semibold">{{ SEND }}</span>
                </div>

                <div class="flex items-center gap-x-2 p-2" @click="() => handleDownloadInvoice(invoice.id!)">
                  <i class="ri-file-download-line"></i> <span class="text-xs font-semibold">{{ DOWNLOAD }}</span>
                </div>

                <div class="flex items-center gap-x-2 p-2" @click="() => togglePreview(invoice.id!)">
                  <i class="ri-profile-line"></i> <span class="text-xs font-semibold">{{ PREVIEW }}</span>
                </div>

                <div class="bg-error-700 flex items-center gap-x-2 p-2 text-white" @click="() => toggleDeleteModal(invoice.id)">
                  <i class="ri-delete-bin-line"></i> <span class="text-xs font-semibold">{{ DELETE }}</span>
                </div>
              </template>
            </Button>
          </div>
          <div class="hidden md:flex md:gap-x-4">
            <Button outline type="icon" icon="ri-edit-2-line" :hover-tooltip-text="EDIT" @handle-click="router.push(`/invoices/edit/${invoice.id}`)" />
            <Button outline type="icon" icon="ri-mail-send-line" :hover-tooltip-text="SEND" @handle-click="() => handleShowSendMailsModal(invoice.id!)" />
            <Button outline type="icon" icon="ri-file-download-line" :hover-tooltip-text="DOWNLOAD" @handle-click="() => handleDownloadInvoice(invoice.id!)" />
            <Button outline type="icon" icon="ri-profile-line" :hover-tooltip-text="PREVIEW" @handle-click="() => togglePreview(invoice.id)" />
            <Button type="icon" color="error" icon="ri-delete-bin-line" :hover-tooltip-text="DELETE" @handle-click="() => toggleDeleteModal(invoice.id)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1 text-xs font-semibold text-gray-600 md:flex-row md:justify-start md:divide-x-2">
        <div class="flex flex-wrap gap-x-1">
          <span>{{ invoice.contractor.name }}</span>
          <span>{{ ADDRES_START }}</span>
          <span>{{ invoice.contractor.address }}</span> <span>{{ invoice.contractor.zipcode }}</span> <span>{{ invoice.contractor.city }}</span>
          <span v-if="invoice.contractor.email">{{ invoice.contractor.email }}</span>
        </div>
        <div class="flex gap-x-1 md:pl-1">
          <span class="font-extrabold">{{ NIP }}:</span>
          <span>{{ invoice.contractor.nip }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- DOWNLOAD MODAL -->
  <Modal v-if="download" :show-clos-icon="false" :close-modal-fnc="closeDownloadInvoice">
    <template #content>
      <LoaderDefault />
      <TheInvoicePreview v-bind="invoiceStateForRender" hidden :render="renderHook" @render-end="closeDownloadInvoice" />
    </template>
  </Modal>
  <!-- END DOWNLOAD MODAL -->

  <!-- DELETE MODAL -->
  <Modal v-if="showDeleteModal" :close-modal-fnc="toggleDeleteModal">
    <template #icon>
      <i class="ri-question-line text-gray-400"></i>
    </template>
    <template #content>
      <div class="flex w-full flex-col gap-y-2">
        <div class="w-11/12">
          {{ CONFIRM_DELETE }}
          <span class="font-extrabold"
            >{{ INVOICE }} {{ invoices.find((el) => el.id === clickedInvoiceId)?.invoiceSettings.invoiceNumber }}/{{
              invoices.find((el) => el.id === clickedInvoiceId)?.invoiceSettings.invoiceYear
            }}</span
          >?
        </div>
      </div>
    </template>
    <template #bottom>
      <div class="flex justify-between">
        <Button :label="NO" outline type="basic" @handle-click="toggleDeleteModal" />
        <Button :label="YES" type="basic" icon-position="end" :disabled="deleting" :is-loading="deleting" color="error" @handle-click="deleteInvoice" />
      </div>
    </template>
  </Modal>
  <!-- END DELETE MODAL -->

  <!-- PREIVIEW -->
  <div class="mt-5 flex justify-center" v-if="showPreview">
    <Button :label="CLOSE" outline icon="ri-close-fill" icon-position="start" type="basic" @handle-click="togglePreview" />
  </div>
  <TheInvoicePreview v-if="showPreview" v-bind="invoiceStateForRender" />
  <div class="mt-5 flex justify-center" v-if="showPreview">
    <Button :label="CLOSE" outline icon="ri-close-fill" icon-position="start" type="basic" @handle-click="togglePreview" />
  </div>
  <!-- END PREVIEW -->

  <!-- SEND MAILS -->
  <Modal v-if="showSendMailModal" :close-modal-fnc="closeSendMail">
    <template #icon>
      <i class="ri-mail-send-line"></i>
    </template>
    <template #content>
      <div class="mt-5 flex w-full flex-col gap-y-5">
        <div class="flex text-sm">Wyślij do:</div>
        <div class="flex w-full items-center justify-between font-semibold">
          <div class="flex flex-col">
            <span>{{ ACCOUNTAT }}</span>
            <span class="text-xs"> ({{ siteSettings.accountantEmail }})</span>
          </div>

          <Checkbox :checked="deliveryMails.accountat" @handle-change="(checked: boolean) => handleSelectDeliveryMails(checked, 'accountat')" />
        </div>
        <div v-if="invoiceStateForRender.contractor.email" class="flex w-full items-center justify-between font-semibold">
          <div class="flex flex-col">
            <span>{{ CONTRACTOR }}</span>
            <span class="text-xs"> ({{ invoiceStateForRender.contractor.email }})</span>
          </div>

          <Checkbox :checked="deliveryMails.contractor" @handle-change="(checked: boolean) => handleSelectDeliveryMails(checked, 'contractor')" />
        </div>
      </div>
      <TheInvoicePreview v-bind="invoiceStateForRender" hidden :send-mails="sendMails" :mail-data="mailDataFinally" @send-end="closeSendMail" />
    </template>
    <template #bottom>
      <div class="flex justify-center">
        <Button
          :label="SEND"
          type="basic"
          icon-position="end"
          :disabled="sendMails || !mailsToSendArray.length"
          :is-loading="sendMails"
          color="error"
          @handle-click="handleSendMail"
        />
      </div>
    </template>
  </Modal>
  <!-- END SEND MAILS -->
  <LoaderDefault v-if="loading" />
</template>
