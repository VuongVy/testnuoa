<template>
  <DataViewPaginate class="min-h-[60vh]">
    <template #title>
      <div class="flex justify-between space-x-3 px-3">
        <h3 class="card-title font-bold">Shared With Me</h3>
        <NuxtLink to="/me/published/create" class="btn btn-sm btn-success"
          >New PCF</NuxtLink
        >
      </div>
      <hr />
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>PCF ID</th>
          <th>Product Name</th>
          <th>Company Name</th>
          <th>Date Published</th>
          <th>Version</th>
          <th>PCF Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="pcf of pcfs"
          class="hover cursor-pointer"
          @click="navigateTo(`/me/shared/${pcf.pcfId}`)"
        >
          <th>{{ pcf.pcfId }}</th>
          <td>{{ pcf.productName }}</td>
          <td>{{ pcf.company }}</td>
          <td>{{ pcf.datePublished }}</td>
          <td>{{ pcf.version }}</td>
          <td>
            <a class="text-success font-bold" v-if="pcf.pcfStatus === 'active'"
              >Active</a
            >
            <a
              class="text-error font-bold"
              v-else-if="pcf.pcfStatus === 'deprecated'"
              >Deprecated</a
            >
            <a class="text-warning" v-else>{{ pcf.pcfStatus }}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </DataViewPaginate>
</template>

<script lang="ts" setup>
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import DataViewPaginate from "~/components/DataViewPaginate.vue";
import type { Authenticator } from "~/global";

useBreadcrumb("PCF Shared With Me");

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;

const pcfs = ref<PCF[]>([]);

onMounted(async () => {
  const response = await api.get<{ pcfs: PCF[] }>("/pcf", {
    query: { isSharedWithMe: "true" },
  });

  pcfs.value = response.pcfs;
});
</script>
