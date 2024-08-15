<template>
  <div class="container">
    <DataViewPaginate v-if="pcf">
      <template #title>
        <h3 class="card-title font-bold">PCF Details</h3>
        <hr />
      </template>

      <div class="content">
        <!-- Table Section -->
        <div class="table-section">
          <table>
            <tr>
              <th>PCF ID:</th>
              <td>{{ pcf.pcfId }}</td>
            </tr>
            <tr>
              <th>Product ID:</th>
              <td>{{ pcf.productId }}</td>
            </tr>
            <tr>
              <th>Product Name:</th>
              <td>{{ pcf.productName }}</td>
            </tr>
            <tr>
              <th>Amount:</th>
              <td>{{ pcf.amount }}</td>
            </tr>
            <tr>
              <th>Emission per Unit:</th>
              <td>{{ pcf.emissionPerUnit }} tCO2</td>
            </tr>
            <tr>
              <th>Version:</th>
              <td>{{ pcf.version }}</td>
            </tr>
            <tr>
              <th>Status:</th>
              <td>
                <span :class="statusClass">{{ pcf.pcfStatus }}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Approved Recipients Section -->
        <div class="recipients-section">
          <h1>Approved Recipients:</h1>
          <ul class="approved-recipients-list">
            <li v-if="approvedRecipients.length === 0">None</li>
            <li v-for="(recipient, index) in approvedRecipients" :key="index">
              {{ recipient }}
            </li>
          </ul>
        </div>
      </div>

      <template #footer>
        <div class="footer">
          <div>
            <button class="btn btn-sm" @click="router.back()">Go Back</button>
          </div>

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
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import { notify } from "~/components/Alert.vue";
import type { Authenticator } from "~/global";

const { id } = useRoute().params;
const router = useRouter();

useBreadcrumb("PCF Detail");

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;
const pcf = ref<PCF>();

onMounted(async () => {
  const { pcfs } = await api
    .get<{ pcfs: PCF[] }>("/pcf", {
      query: { isDataOwner: true, pcfId: id },
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
  }).then(() => {
    notify({
      icon: "fa:paper-plane",
      message: "PCF marked as deprecated",
      mode: "success",
    })

    pcf.value!.pcfStatus = 'deprecated'
  });
};

// Computed property to determine the class for the status
const statusClass = computed(() => {
  switch (pcf.value?.pcfStatus) {
    case "active":
      return "text-success font-bold capitalize";
    case "deprecated":
      return "text-error font-bold capitalize";
    default:
      return "text-warning font-bold capitalize"; // Optional for other statuses
  }
});

// Computed property to handle approvedRecipients as an array of strings
const approvedRecipients = computed(() => {
  return pcf.value?.approvedRecipients || [];
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height of the viewport */
}

.content {
  display: flex;
  flex: 1; /* Take up remaining space */
  overflow: auto; /* Allow scrolling if content overflows */
}

.table-section,
.recipients-section {
  flex: 1;
  margin: 1rem;
}

.table-section {
  margin-right: 0.5rem; /* Space between table and recipients section */
}

.recipients-section {
  margin-left: 0.5rem; /* Space between table and recipients section */
  max-height: 100%; /* Ensure it fits within available space */
  overflow-y: auto; /* Make it scrollable if content overflows */
}

table {
  font-size: 1rem;
  width: 100%;
}

th {
  text-align: left;
  vertical-align: top;
  @apply px-3 py-2;
}

.approved-recipients-list {
  list-style-type: decimal;
  margin: 0;
  padding-left: 20px; /* Align with the table */
}

.approved-recipients-list li {
  margin-left: 0; /* Remove left margin if necessary */
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}
</style>
