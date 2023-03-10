<script setup lang="ts">
import { reactive, ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router";

import Panel from "@/components/parts/Panel/Panel.vue";
import Input, { type InterfaceInput } from "@/components/parts/Input/Input.vue";
import Button from "@/components/parts/Button/Button.vue";

import useVuelidate from "@vuelidate/core";
import { useValidateCreateRules } from "@/use/useValidateCreateRules";

import { OBJECT__LOGIN } from "@/data/objects/ObjectLogin";

import { LOGIN } from "@/data/labels/LabelsGlobal";

export interface ILoginPanel {
  login: string;
  password: string;
}

const initialState: ILoginPanel = {
  login: "",
  password: "",
};

const inputs = reactive(OBJECT__LOGIN);
const rules = useValidateCreateRules(inputs);
const state = reactive(initialState);
const error = ref(false);

const handleChangeInput = (value: string, name: keyof ILoginPanel) => {
  if (error) error.value = false;
  state[name] = value;
};

const v$ = useVuelidate(rules, state);

const handleLogin = async () => {
  const validation = await v$.value.$validate();

  if (validation) {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, state.login, state.password);
      router.push("/");
    } catch (err) {
      error.value = true;
    }
  }
};
</script>

<template>
  <div class="container flex">
    <Panel>
      <template #header>Panel logowania</template>
      <template #content>
        <div class="flex w-full flex-wrap gap-x-10 gap-y-4">
          <div v-for="input in inputs" :key="input.id" class="flex w-full">
            <Input
              :id="input.id"
              :label="input.label"
              :type="input.type"
              :name="input.name"
              :value="state[input.name as keyof typeof state]"
              :input-mode="input.inputMode"
              :errors="v$[input.name].$errors"
              :validate-rules="input.validateRules"
              :mask-token="input.maskToken"
              :pending="v$[input.name].$pending"
              @handle-change="(e, name) => handleChangeInput(e, name)"
            />
          </div>
          <div v-if="error" class="flex w-full justify-center font-medium text-red-600">B????dny login lub has??o</div>
          <div class="flex w-full justify-center">
            <Button
              :label="LOGIN"
              color="primary"
              type="basic"
              icon="ri-login-circle-line"
              icon-position="end"
              :is-loading="v$.$pending"
              @handle-click="handleLogin"
            />
          </div>
        </div>
      </template>
    </Panel>
  </div>
</template>
