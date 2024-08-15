<template>
  <div class="min-h-screen">
    <div v-if="loading" class="text-center py-5">
      <span>Loading request details...</span>
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-5">
      <span>{{ error }}</span>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-5">
      <DataViewPaginate v-if="request">
        <template #title>
          <h3 class="card-title font-bold">Request Detail:</h3>
          <hr />
        </template>

        <div class="space-y-3">
          <p>
            <strong>Requester's Company:</strong> {{ request.requesterCompany }}
          </p>
          <p>
            <strong>Requester's Email:</strong> {{ request.requesterEmail }}
          </p>
          <p>
            <strong>Seeking permission for PCF ID: </strong>{{ request.pcfId }}
          </p>
          <p>
            <strong>Request Status: </strong>
            <span
              :class="{
                'text-error capitalize font-bold':
                  request.requestStatus === 'denied',
                'text-warning capitalize font-bold':
                  request.requestStatus === 'pending',
                'text-success capitalize font-bold':
                  request.requestStatus === 'approved',
              }"
            >
              {{ request.requestStatus }}
            </span>
          </p>
          <p><strong>Message:</strong></p>
          <div class="form-control">
            <p rows="3" class="textarea textarea-bordered">
              {{ request.message }}
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between py-3 px-4">
            <div class="grid place-content-center">
              <strong>Action to do:</strong>
            </div>

            <div class="flex space-x-3">
              <button
                class="btn btn-primary btn-sm"
                @click="handleAccept"
                :disabled="loadingAccept"
              >
                <span v-if="loadingAccept" class="loader animate-spin"></span>
                <span v-else>Accept</span>
              </button>
              <button
                class="btn btn-error btn-sm"
                @click="handleDeny"
                :disabled="loadingDeny"
              >
                <span v-if="loadingDeny" class="loader animate-spin"></span>
                <span v-else>Deny</span>
              </button>
            </div>
          </div>
        </template>
      </DataViewPaginate>

      <DataViewPaginate>
        <template #title>
          <h3 class="card-title font-bold">Request on this PCF:</h3>
          <hr />
        </template>

        <table class="table">
          <thead>
            <tr>
              <th><strong>Requester Name</strong></th>
              <th><strong>Requester Date</strong></th>
              <th><strong>Manage Access</strong></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="i of new Array(3)" class="hover">
              <th>Company A</th>
              <td>07/05/2024</td>
              <td class="space-x-2">
                <button class="btn btn-xs btn-circle btn-error">
                  <Icon
                    name="material-symbols:close"
                    class="size-4 text-white"
                  />
                </button>
                <button class="btn btn-xs btn-circle btn-success">
                  <Icon
                    name="material-symbols:check"
                    class="size-4 text-white"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </DataViewPaginate>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import type { Authenticator } from "~/global";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

useBreadcrumb("Request Detail");

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;

const request = ref<REQUEST | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const loadingAccept = ref(false); // loading state for accept
const loadingDeny = ref(false); // loading state for deny

const getRequesterId = (requestId: string) => {
  const parts = requestId.split(",");
  return parts[1] || ""; // Return the second part if it exists
};

onMounted(async () => {
  try {
    const { requests } = await api.get<{ requests: REQUEST[] }>("/request", {
      query: { userType: "owner", requestId: id },
    });

    if (requests.length > 0) {
      request.value = requests[0];
    } else {
      error.value = "No request found.";
    }
  } catch (err) {
    error.value = "Failed to fetch request data.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const handleAccept = async () => {
  try {
    loadingAccept.value = true;
    const requesterId = getRequesterId(id);
    await api.patch(`/request/${id}`, {
      requestStatus: "approved",
      requesterId,
    });
    request.value!.requestStatus = "approved"; // Update status locally
    router.push("/requests/incoming");
  } catch (err) {
    error.value = "Failed to update request status.";
    console.error(err);
  } finally {
    loadingAccept.value = false;
  }
};

const handleDeny = async () => {
  try {
    loadingDeny.value = true;
    const requesterId = getRequesterId(id);
    await api.patch(`/request/${id}`, {
      requestStatus: "denied",
      requesterId,
    });
    request.value!.requestStatus = "denied"; // Update status locally
    router.push("/requests/incoming");
  } catch (err) {
    error.value = "Failed to update request status.";
    console.error(err);
  } finally {
    loadingDeny.value = false;
  }
};
</script>

<style>
/* Optional: Style the loader */
.loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  width: 14px;
  height: 14px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
