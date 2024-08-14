<template>
  <div class="card shadow bg-base-100">
    <h3 class="card-title m-4">PCF Details</h3>
    <hr />
    <div class="card-body">
      <div class="flex justify-between">
        <div class="leading-9 [&>p>strong]:mr-1.5">
          <p><strong>PCF ID:</strong> {{ pcf.pcfId }}</p>
          <p><strong>Product Name:</strong> {{ pcf.productName }}</p>
          <p><strong>Amount:</strong> {{ pcf.amount ?? "---" }}</p>
          <p>
            <strong>Emission per Unit:</strong>
            {{ pcf.emissionPerUnit ? pcf.emissionPerUnit + " tCO2" : "---" }}
          </p>
          <p><strong>Version:</strong> {{ pcf.version }}</p>
          <p>
            <strong>Status:</strong>
            <a v-if="pcf.pcfStatus === 'active'" class="text-success">Active</a>
            <a v-else-if="pcf.pcfStatus === 'deprecated'" class="text-error"
              >Deprecated</a
            >
            <a v-else class="text-warning">{{ pcf.pcfStatus }}</a>
          </p>
          <p>
            <strong>Additional Info:</strong>
            {{
              isEmptyObject(pcf.additionalData)
                ? "N/A"
                : formatAdditionalData(pcf.additionalData)
            }}
          </p>
        </div>

        <div class="text-center mr-20">
          <div class="avatar">
            <div
              class="max-w-[250px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgqaPZ6HpmxExPx5g_Rxgp8o0vPAdSCZcxMQ&usqp=CAU"
              />
            </div>
          </div>
          <p class="mt-3 opacity-65">This PCF belongs to company A</p>
        </div>
      </div>
    </div>
    <hr />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

// Utility functions to check if an object is empty and format additionalData
function isEmptyObject(obj: any): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

function formatAdditionalData(data: any): string {
  // Customize this function based on how you want to display additionalData
  return JSON.stringify(data);
}

defineProps({
  pcf: { type: Object as PropType<PCF>, required: true },
});
</script>
