<template>
  <DataViewPaginate class="min-h-[60vh]">
    <template #title>
      <div class="flex justify-between space-x-3 px-3">
        <h3 class="card-title font-bold">Incoming Requests</h3>
      </div>
      <hr />
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>PCF ID</th>
          <th>Data Owner Company</th>
          <th>Data Owner Email</th>
          <th>Requested Date</th>
          <th>Requested Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in requests" :key="item.requestId" class="hover">
          <td>{{ item.pcfId }}</td>
          <td>{{ item.dataOwnerCompany }}</td>
          <td>{{ item.dataOwnerEmail }}</td>
          <td>{{ formatDate(item.dateRequested) }}</td>
          <td>
            <span
              class="font-bold"
              :class="{
                'text-success': item.requestStatus === 'approved',
                'text-error': item.requestStatus === 'denied',
                'text-warning': item.requestStatus === 'pending',
              }"
            >
              {{ item.requestStatus }}
            </span>
          </td>
          <td>
            <NuxtLink
              :to="`/me/incoming/manage/${item.requestId}`"
              class="link text-blue-600"
              style="display: block; width: 5rem"
            >
              <p>View detail</p>
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </DataViewPaginate>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import DataViewPaginate from "~/components/DataViewPaginate.vue";
import type { RequestAccess } from "~/composables/useMande";
import type { Authenticator } from "~/global";

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;

const requests = ref<RequestAccess[]>([]);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // or use any other date formatting method
};

onMounted(async () => {
  const response = await api.get<{ requests: RequestAccess[] }>("/request", {
    query: { userType: "requestor" },
  });
  requests.value = response.requests;
});
</script>
