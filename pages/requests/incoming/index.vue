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
          <th>Requester Company</th>
          <th>Requested Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in requests"
          :key="item.pcfId + item.requesterEmail"
          class="hover"
        >
          <td class="font-bold">{{ item.pcfId }}</td>
          <td>{{ item.requesterCompany }}</td>
          <td>{{ formatDate(item.dateRequested) }}</td>
          <td>
            <span :class="statusClass(item.requestStatus)">
              {{ item.requestStatus }}
            </span>
          </td>
          <td>
            <NuxtLink
              :to="`/requests/incoming/manage/${encodeURIComponent(
                item.requestId
              )}`"
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
import { ref, onMounted, inject } from "vue";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import DataViewPaginate from "~/components/DataViewPaginate.vue";
import type { MandeInstance } from "mande";
import type { Authenticator } from "~/global";

useBreadcrumb("Incoming Requests");

type RequestAccess = {
  pcfId: string;
  requesterCompany: string;
  requesterEmail: string;
  dateProcessed: string;
  dateRequested: string;
  message: string;
  requestStatus: string;
  version: number;
};

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;

const requests = ref<RequestAccess[]>([]);

onMounted(async () => {
  try {
    const response = await api.get<{ requests: RequestAccess[] }>("/request", {
      query: { userType: "owner" },
    });
    requests.value = response.requests;
  } catch (error) {
    console.error("Failed to fetch requests", error);
  }
});

function formatDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}

function statusClass(status: string): string {
  switch (status) {
    case "approved":
      return "font-bold text-success capitalize";
    case "pending":
      return "font-bold text-warning capitalize";
    case "rejected":
      return "font-bold text-error capitalize";
    default:
      return "font-bold text-error capitalize";
  }
}
</script>
