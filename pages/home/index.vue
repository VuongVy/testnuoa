<template>
  <DataViewPaginate title="Newly Published PCF">
    <table class="table table-sm">
      <!-- head -->
      <thead>
        <tr>
          <th>PCF ID</th>
          <th>Product Name</th>
          <th>Data Owner</th>
          <th>Version</th>
          <th>Date Published</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody class="cursor-pointer">
        <tr
          v-for="(item, i) of pcfs"
          class="hover"
          @click="navigateTo('/home/' + item.pcfId)"
        >
          <td>{{ item.pcfId }}</td>
          <td>{{ item.productName }}</td>
          <td>{{ item.company }}</td>
          <td>{{ item.version }}</td>
          <td>{{ formatDate(item.datePublished) }}</td>
          <td>
            <span
              class="font-bold"
              :class="{
                'text-success': item.pcfStatus === 'active',
                'text-error': item.pcfStatus === 'deprecated',
                'text-warning': item.pcfStatus === 'pending',
              }"
            >
              {{ item.pcfStatus }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </DataViewPaginate>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import DataViewPaginate from "~/components/DataViewPaginate.vue";
import { useMande, type PCF } from "~/composables/useMande";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { Authenticator } from "~/global";

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;

const pcfs = ref<PCF[]>([]);

const formatDate = (dateString: string) => {
  return dateString.split("-").reverse().join("/"); // Converts YYYY-MM-DD to DD/MM/YYYY
};

onMounted(async () => {
  try {
    const response = await api.get<{ pcfs: PCF[] }>("/pcf", {
      query: { isDataOwner: "false", publishedToday: "true" },
    });
    pcfs.value = response.pcfs;
  } catch (error) {
    console.error("Error fetching PCFs:", error);
    // Optionally, handle the error, e.g., show a notification to the user
  }
});
</script>
