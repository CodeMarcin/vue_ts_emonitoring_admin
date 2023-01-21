<script setup lang="ts">
import { reactive, computed, ref, nextTick, watchEffect, watch } from "vue";
import type { SettingsCompanyAPI, SettingsSiteAPI } from "@/api/APIServer";

import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";
import Input from "@/components/parts/Input/Input.vue";
import Button from "@/components/parts/Button/Button.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
import Modal from "@/components/parts/Modal/Modal.vue";

import { getSettingsAPI } from "@/api/APISettings";

import useVuelidate from "@vuelidate/core";

import { OBJECT__SETTINGS_COMPANY, OBJECT__SETTINGS_SITE } from "@/data/objects/ObjectSettings";
import { useValidateCreateRules } from "@/use/useValidateCreateRules";

import { ADD, CHECK_ERRORS, COMPANY_SETTINGS, CONFIRM_QUESTION, SITE_SETTINGS, FORMATING, NO, RESET, YES } from "@/data/labels/LabelsGlobal";

const companySettingsFromAPI = reactive<SettingsCompanyAPI>((await getSettingsAPI()).data.company);

const inputs = reactive(OBJECT__SETTINGS_COMPANY);

const rules = useValidateCreateRules(inputs);
const state = reactive<SettingsCompanyAPI>(companySettingsFromAPI);

const settings = reactive({ checkErrors: true, formating: true });
const forceSendValue = ref(false);
const showModal = ref(false);

const v$ = useVuelidate(rules, state);

const handleCheckError = computed(() => async (checked: boolean) => {
  if (checked && !settings.formating) settings.formating = true;
  settings.checkErrors = !settings.checkErrors;
  await nextTick();
  forceSendValue.value = true;
});

const handleFormating = computed(() => async (checked: boolean) => {
  if (!checked && settings.checkErrors) settings.checkErrors = false;
  settings.formating = !settings.formating;
  await nextTick();
  forceSendValue.value = true;
});

const handleChangeInput = (value: string, name: string) => {
  state[name as keyof SettingsCompanyAPI] = value;
};

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const resetForm = () => {
  Object.keys(state).forEach((key) => {
    state[key as keyof SettingsCompanyAPI] = "";
  });
  toggleModal();
};

const checkForm = async () => {
  const validation = await v$.value.$validate();
  console.log("asdasd");
};
</script>

<template>
  <div class="flex w-full flex-col gap-y-5">
    <Panel>
      <template #header>{{ COMPANY_SETTINGS }}</template>
      <template #content>
        <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
          <div v-for="(input, index) in inputs" :key="input.id" class="flex flex-auto sm:w-1/3">
            <Input
              :id="input.id"
              :label="input.label"
              :mask="settings.formating ? input.mask : ''"
              :type="input.type"
              :name="input.name"
              :value="state[input.name as keyof SettingsCompanyAPI]"
              :input-mode="settings.formating ? input.inputMode : 'text'"
              :errors="settings.checkErrors && input.validateRules ? v$[input.name].$errors : []"
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
        <Checkbox :checked="settings.checkErrors" @handle-change="(checked: boolean) => handleCheckError(checked)" />
      </div>
      <div class="flex w-full items-center justify-between px-4 py-2">
        <span>{{ FORMATING }}</span>
        <Checkbox :checked="settings.formating" @handle-change="(checked: boolean) => handleFormating(checked)" />
      </div>
    </div>
    <div class="flex justify-between">
      <Button :label="RESET" outline type="basic" icon="ri-refresh-line" icon-position="start" @handle-click="toggleModal" />
      <Button :label="ADD" color="primary" type="basic" icon="ri-arrow-right-s-line" icon-position="end" :is-loading="v$.$pending" @handle-click="checkForm" />
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
</template>
