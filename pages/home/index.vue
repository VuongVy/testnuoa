<template>
  <DataViewPaginate title="Newly Published PCFs">
    <table v-if="pcfs.length > 0" class="table table-sm">
      <!-- head -->
      <thead>
        <tr>
          <th>PCF ID</th>
          <th>Product Name</th>
          <th>Company</th>
          <th>Published Date</th>
          <th>PCF Status</th>
          <th>Version</th>
        </tr>
      </thead>
      <tbody class="cursor-pointer">
        <tr
          v-for="(item, i) of pcfs"
          :key="item.pcfId"
          class="hover"
          @click="navigateTo('/home/' + item.pcfId)"
        >
          <td class="font-bold">{{ item.pcfId }}</td>
          <td>{{ item.productName }}</td>
          <td>{{ item.company }}</td>
          <td>{{ item.datePublished }}</td>
          <td>
            <span
              class="font-bold capitalize"
              :class="{
                'text-success': item.pcfStatus === 'active',
                'text-error': item.pcfStatus === 'deprecated',
              }"
            >
              {{ item.pcfStatus }}
            </span>
          </td>
          <td>{{ item.version }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center">
      😢 No new PCF today. Please check back later!
    </p>
  </DataViewPaginate>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import DataViewPaginate from "~/components/DataViewPaginate.vue";
import type { Authenticator } from "~/global";

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;

const pcfs = ref([]);

onMounted(async () => {
  try {
    const response = await api.get<{ pcfs: any[] }>("/pcf", {
      query: { isDataOwner: "false", publishedToday: "true" },
    });

    if (response.pcfs && response.pcfs.length > 0) {
      pcfs.value = response.pcfs;
    } else {
      console.log("No PCFs found matching the query");
    }
  } catch (error) {
    console.error("Error fetching PCFs:", error);
  }
});

const navigateTo = (path: string) => {
  // Navigation logic, e.g., using vue-router
  console.log("Navigating to:", path);
};
</script>
