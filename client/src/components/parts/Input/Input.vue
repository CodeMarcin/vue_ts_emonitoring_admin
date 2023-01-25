<script setup lang="ts">
import { watchEffect, defineEmits, computed, reactive } from "vue";
import { vMaska } from "maska";
import type { MaskaDetail } from "maska";
import type { ErrorObject, ValidationRuleWithoutParams, ValidationRuleWithParams } from "@vuelidate/core";
import Spinner from "../Spinner/Spinner.vue";

export type InputType = "text" | "email" | "date" | "number" | "password";
export type InputMode = "text" | "numeric";
export type InputHandleType = "keyup" | "change";

// *** Need for later ***//
// export type HTMLElementEvent<T extends HTMLElement> = Event & {
//   target: T;
// };

export interface InterfaceInput {
  id?: string;
  groupName?: string;
  name: string;
  type?: InputType;
  inputMode?: InputMode;
  label: string;
  value?: string | number | Date;
  mask?: string;
  maskToken?: string;
  errors?: ErrorObject[];
  validateRules?: { [key: string]: ValidationRuleWithoutParams | ValidationRuleWithParams };
  forceSendValue?: boolean;
  pending?: boolean;
  parentName?: string;
  handleType?: InputHandleType;
}

const props = withDefaults(defineProps<InterfaceInput>(), {
  type: "text",
  inputMode: "text",
  handleType: "keyup",
});

const maskaObject = reactive<MaskaDetail>({ completed: false, masked: "", unmasked: "" });

const isRequired = computed(() => {
  if (props.validateRules)
    return Object.keys(props.validateRules as { [key: string]: ValidationRuleWithoutParams | ValidationRuleWithParams }).some((el) => el === "required");
  else return false;
});

const labelClass = computed(() => (props.errors?.length ? "text-red-600" : "peer-focus:text-blue-600 "));
const inputClass = computed(() => (props.errors?.length ? "border-red-600 focus:border-red-600" : " focus:border-blue-600"));

const emit = defineEmits(["handleChange", "forceEnd"]);

const handleChange = () => {

  if (props.parentName) emit("handleChange", maskaObject.masked, props.name, props.parentName);
  else emit("handleChange", maskaObject.masked, props.name);
};

watchEffect(async () => {
  if (props.forceSendValue) {
    emit("forceEnd");
    handleChange();
  }
});
</script>
<template>
  <div class="relative w-full">
    <input
      :id="props.name"
      :type="props.type"
      :value="props.value"
      :class="[inputClass, 'input peer']"
      v-maska="maskaObject"
      :data-maska="props.mask"
      :data-maska-tokens="props.maskToken"
      data-maska-eager
      :inputmode="props.inputMode"
      @keyup="handleChange"
      @change="handleChange"
      placeholder=" "
    />
    <Spinner v-if="props.pending" class="absolute right-2 top-6" />
    <label :for="props.name" :class="[labelClass, 'input-label']"><sup v-if="isRequired" class="mr-1">*</sup>{{ props.label }}</label>
    <p v-if="errors?.length" class="mt-2 flex w-full flex-col items-end gap-y-2 text-red-600">
      <span v-for="error in errors" class="flex items-center gap-x-1 text-xs font-medium" :key="error.$uid">
        <i class="ri-error-warning-line"></i>{{ error.$message }}
      </span>
    </p>
  </div>
</template>
