<template>
  <div class="card shadow bg-base-100">
    <h3 class="card-title font-bold m-4">PCF Details</h3>
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
          <p><strong>Status:</strong> {{ pcf.pcfStatus ?? "---" }}</p>
          <p>
            <strong>Additional Info:</strong>
            {{ pcf.additionalData?.dataQuality ?? "---" }}
          </p>
        </div>

        <div class="text-center mr-20">
          <div class="avatar">
            <div
              class="max-w-[250px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
            >
              <img
                src="https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-person.png"
              />
            </div>
          </div>

          <p class="mt-3 opacity-65">This PCF belongs to {{ pcf.company }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  pcf: { type: Object as PropType<PCF>, required: true },
});
</script>
