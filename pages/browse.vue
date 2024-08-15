<template>
  <transition name="fade" appear>
    <div
      v-if="status?.success"
      role="alert"
      class="alert bg-green-200 shadow my-3"
    >
      <Icon
        name="fa:paper-plane"
        class="text-success size-7"
        @click="status = undefined"
      />

      <span>{{ status.message }}</span>

      <button class="btn btn-sm btn-ghost btn-circle">
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
        @click="status = undefined"
      />

      <span>{{ status.message }}</span>

      <button class="btn btn-sm btn-ghost btn-circle">
        <Icon name="ic:close" class="size-6" />
      </button>
    </div>
  </transition>

  <DataViewPaginate class="min-h-[60vh]">
    <template #title>
      <div class="flex space-x-3">
        <h3 class="card-title">Available PCFs</h3>
        <label class="input input-bordered input-sm flex items-center gap-2">
          <input
            type="text"
            class="grow"
            placeholder="Search"
            @keypress.enter="console.log('searching')"
          />
          <Icon name="ic:search" />
        </label>
      </div>
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>PCF ID</th>
          <th>Product Name</th>
          <th>Data Owner</th>
          <th>Version</th>
          <th>Published Date</th>
          <th>PCF Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in pcfs" :key="item.pcfId" class="hover">
          <th>{{ item.pcfId }}</th>
          <td>{{ item.productName }}</td>
          <td>{{ item.company }}</td>
          <td>{{ item.version }}</td>
          <td>
            {{
              item.datePublished
                .split("-")
                .reverse()
                .map((it) => +it)
                .join("/")
            }}
          </td>
          <td :class="statusClass(item.pcfStatus)">
            {{ item.pcfStatus }}
          </td>
          <td v-if="user?.userId !== item.dataOwnerId">
            <a
              class="link text-blue-600"
              @click="requester!.open(item.pcfId, item.version, user?.userId!)"
              >Request Access</a
            >
            <!-- <span class="text-yellow-500">Pending</span> -->
          </td>
          <td v-else>---</td>
        </tr>
      </tbody>
    </table>
  </DataViewPaginate>

  <Teleport to="body">
    <RequestDialog ref="requester" @status="(event) => (status = event)" />
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import DataViewPaginate from "~/components/DataViewPaginate.vue";
import RequestDialog, { type SubmitResponse } from "./browse/RequestDialog.vue";
import { useMande, type PCF } from "~/composables/useMande";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { Authenticator } from "~/global";

const requester = ref<InstanceType<typeof RequestDialog>>();
const status = ref<SubmitResponse>();
const api = await useMande();
const { user } = useAuthenticator() as Authenticator;

const pcfs = ref<PCF[]>([]);

useBreadcrumb("Browse PCFs");

onMounted(async () => {
  try {
    const data = await api.get<{ pcfs: PCF[]; lastEvaluatedKey?: string }>(
      "/pcfs",
      {
        query: { isDataOwner: "false" },
      }
    );
    pcfs.value = data.pcfs;
  } catch (error) {
    notify({
      icon: "icon-park-outline:file-failed-one",
      message: "Failed to fetch PCFs",
      mode: "error",
    });
    console.error("Failed to fetch PCFs", error);
  }
});

// Helper function to determine status class
function statusClass(status: string): string {
  switch (status) {
    case "active":
      return "font-bold text-success capitalize";
    case "deprecated":
      return "font-bold text-error capitalize";
    case "pending":
      return "font-bold text-warning capitalize";
    default:
      return "font-bold text-muted capitalize";
  }
}
</script>
