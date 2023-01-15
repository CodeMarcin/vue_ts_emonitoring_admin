<script setup lang="ts">
import { ref, nextTick, reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";

import Input from "@/components/parts/Input/Input.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
import Button from "@/components/parts/Button/Button.vue";
import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";

import { useValidateCreateRules } from "@/use/useValidateCreateRules";
import { useValidateCreateState } from "@/use/useValidateCreateState";

import { OBJECT__FORM_CONTRACTOR_ADD } from "@/data/objects/ObjectsFormContractorAdd";

import { CHECK_ERRORS, FORMATING, ADD, RESET } from "@/data/labels/LabelsGlobal";

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

const inputs = reactive(OBJECT__FORM_CONTRACTOR_ADD);

const settings = reactive({ checkErrors: true, formating: true });

const rules = useValidateCreateRules(inputs);
const state = useValidateCreateState(inputs);

const forceSendValue = ref(false);

const handleCheckError = computed(() => async (checked: boolean) => {
  if (checked && !settings.formating) settings.formating = true;
  settings.checkErrors = !settings.checkErrors;
  await nextTick();
  forceSendValue.value = true;
  v$.value.$validate();
});

const handleFormating = computed(() => async (checked: boolean) => {
  if (!checked && settings.checkErrors) settings.checkErrors = false;

  settings.formating = !settings.formating;
  await nextTick();
  forceSendValue.value = true;
  // v$.value.$validate();
});

const handleChangeInput = (value: string, name: string) => {
  state[name] = value;
};

const v$ = useVuelidate(rules, state);

const resetForm = () => {
  Object.keys(state).forEach((key) => {
    state[key] = "";
  });
};

const sendForm = () => {
  v$.value.$validate();
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
                :mask="settings.formating ? input.mask : ''"
                :type="input.type"
                :name="input.name"
                :input-mode="settings.formating ? input.inputMode : 'text'"
                :errors="settings.checkErrors ? v$[input.name].$errors : []"
                :validate-rules="input.validateRules"
                :mask-token="input.maskToken"
                :value="state[input.name]"
                :force-send-value="forceSendValue"
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
        <Checkbox :checked="settings.checkErrors" @handle-change="(checked: boolean) => handleCheckError(checked)" />
      </div>
      <div class="flex w-full items-center justify-between px-4 py-2">
        <span>{{ FORMATING }}</span>
        <Checkbox :checked="settings.formating" @handle-change="(checked: boolean) => handleFormating(checked)" />
      </div>
    </div>
    <div class="flex justify-between">
      <Button :label="RESET" @click="resetForm" color="secondary" type="outline" icon="ri-refresh-line" icon-position="start" />
      <Button :label="ADD" @click="sendForm" color="primary" type="basic" icon="ri-arrow-right-s-line" icon-position="end" />
    </div>
  </div>
</template>