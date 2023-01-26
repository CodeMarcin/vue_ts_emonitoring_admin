<script setup lang="ts">
import { reactive, ref, nextTick, onBeforeMount } from "vue";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { useVuelidate } from "@vuelidate/core";

import type { SettingsPaymentAPI } from "@/api/Types";

import { COLLECTION__SETTINGS_PAYMENT } from "@/firebase";

import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";
import Input from "@/components/parts/Input/Input.vue";
import Button from "@/components/parts/Button/Button.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
import Modal from "@/components/parts/Modal/Modal.vue";
import LoaderDefault from "@/loaders/LoaderDefault.vue";

import { useValidateCreateRules } from "@/use/useValidateCreateRules";

import { OBJECT__INPUT_PAYMENT_SETTINGS_FOR_EDIT } from "@/data/objects/ObjectInputs";

import { CHECK_ERRORS, CONFIRM_QUESTION, SAVE, FORMATING, NO, RESET, YES, SITE_SETTINGS, PAYMENT_SETTINGS } from "@/data/labels/LabelsGlobal";

const initialState: SettingsPaymentAPI = {
  accountNumber: "",
  bankName: "",
};

const inputs = reactive(OBJECT__INPUT_PAYMENT_SETTINGS_FOR_EDIT);

const loading = ref<boolean>(false);
const saving = ref<boolean>(false);
const showModal = ref<boolean>(false);
const checkErrors = ref<boolean>(true);
const formating = ref<boolean>(true);
const forceSendValue = ref(false);

const rules = useValidateCreateRules(inputs);
const state = reactive<SettingsPaymentAPI>({ ...initialState });
const v$ = useVuelidate(rules, state);

const checkForm = async () => {
  if (checkErrors.value) {
    try {
      const validation = await v$.value.$validate();
      if (validation) saveData();
    } catch (error) {
      console.error(error);
    }
  } else {
    saveData();
  }
};

const getAndSetSettings = async () => {
  try {
    loading.value = true;
    const settingsApiData = (await getDoc(doc(COLLECTION__SETTINGS_PAYMENT, "settings"))).data();
    Object.assign(state, settingsApiData);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const saveData = async () => {
  try {
    saving.value = true;
    await setDoc(doc(COLLECTION__SETTINGS_PAYMENT, "settings"), state);
  } catch (error) {
    console.error(error);
  } finally {
    saving.value = false;
  }
};

onBeforeMount(() => {
  getAndSetSettings();
});

const handleCheckError = async (checked: boolean) => {
  if (checked && !formating.value) formating.value = true;
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

const handleChangeInput = (value: string | number, name: keyof SettingsPaymentAPI) => {

  Object.assign(state, { [name]: value });
};

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const resetForm = () => {
  Object.assign(state, { ...initialState });
  toggleModal();
};
</script>

<template>
  <div v-if="!loading" class="flex w-full flex-col gap-y-5">
    <Panel>
      <template #header>{{ PAYMENT_SETTINGS }}</template>
      <template #content>
        <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
          <div v-for="(input, index) in inputs" :key="input.id" class="flex flex-auto sm:w-1/3">
            <Input
              :id="input.id"
              :label="input.label"
              :mask="formating ? input.mask : ''"
              :type="input.type"
              :name="input.name"
              :value="state[input.name as keyof SettingsPaymentAPI]"
              :input-mode="formating ? input.inputMode : 'text'"
              :errors="checkErrors && input.validateRules ? v$[input.name].$errors : []"
              :validate-rules="input.validateRules"
              :mask-token="input.maskToken"
              :force-send-value="forceSendValue"
              :pending="input.validateRules ? v$[input.name].$pending : false"
              @handle-change="(e, name) => handleChangeInput(e, name)"
              @force-end="forceSendValue = false"
            />
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
    <div class="flex justify-between">
      <Button :label="RESET" outline type="basic" icon="ri-refresh-line" icon-position="start" @handle-click="toggleModal" />
      <Button
        :label="SAVE"
        color="primary"
        type="basic"
        icon="ri-save-3-line"
        icon-position="end"
        :disabled="v$.$pending || loading || saving"
        :is-loading="v$.$pending || loading || saving"
        @handle-click="checkForm"
      />
    </div>
  </div>

  <Modal v-if="showModal" :close-modal-fnc="toggleModal">
    <template #icon>
      <i class="ri-question-line text-gray-400"></i>
    </template>
    <template #content>{{ CONFIRM_QUESTION }}</template>
    <template #bottom>
      <div class="flex justify-between">
        <Button :label="NO" outline type="basic" @handle-click="toggleModal" />
        <Button :label="YES" type="basic" color="error" @handle-click="resetForm" />
      </div>
    </template>
  </Modal>

  <LoaderDefault v-if="loading" />
</template>
