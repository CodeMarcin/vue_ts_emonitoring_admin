<script setup lang="ts">
import { ref, nextTick, reactive, computed, onBeforeMount } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { addDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "@firebase/firestore";
import { useToastStore } from "@/stores/ToastStore";
import { useRoute } from "vue-router";
import router from "@/router";

import Input from "@/components/parts/Input/Input.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
import Button from "@/components/parts/Button/Button.vue";
import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";
import Modal from "@/components/parts/Modal/Modal.vue";
import LoaderDefault from "@/loaders/LoaderDefault.vue";

import { useValidateCreateRules } from "@/use/useValidateCreateRules";

import type { IContractorsResponse } from "@/api/Types";

import { COLLECTION__CONTRACTORS, COLLECTION__INVOICES, FIREBASE_DB } from "@/firebase";
import { OBJECT__INPUT_CONTRACTOR } from "@/data/objects/ObjectInputs";

import {
  CHECK_ERRORS,
  FORMATING,
  ADD,
  RESET,
  CONFIRM_QUESTION,
  YES,
  NO,
  CONTRACTOR_ADD,
  ADD_CONTRACTOR,
  SAVED,
  SAVE,
  EDIT_CONTRACTOR,
  EDIT_CONTRACTOR_INVOICES,
} from "@/data/labels/LabelsGlobal";

const initialState: IContractorsResponse = {
  address: "",
  city: "",
  email: "",
  name: "",
  nip: "",
  zipcode: "",
};

const inputs = reactive(OBJECT__INPUT_CONTRACTOR);

const contracotrIdFromURLParam = ref<string>();
const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const showResetModal = ref<boolean>(false);
const showEditInvoiceModal = ref<boolean>(false);
const checkErrors = ref<boolean>(true);
const formating = ref<boolean>(true);
const forceSendValue = ref(false);
const toastStore = useToastStore();

const rules = useValidateCreateRules(inputs);
const state = reactive<IContractorsResponse>({ ...initialState });
const v$ = useVuelidate(rules, state);

const mainButtonLabel = computed(() => (contracotrIdFromURLParam.value ? SAVE : ADD));
const headerLabel = computed(() => (contracotrIdFromURLParam.value ? `${EDIT_CONTRACTOR} - ${state.name}` : ADD_CONTRACTOR));

const checkForm = async () => {
  if (checkErrors.value) {
    try {
      saving.value = true;
      const validation = await v$.value.$validate();
      if (validation) saveContractor();
    } catch (error) {
      console.error(error);
    } finally {
      saving.value = false;
    }
  } else {
    saveContractor();
  }
};

const saveContractor = async () => {
  try {
    saving.value = true;
    if (contracotrIdFromURLParam.value) {
      toggleEditInvoiceModal();
    } else {
      await addDoc(COLLECTION__CONTRACTORS, { ...state, createDate: new Date() });
      toastStore.setToast("success", CONTRACTOR_ADD);
      toastStore.showToastAction();
      router.push({ name: "ContractorsAll" });
    }
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};

const editContractor = async (editInvoices: boolean) => {
  try {
    saving.value = true;
    await setDoc(doc(COLLECTION__CONTRACTORS, contracotrIdFromURLParam.value), state);
    const invoicesToDelete = await getDocs(query(COLLECTION__INVOICES, where("contractor.selectedId", "==", contracotrIdFromURLParam.value)));
    if (editInvoices) {
      const FIREBASE_BATCH = writeBatch(FIREBASE_DB);
      invoicesToDelete.forEach((el) => {
        FIREBASE_BATCH.set(el.ref, { contractor: { ...state } }, { merge: true });
      });
      await FIREBASE_BATCH.commit();
    } else {
      const FIREBASE_BATCH = writeBatch(FIREBASE_DB);
      invoicesToDelete.forEach((el) => {
        FIREBASE_BATCH.set(el.ref, { contractor: { selectedId: "" } }, { merge: true });
      });
      await FIREBASE_BATCH.commit();
    }
    toastStore.setToast("success", SAVED);
    toastStore.showToastAction();
    router.push({ name: "ContractorsAll" });
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};

const handleCheckError = async (checked: boolean) => {
  if (checked && formating.value) formating.value = true;
  checkErrors.value = !checkErrors.value;
  await nextTick();
  forceSendValue.value = true;
};

const handleFormating = async (checked: boolean) => {
  if (!checked && checkErrors.value) checkErrors.value = false;
  formating.value = !formating.value;
  await nextTick();
  forceSendValue.value = true;
};

const handleChangeInput = (value: string, name: keyof IContractorsResponse) => {
  state[name] = value;
};

const toggleResetModal = () => {
  showResetModal.value = !showResetModal.value;
};

const toggleEditInvoiceModal = () => {
  console.log("odpalipe,");
  showEditInvoiceModal.value = !showEditInvoiceModal.value;
};

const resetForm = () => {
  Object.assign(state, { ...initialState });
  toggleResetModal();
};

const _init = async () => {
  try {
    loading.value = true;
    contracotrIdFromURLParam.value = useRoute().params.id as string;
    if (contracotrIdFromURLParam.value) {
      const contractorApiData = await getDoc(doc(COLLECTION__CONTRACTORS, contracotrIdFromURLParam.value));
      Object.assign(state, contractorApiData.data());
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  _init();
});
</script>

<template>
  <div v-if="!loading" class="flex w-full flex-col gap-y-5">
    <div class="flex flex-col gap-y-5">
      <Panel>
        <template #header>{{ headerLabel }}</template>
        <template #content>
          <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
            <div v-for="input in inputs" :key="input.id" class="flex flex-auto sm:w-1/3">
              <Input
                :id="input.id"
                :label="input.label"
                :mask="formating ? input.mask : ''"
                :type="input.type"
                :name="input.name"
                :value="state[input.name as keyof IContractorsResponse]"
                :input-mode="formating ? input.inputMode : 'text'"
                :errors="checkErrors ? v$[input.name].$errors : []"
                :validate-rules="input.validateRules"
                :mask-token="input.maskToken"
                :force-send-value="forceSendValue"
                :pending="v$[input.name].$pending"
                @handle-change="(e, name) => handleChangeInput(e, name)"
                @force-end="forceSendValue = false"
              />
            </div>
          </div>
        </template>
      </Panel>
    </div>
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
    <div class="flex justify-between">
      <Button :label="RESET" outline type="basic" icon="ri-refresh-line" icon-position="start" @handle-click="toggleResetModal" />
      <Button
        :label="mainButtonLabel"
        color="primary"
        type="basic"
        icon="ri-arrow-right-s-line"
        icon-position="end"
        :is-loading="v$.$pending || saving"
        @handle-click="checkForm"
      />
    </div>
  </div>

  <Modal v-if="showResetModal" :close-modal-fnc="toggleResetModal">
    <template #icon>
      <i class="ri-question-line text-gray-400"></i>
    </template>
    <template #content>{{ CONFIRM_QUESTION }}</template>
    <template #bottom>
      <div class="flex justify-between">
        <Button :label="NO" outline type="basic" @handle-click="toggleResetModal" />
        <Button :label="YES" type="basic" color="error" @handle-click="resetForm" />
      </div>
    </template>
  </Modal>

  <Modal v-if="showEditInvoiceModal" :close-modal-fnc="toggleEditInvoiceModal">
    <template #icon>
      <i class="ri-question-line text-gray-400"></i>
    </template>
    <template #content>{{ EDIT_CONTRACTOR_INVOICES }}</template>
    <template #bottom>
      <div class="flex justify-between">
        <Button :label="NO" outline type="basic" @handle-click="editContractor(false)" />
        <Button :label="YES" type="basic" color="error" @handle-click="editContractor(true)" />
      </div>
    </template>
  </Modal>

  <LoaderDefault v-if="loading" />
</template>
