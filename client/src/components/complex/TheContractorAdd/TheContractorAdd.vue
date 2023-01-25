<script setup lang="ts">
import { ref, nextTick, reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { addDoc } from "@firebase/firestore";
import router from "@/router";

import type { IContractorsResponse } from "@/api/Types";

import { COLLECTION__CONTRACTORS } from "@/firebase";

import Input from "@/components/parts/Input/Input.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
import Button from "@/components/parts/Button/Button.vue";
import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";
import Modal from "@/components/parts/Modal/Modal.vue";

import { useValidateCreateRules } from "@/use/useValidateCreateRules";
import { useValidateCreateState } from "@/use/useValidateCreateState";

import { OBJECT__FORM_CONTRACTOR_ADD } from "@/data/objects/ObjectsFormContractorAdd";

import { CHECK_ERRORS, FORMATING, ADD, RESET, CONFIRM_QUESTION, YES, NO } from "@/data/labels/LabelsGlobal";

const inputs = reactive(OBJECT__FORM_CONTRACTOR_ADD);

const loading = ref<boolean>(false);
const showModal = ref<boolean>(false);
const checkErrors = ref<boolean>(true);
const formating = ref<boolean>(true);
const forceSendValue = ref(false);

const rules = useValidateCreateRules(inputs);
const state = useValidateCreateState(inputs) as IContractorsResponse;
const v$ = useVuelidate(rules, state);

const checkForm = async () => {
  if (checkErrors.value) {
    try {
      loading.value = true;
      const validation = await v$.value.$validate();
      if (validation) addContractor();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  } else {
    addContractor();
  }
};

const addContractor = async () => {
  try {
    loading.value = true;
    await addDoc(COLLECTION__CONTRACTORS, { ...state, createDate: new Date() });
    router.push({ name: "ContractorsAll" });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
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
  console.log(state);
};

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const resetForm = () => {
  Object.keys(state).forEach((key) => {
    state[key as keyof IContractorsResponse] = "";
  });
  toggleModal();
};
</script>

<template>
  <div class="flex w-full flex-col gap-y-5">
    <div class="flex flex-col gap-y-5">
      <Panel v-for="group in inputs" :key="group.id">
        <template #header>{{ group.header }}</template>
        <template #content>
          <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
            <div v-for="input in group.inputs" :key="input.id" class="flex flex-auto sm:w-1/3">
              <Input
                :id="input.id"
                :label="input.label"
                :group-name="group.groupName"
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
      <Button :label="RESET" outline type="basic" icon="ri-refresh-line" icon-position="start" @handle-click="toggleModal" />
      <Button
        :label="ADD"
        color="primary"
        type="basic"
        icon="ri-arrow-right-s-line"
        icon-position="end"
        :is-loading="v$.$pending || loading"
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
</template>
