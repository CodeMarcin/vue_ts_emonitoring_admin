<script setup lang="ts">
import { reactive, ref, onBeforeMount } from "vue";
import { doc, getDocs, deleteDoc, query, orderBy, where, writeBatch } from "@firebase/firestore";
import type { IContractorsResponse } from "@/api/Types";

import { COLLECTION__CONTRACTORS, COLLECTION__INVOICES, FIREBASE_DB } from "@/firebase";

import Button from "@/components/parts/Button/Button.vue";
import Modal from "@/components/parts/Modal/Modal.vue";
import Checkbox from "@/components/parts/Checkbox/Checkbox.vue";
import LoaderDefault from "@/loaders/LoaderDefault.vue";

import { EDIT, DELETE, ADD_INVOICE, ADDRES_START, NIP, NO, YES, CONFIRM_DELETE, DELETE_RELATED_INVOICES } from "@/data/labels/LabelsGlobal";

const contractors = reactive<IContractorsResponse[]>([]);
const loading = ref<boolean>(false);
const showModal = ref<boolean>(false);
const deleteContractorId = ref<string>();
const deleteContractorInvoices = ref<boolean>(true);

const getAndSetContractors = async (clear = false) => {
  try {
    loading.value = true;
    const contractorsApiData = await getDocs(query(COLLECTION__CONTRACTORS, orderBy("createDate", "desc")));
    if (clear) contractors.splice(0);
    contractorsApiData.forEach((el) => contractors.push({ ...(el.data() as IContractorsResponse), _id: el.id }));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteContractor = async () => {
  try {
    loading.value = true;
    await deleteDoc(doc(COLLECTION__CONTRACTORS, deleteContractorId.value));
    if (deleteContractorInvoices.value) {
      const FIREBASE_BATCH = writeBatch(FIREBASE_DB);
      const invoicesToDelete = await getDocs(query(COLLECTION__INVOICES, where("contractor.selectedId", "==", deleteContractorId.value)));
      invoicesToDelete.forEach((el) => {

        FIREBASE_BATCH.delete(el.ref);
      });
      await FIREBASE_BATCH.commit();
    }
    await getAndSetContractors(true);
    toggleModal();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleChangeDeleteInvoices = (checked: boolean) => {
  deleteContractorInvoices.value = checked;
};

const toggleModal = (id?: string) => {
  if (id) deleteContractorId.value = id;
  if (showModal.value && !deleteContractorInvoices.value) deleteContractorInvoices.value = true;
  showModal.value = !showModal.value;
};

onBeforeMount(() => {
  getAndSetContractors();
});
</script>

<template>
  <div v-if="!loading" class="flex flex-col divide-y-2 border shadow-lg">
    <div v-for="contractor in contractors" :key="contractor._id" class="flex flex-col gap-y-2 p-2 md:gap-y-0">
      <div class="flex w-full items-center justify-between">
        <div class="flex w-2/3 flex-col gap-y-2 text-sm font-semibold">{{ contractor.name }}</div>
        <div class="flex w-1/3 justify-end gap-x-4">
          <div class="flex md:hidden">
            <Button type="tooltip" outline color="error" icon="ri-more-2-fill">
              <template #tooltip>
                <router-link to="" class="flex items-center gap-x-2 p-2">
                  <i class="ri-edit-2-line"></i> <span class="text-xs font-semibold">{{ EDIT }}</span>
                </router-link>
                <router-link to="" class="flex items-center gap-x-2 p-2">
                  <i class="ri-file-add-line"></i> <span class="text-xs font-semibold">{{ ADD_INVOICE }}</span>
                </router-link>
                <div class="bg-error-700 flex items-center gap-x-2 p-2 text-white" @click="() => toggleModal(contractor._id)">
                  <i class="ri-delete-bin-line"></i> <span class="text-xs font-semibold">{{ DELETE }}</span>
                </div>
              </template>
            </Button>
          </div>
          <div class="hidden md:flex md:gap-x-4">
            <Button outline type="icon" icon="ri-edit-2-line" />
            <Button outline type="icon" icon="ri-file-add-line" />
            <Button type="icon" color="error" icon="ri-delete-bin-line" @handle-click="() => toggleModal(contractor._id)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1 text-xs font-semibold text-gray-600 md:flex-row md:justify-start md:divide-x-2">
        <div class="flex flex-wrap gap-x-1">
          <span>{{ ADDRES_START }}</span>
          <span>{{ contractor.address }}</span> <span>{{ contractor.zipcode }}</span> <span>{{ contractor.city }}</span>
          <span v-if="contractor.email">{{ contractor.email }}</span>
        </div>
        <div class="flex gap-x-1 md:pl-1">
          <span class="font-extrabold">{{ NIP }}:</span>
          <span>{{ contractor.nip }}</span>
        </div>
      </div>
    </div>
  </div>

  <Modal v-if="showModal" :close-modal-fnc="toggleModal">
    <template #icon>
      <i class="ri-question-line text-gray-400"></i>
    </template>
    <template #content>
      <div class="flex w-full flex-col gap-y-2">
        <div class="w-11/12">
          {{ CONFIRM_DELETE }}
          <span class="font-extrabold">{{ contractors.find((el) => el._id === deleteContractorId)?.name }}</span>
          ?
        </div>
        <div class="flex w-full justify-between">
          {{ DELETE_RELATED_INVOICES }}
          <Checkbox :checked="deleteContractorInvoices" @handle-change="(checked: boolean) => handleChangeDeleteInvoices(checked)" />
        </div>
      </div>
    </template>
    <template #bottom>
      <div class="flex justify-between">
        <Button :label="NO" outline type="basic" @handle-click="toggleModal" />
        <Button :label="YES" type="basic" icon-position="end" :disabled="loading" :is-loading="loading" color="error" @handle-click="deleteContractor" />
      </div>
    </template>
  </Modal>

  <LoaderDefault v-if="loading" />
</template>
