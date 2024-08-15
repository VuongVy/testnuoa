<template>
  <div class="min-h-screen">
    <transition name="fade" appear>
      <div
        v-if="status?.success"
        role="alert"
        class="alert bg-green-200 shadow my-3"
      >
        <Icon
          name="fa:paper-plane"
          class="text-success size-7"
          @click="clearStatus"
        />
        <span>{{ status.message }}</span>
        <button class="btn btn-sm btn-ghost btn-circle" @click="clearStatus">
          <Icon name="ic:close" class="size-6" />
        </button>
      </div>

      <div
        v-else-if="status?.success === false"
        role="alert"
        class="alert bg-red-200 shadow my-3"
      >
        <Icon
          name="fa:paper-plane"
          class="text-error size-7"
          @click="clearStatus"
        />
        <span>{{ status.message }}</span>
        <button class="btn btn-sm btn-ghost btn-circle" @click="clearStatus">
          <Icon name="ic:close" class="size-6" />
        </button>
      </div>
    </transition>

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
          <p><strong>To:</strong> {{ request.dataOwnerCompany }}</p>
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
          <div class="relative tooltip-container">
            <p
              ref="messageElement"
              :class="{
                'textarea textarea-bordered': true,
                'cursor-not-allowed': request.requestStatus === 'approved',
              }"
              rows="3"
              :contenteditable="request.requestStatus !== 'approved'"
              class="textarea-bordered"
              @input="updateMessage"
            >
              {{ request.message }}
            </p>
            <div
              v-if="request.requestStatus === 'approved'"
              class="tooltiptext"
            >
              You have been approved to this PCF, resend is not allowed.
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between py-3 px-4">
            <div class="grid place-content-center">
              <strong>Action to do:</strong>
            </div>

            <div class="flex space-x-3">
              <div class="tooltip-container">
                <button
                  class="btn btn-primary btn-sm"
                  @click="handleResend"
                  :disabled="request.requestStatus === 'approved'"
                >
                  <span v-if="loadingResend" class="loader animate-spin"></span>
                  <span v-else>Resend Request</span>
                </button>
                <span
                  v-if="request.requestStatus === 'approved'"
                  class="tooltiptext"
                >
                  You have been approved to this PCF, resend is not allowed.
                </span>
              </div>
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
import { ref, onMounted, inject, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import type { Authenticator } from "~/global";
import type { REQUEST } from "~/types";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

useBreadcrumb("Request Detail");

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;

const request = ref<REQUEST | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const loadingResend = ref(false); // loading state for resend
const status = ref<{ success: boolean; message: string } | null>(null);

const messageElement = ref<HTMLElement | null>(null); 

const getRequesterId = (requestId: string) => {
  const parts = requestId.split(",");
  return parts[1] || "";
};

const updateMessage = () => {
  if (messageElement.value) {
    request.value!.message = messageElement.value.innerText;
  }
};

const clearStatus = () => {
  status.value = null;
};

onMounted(async () => {
  try {
    const { requests } = await api.get<{ requests: REQUEST[] }>("/request", {
      query: { userType: "requestor", requestId: id },
    });

    if (requests.length > 0) {
      request.value = requests[0];
      nextTick(() => {
        if (messageElement.value) {
          messageElement.value.innerText = request.value!.message;
        }
      });
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

const handleResend = async () => {
  if (!request.value) {
    console.error("No request data available.");
    return;
  }

  try {
    loadingResend.value = true;
    const newMessage = request.value.message || "";
    const version = request.value.version;

    // Send request with message and version
    const response = await api.put(`/request/${id}`, {
      message: newMessage,
      version, 
    });

    // Update the request state with the new message
    request.value.message = newMessage;

    // Show success alert
    status.value = { success: true, message: "Request resend successfully" };
  } catch (err) {
    error.value = "Failed to resend request.";
    console.error("Error while resending request:", err);
    // Show error alert
    status.value = { success: false, message: "Failed to resend request." };
  } finally {
    loadingResend.value = false;
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

/* Tooltip Styles */
.tooltip-container {
  position: relative;
  display: inline-block;
  width: 100%; /* Ensure tooltip container takes full width */
}

.tooltiptext {
  visibility: hidden;
  width: 250px; /* Adjust width as needed */
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Adjust positioning to ensure tooltip is above */
  left: 50%; /* Center tooltip relative to container */
  transform: translateX(-50%); /* Center tooltip horizontally */
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-container:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Ensure the textarea takes up the full width of its container */
.relative textarea {
  width: 100%; /* Make sure textarea takes full width */
  box-sizing: border-box; /* Include padding and border in width calculation */
}
</style>
