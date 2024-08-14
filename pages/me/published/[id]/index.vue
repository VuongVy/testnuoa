<template>
  <div>
    <DataViewPaginate v-if="pcf">
      <template #title>
      </template>

      <!-- Use the PCF component and pass the pcf data -->
      <PCFComponent :pcf="pcf" />

      <template #footer>
        <div class="py-3 px-4 flex justify-between">
          <button class="btn btn-sm" @click="router.back()">Go Back</button>

          <div class="flex space-x-3">
            <button class="btn btn-sm btn-error" @click="markAsDeprecated">
              Mark deprecated
            </button>
            <NuxtLink
              :to="`/me/published/${id}/update`"
              class="btn btn-sm btn-success"
              >Update PCF</NuxtLink
            >
          </div>
        </div>
      </template>
    </DataViewPaginate>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import type { Authenticator } from "~/global";
import type { PCF as PCFType } from "~/composables/useMande";
import PCFComponent from "~/components/PCF.vue"; // Import the PCF component with a distinct name

const { id } = useRoute().params;
const router = useRouter();

useBreadcrumb("PCF Detail");

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;
const pcf = ref<PCFType>();

onMounted(async () => {
  const { pcfs } = await api
    .get<{ pcfs: PCFType[] }>("/pcf", {
      query: { pcfId: id },
    })
    .catch(() => ({ pcfs: [] }));

  pcf.value = pcfs[0];

  if (!pcf.value) {
    router.push("/me/published");
  }
});

const markAsDeprecated = async () => {
  await api.put(`/pcf/${id}`, {
    pcfId: id,
    version: pcf.value!.version || "1",
    pcfStatus: "deprecated",
  });
};
</script>

<style scoped>
table {
  font-size: 1rem;
}

th {
  text-align: left;
  @apply px-3 py-2;
}
</style>
