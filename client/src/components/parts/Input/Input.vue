<script setup lang="ts">
import { watchEffect, defineEmits, computed, reactive } from "vue";
import { vMaska } from "maska";
import type { MaskaDetail } from "maska";
import type { ErrorObject, ValidationRuleWithoutParams, ValidationRuleWithParams } from "@vuelidate/core";

export type InputType = "text" | "email";
export type InputMode = "text" | "numeric";

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
  value?: string;
  label: string;
  mask?: string;
  maskToken?: string;
  errors?: ErrorObject[];
  validateRules?: ValidationRuleWithoutParams | ValidationRuleWithParams;
  forceSendValue?: boolean;
}

const props = withDefaults(defineProps<InterfaceInput>(), {
  type: "text",
  inputMode: "text",
});

const maskaObject = reactive<MaskaDetail>({ completed: false, masked: "", unmasked: "" });

const isRequired = computed(() => Object.keys(props.validateRules as ValidationRuleWithoutParams).some((el) => el === "required"));

const labelClass = computed(() => (props.errors?.length ? "text-red-600" : "peer-focus:text-blue-600 "));
const inputClass = computed(() => (props.errors?.length ? "border-red-600 focus:border-red-600" : " focus:border-blue-600"));

const emit = defineEmits(["handleChange", "forceEnd"]);

const handleChange = () => {
  emit("handleChange", maskaObject.masked, props.name);
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
      :class="[inputClass, 'input peer']"
      v-maska="maskaObject"
      :data-maska="props.mask"
      :data-maska-tokens="props.maskToken"
      data-maska-eager
      :value="value"
      :inputmode="props.inputMode"
      @change="handleChange"
      placeholder=" "
    />
    <label :for="props.name" :class="[labelClass, 'input-label']"><sup v-if="isRequired" class="mr-1">*</sup>{{ props.label }}</label>
    <p v-if="errors?.length" class="mt-2 flex w-full flex-col items-end gap-y-2 text-red-600">
      <span v-for="error in errors" class="flex items-center gap-x-1 text-xs font-medium" :key="error.$uid"
        ><i class="ri-error-warning-line"></i>{{ error.$message }}</span
      >
    </p>
  </div>
</template>
