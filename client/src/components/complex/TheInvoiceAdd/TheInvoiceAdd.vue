<script setup lang="ts">
import { ref, reactive, onBeforeMount, watchEffect } from "vue";
import { addDoc, doc, DocumentSnapshot, getDoc, getDocs, orderBy, query, QuerySnapshot, setDoc, type DocumentData } from "@firebase/firestore";
import { useVuelidate } from "@vuelidate/core";
import { isEqual } from "lodash";

import Select from "@/components/parts/Select/Select.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
import Input from "@/components/parts/Input/Input.vue";
import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";
import Button from "@/components/parts/Button/Button.vue";
import InvoicePreview from "@/components/complex/TheInvoicePreview/TheInvoicePreview.vue";
import LoaderDefault from "@/loaders/LoaderDefault.vue";

import { useFormatDate } from "@/use/useFormatDate";

import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import type { SelectInterface } from "@/components/parts/Select/Select.vue";
import type { ValidationArgs } from "@vuelidate/core";

import {
  OBJECT__INPUT_CONTRACTOR,
  OBJECT__INPUT_COMPANY,
  OBJECT__INPUT_INVOICE_SETTINGS,
  OBJECT__INPUT_PAYMENT_SETTINGS,
  OBJECT__INPUT_ITEM,
} from "@/data/objects/ObjectInputs";

import {
  COLLECTION__CONTRACTORS,
  COLLECTION__SETTINGS_COMPANY,
  COLLECTION__SETTINGS_INVOICE,
  COLLECTION__SETTINGS_PAYMENT,
  COLLECTION__INVOICES,
} from "@/firebase";

import { ADD, CASH, CHECK_ERRORS, FORMATING, METER, PIECE, PREVIEW, TRANSFER, BACK, SAVE } from "@/data/labels/LabelsGlobal";
import { useCreateItemValue } from "@/use/useCreateItemValue";
import router from "@/router";

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
}

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

interface IRules {
  company: ValidationArgs;
  contractor: ValidationArgs;
  invoiceSettings: ValidationArgs;
  items: ValidationArgs[];
  paymentSettings: ValidationArgs;
}

const state = reactive<IInvoiceFinallState>({ ...initialState });
const rules = reactive<IRules>({ company: {}, contractor: {}, invoiceSettings: {}, items: [], paymentSettings: {} });
const itemsInput = reactive(OBJECT__INPUT_ITEM);
const selectContractor = reactive<SelectInterface>({ name: "selectContractor", options: [] });
const selectPaymentMethod = reactive<SelectInterface>({
  name: "selectPaymentMethod",
  options: [
    { label: TRANSFER, value: "transfer" },
    { label: CASH, value: "cash" },
  ],
});
const selectItemStandard = reactive<SelectInterface>({
  name: "selectItemStandard",
  options: [
    { label: PIECE, value: "piece" },
    { label: METER, value: "meter" },
  ],
});

let contractorsData: QuerySnapshot<DocumentData>;
let settingsCompanyData: DocumentSnapshot<DocumentData>;
let settingsInvoiceData: DocumentSnapshot<DocumentData>;
let settingsPaymentData: DocumentSnapshot<DocumentData>;

const formating = ref<boolean>(true);
const checkErrors = ref<boolean>(true);
const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const preview = ref<boolean>(false);

const v$ = useVuelidate(rules, state);

const handleChangeInput = (value: string, name: string, parentName: keyof Omit<IInvoiceFinallState, "totalItemsValue">) => {
  const expectedValue = Number(value) || value;
  Object.assign(state, { [parentName]: { ...state[parentName], [name]: expectedValue } });
};

const handleChangeItemsInput = (value: string, name: keyof IItem, index: number) => {
  const expectedValue = Number(value) || value;
  if (name === "price" || name === "quantity")
    Object.assign(state.items[index], { [name]: expectedValue, totalPrice: state.items[index].price * state.items[index].quantity });
  else Object.assign(state.items[index], { [name]: expectedValue });
};

const handleSelectContractor = (selected: string) => {
  const selectedContractor = contractorsData.docs.find((el) => el.id === selected);
  Object.assign(state, { contractor: { selectedId: selectedContractor?.id, ...selectedContractor?.data() } });
  Object.assign(selectContractor, { selected: selectedContractor?.id });
};

const handleSelectPaymentMethod = (selected: string) => {
  Object.assign(state, { paymentSettings: { ...state.paymentSettings, paymentMethod: selected } });
  Object.assign(selectPaymentMethod, { selected });
};

const handleSelectItemStandard = (selected: TItemStandard, index: number) => {
  state.items[index] = { ...state.items[index], standard: selected };
};

const handleAddItem = () => {
  state.items.push({ ...defaultItemData });
  rules.items.push(...createItemsRules(OBJECT__INPUT_ITEM));
  itemsInput.push(OBJECT__INPUT_ITEM[0] as (typeof itemsInput)[0]);
};

const handleRemoveItem = (index: number) => {
  state.items.splice(index, 1);
  rules.items.splice(index, 1);
  itemsInput.splice(index, 1);
};

const handleCheckError = async (checked: boolean) => {
  if (checked && !formating.value) formating.value = true;
  checkErrors.value = !checkErrors.value;
};

const handleFormating = async (checked: boolean) => {
  if (!checked && checkErrors.value) checkErrors.value = false;
  formating.value = !formating.value;
};

const closePreview = () => {
  Object.assign(state, { contractor: { ...state.contractor, selectedId: selectContractor.selected } });
  preview.value = false;
};

const saveInvoice = async () => {
  try {
    saving.value = true;
    const selectedContractor = contractorsData.docs.find((el) => el.id === state.contractor.selectedId)?.data();
    const stateContractor: any = { ...state.contractor };
    delete stateContractor.selectedId;
    if (!isEqual(selectedContractor, stateContractor)) Object.assign(state, { contractor: { ...state.contractor, selectedId: "" } });
    if (settingsInvoiceData.data()!.invoiceNumber === state.invoiceSettings.invoiceNumber) {
      await setDoc(doc(COLLECTION__SETTINGS_INVOICE, "settings"), { invoiceNumber: state.invoiceSettings.invoiceNumber + 1 }, { merge: true });
    }
    await addDoc(COLLECTION__INVOICES, { ...state, createDate: new Date() });
    router.push({ name: "InvoicesAll" });
  } catch (error) {
    console.log(error);
  } finally {
    saving.value = false;
  }
};

const checkForm = async () => {
  try {
    saving.value = true;
    if (checkErrors.value) {
      const validationResult = await v$.value.$validate();
      if (validationResult) {
        preview.value = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      preview.value = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};

const createRules = (obj: InterfaceInput[]) => {
  let rules: ValidationArgs = {};
  obj.forEach((el) => {
    if (el.validateRules) rules = { ...rules, [el.name]: el.validateRules };
  });
  return rules;
};

const createItemsRules = (obj: InterfaceInput[][]) => {
  let rules: ValidationArgs[] = [];
  obj.forEach((el) => {
    let rule = {};
    el.forEach((el) => {
      if (el.validateRules) rule = { ...rule, [el.name]: el.validateRules };
    });
    rules.push({ ...rule });
  });
  return rules;
};

onBeforeMount(async () => {
  const contractorsApiData = getDocs(query(COLLECTION__CONTRACTORS, orderBy("createDate")));
  const settingsCompanyApiData = getDoc(doc(COLLECTION__SETTINGS_COMPANY, "settings"));
  const settingsInvoiceApiData = getDoc(doc(COLLECTION__SETTINGS_INVOICE, "settings"));
  const settingsPaymentApiData = getDoc(doc(COLLECTION__SETTINGS_PAYMENT, "settings"));

  try {
    loading.value = true;
    [contractorsData, settingsCompanyData, settingsInvoiceData, settingsPaymentData] = await Promise.all([
      contractorsApiData,
      settingsCompanyApiData,
      settingsInvoiceApiData,
      settingsPaymentApiData,
    ]);

    Object.assign(state, {
      contractor: { selectedId: contractorsData.docs[0].id, ...contractorsData.docs[0].data() },
      company: { ...settingsCompanyData.data() },
      invoiceSettings: { ...state.invoiceSettings, ...settingsInvoiceData.data() },
      paymentSettings: { ...state.paymentSettings, ...settingsPaymentData.data() },
    });

    Object.assign(rules, {
      contractor: createRules(OBJECT__INPUT_CONTRACTOR),
      company: createRules(OBJECT__INPUT_COMPANY),
      invoiceSettings: createRules(OBJECT__INPUT_INVOICE_SETTINGS),
      paymentSettings: createRules(OBJECT__INPUT_PAYMENT_SETTINGS),
      items: [...createItemsRules(OBJECT__INPUT_ITEM)],
    });

    contractorsData.forEach((el) => selectContractor.options!.push({ label: el.data().name, value: el.id }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

watchEffect(() => {
  const dateOfPayment = new Date(state.invoiceSettings.dateOfIssue);
  dateOfPayment.setDate(dateOfPayment.getDate() + Number(state.paymentSettings.daysOfPayment));
  Object.assign(state, { paymentSettings: { ...state.paymentSettings, dateOfPayment: useFormatDate(dateOfPayment) } });
});

watchEffect(() => {
  let totalValue = 0;
  state.items.forEach((el) => {
    totalValue += el.totalPrice;
  });
  Object.assign(state, { totalItemsValue: totalValue });
});
</script>

<template>
  <div v-if="!loading && !preview" class="flex w-full flex-col gap-y-5">
    <Panel>
      <template #header>Kontrahent</template>
      <template #content>
        <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
          <Select v-bind="selectContractor" @handle-change="(selected:string) => handleSelectContractor(selected)" />
          <div v-for="input in OBJECT__INPUT_CONTRACTOR" :key="input.id" class="flex flex-auto sm:w-1/3">
            <Input
              :id="input.id"
              :label="input.label"
              :mask="formating ? input.mask : ''"
              :type="input.type"
              :name="input.name"
              :value="state.contractor[input.name as keyof IContractor]"
              :input-mode="formating ? input.inputMode : 'text'"
              :errors="checkErrors && input.validateRules && v$.contractor ? v$?.contractor[input.name].$errors : []"
              :validate-rules="input.validateRules"
              :mask-token="input.maskToken"
              parent-name="contractor"
              @handle-change="(value, name, parentName) => handleChangeInput(value, name, parentName)"
            />
          </div>
        </div>
      </template>
    </Panel>
    <Panel>
      <template #header>Twoja firma</template>
      <template #content>
        <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
          <div v-for="input in OBJECT__INPUT_COMPANY" :key="input.id" class="flex flex-auto sm:w-1/3">
            <Input
              :id="input.id"
              :label="input.label"
              :mask="formating ? input.mask : ''"
              :type="input.type"
              :name="input.name"
              :value="state.company[input.name as keyof ICompany]"
              :input-mode="formating ? input.inputMode : 'text'"
              :errors="checkErrors && input.validateRules && v$.company ? v$.company[input.name].$errors : []"
              :validate-rules="input.validateRules"
              :mask-token="input.maskToken"
              parent-name="company"
              @handle-change="(e, name, parentName) => handleChangeInput(e, name, parentName)"
            />
          </div>
        </div>
      </template>
    </Panel>
    <Panel>
      <template #header>Faktura</template>
      <template #content>
        <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
          <div v-for="input in OBJECT__INPUT_INVOICE_SETTINGS" :key="input.id" class="flex flex-auto sm:w-1/3">
            <Input
              :id="input.id"
              :label="input.label"
              :mask="formating ? input.mask : ''"
              :type="input.type"
              :name="input.name"
              :value="state.invoiceSettings[input.name as keyof IInvoiceSettings]"
              :input-mode="formating ? input.inputMode : 'text'"
              :errors="checkErrors && input.validateRules && v$.invoiceSettings ? v$.invoiceSettings[input.name].$errors : []"
              :validate-rules="input.validateRules"
              :mask-token="input.maskToken"
              parent-name="invoiceSettings"
              @handle-change="(e, name, parentName) => handleChangeInput(e, name, parentName)"
            />
          </div>
        </div>
      </template>
    </Panel>
    <Panel>
      <template #header>Płatność</template>
      <template #content>
        <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
          <Select v-bind="selectPaymentMethod" @handle-change="(selected:string) => handleSelectPaymentMethod(selected)" />
          <div
            v-for="input in OBJECT__INPUT_PAYMENT_SETTINGS"
            v-if="state.paymentSettings.paymentMethod === 'transfer'"
            :key="input.id"
            class="flex flex-auto sm:w-1/3"
          >
            <Input
              :id="input.id"
              :label="input.label"
              :mask="formating ? input.mask : ''"
              :type="input.type"
              :name="input.name"
              :value="state.paymentSettings[input.name as keyof IPaymentSettings]"
              :input-mode="formating ? input.inputMode : 'text'"
              :errors="checkErrors && input.validateRules && v$.paymentSettings ? v$.paymentSettings[input.name].$errors : []"
              :validate-rules="input.validateRules"
              :mask-token="input.maskToken"
              parent-name="paymentSettings"
              @handle-change="(e, name, parentName) => handleChangeInput(e, name, parentName)"
            />
          </div>
          <div v-if="state.paymentSettings.paymentMethod === 'transfer'" class="flex flex-auto items-end justify-between sm:w-1/3">
            <span class="font-medium text-gray-900">Data zapłaty:</span>
            <span class="font-medium text-gray-900">{{ state.paymentSettings.dateOfPayment }}</span>
          </div>
        </div>
      </template>
    </Panel>
    <Panel>
      <template #header>Usługi / towary</template>
      <template #content>
        <div class="flex w-full flex-col flex-wrap gap-x-10 gap-y-4">
          <div v-for="(inputs, index) in itemsInput" :key="index" class="flex w-full flex-wrap gap-x-10 gap-y-4">
            <div class="flex w-full items-center justify-between bg-gray-900 font-semibold text-white shadow-lg">
              <span class="px-3 py-2">Liczba porządkowa:</span><span class="bg-orange-500 px-3 py-2 text-white">{{ index + 1 }}</span>
            </div>
            <div class="flex w-full items-center justify-between gap-x-10">
              <span class="w-2/3 text-sm text-gray-900">Miara:</span>
              <Select
                v-bind="selectItemStandard"
                :selected="state.items[index].standard"
                @handle-change="(selected:TItemStandard) => handleSelectItemStandard(selected, index)"
              />
            </div>
            <div v-for="input in inputs" :key="input.id! + index" class="flex flex-auto sm:w-1/3">
              <Input
                :id="input.id"
                :label="input.label"
                :mask="formating ? input.mask : ''"
                :type="input.type"
                :name="input.name"
                :value="state.items[index][input.name as keyof IItem]"
                :input-mode="formating ? input.inputMode : 'text'"
                :errors="checkErrors && input.validateRules && v$.items ? v$.items[index][input.name].$errors : []"
                :validate-rules="input.validateRules"
                :mask-token="input.maskToken"
                parent-name="items"
                @handle-change="(value, name) => handleChangeItemsInput(value, name, index)"
              />
            </div>
            <div class="flex flex-auto items-end justify-between sm:w-1/3">
              <span class="font-medium text-gray-900">Razem:</span>
              <span class="font-medium text-gray-900">{{ useCreateItemValue(state.items[index].price, state.items[index].quantity) }}</span>
            </div>
            <div class="flex w-full justify-end" v-if="state.items.length > 1">
              <Button type="icon" color="error" icon="ri-delete-bin-line" @handle-click="() => handleRemoveItem(index)" />
            </div>
          </div>
          <div class="flex w-full items-center justify-between bg-violet-100 p-2 font-semibold text-gray-800">
            <span>Wartość razem:</span>
            <span>{{ useCreateItemValue(state.totalItemsValue) }}</span>
          </div>
          <div class="mt-5 flex w-full justify-end border-t pt-5">
            <Button :label="ADD" color="secondary" type="basic" icon="ri-add-box-line" icon-position="end" @handle-click="handleAddItem" />
          </div>
        </div>
      </template>
    </Panel>
    <div class="flex w-full flex-col divide-y-2 rounded-md border text-xs font-medium shadow-lg">
      <div class="flex w-full items-center justify-between px-4 py-2">
        <span>{{ CHECK_ERRORS }}</span>
        <Checkbox :checked="checkErrors" @handle-change="(checked: boolean) => handleCheckError(checked)" />
      </div>
      <div class="flex w-full items-center justify-between px-4 py-2">
        <span>{{ FORMATING }}</span>
        <Checkbox :checked="formating" @handle-change="(checked: boolean) => handleFormating(checked)" />
      </div>
    </div>
    <div class="flex w-full justify-center">
      <Button :label="PREVIEW" color="primary" type="basic" icon="ri-profile-line" icon-position="end" :is-loading="saving" @handle-click="checkForm" />
    </div>
  </div>

  <LoaderDefault v-if="loading" />

  <InvoicePreview v-if="preview" v-bind="state" />
  <div class="flex justify-between mt-5" v-if="preview">
    <Button :label="BACK" outline icon="ri-arrow-left-s-line" icon-position="start" type="basic" @handle-click="closePreview" />

    <Button :label="SAVE" type="basic" icon="ri-save-line" icon-position="end" color="error" :is-loading="saving" @handle-click="saveInvoice" />
  </div>
</template>
