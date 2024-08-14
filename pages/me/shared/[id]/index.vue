<template>
  <div>
    <PCF v-if="pcf" :pcf="pcf" />
    <template v-else>
      <p>Loading...</p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthenticator } from "@aws-amplify/ui-vue";
import type { MandeInstance } from "mande";
import type { Authenticator } from "~/global";
import PCF from "@/components/PCF.vue"; // Adjust the import path as necessary

const { id } = useRoute().params;
const router = useRouter();

useBreadcrumb("PCF Detail");

const api = inject<MandeInstance>("api")!;
const auth = useAuthenticator() as Authenticator;
const pcf = ref<PCF>();

onMounted(async () => {
  const { pcfs } = await api
    .get<{ pcfs: PCF[] }>("/pcf", {
      query: { pcfId: id },
    })
    .catch(() => ({ pcfs: [] }));

  pcf.value = pcfs[0];

  if (!pcf.value) {
    router.push("/me/shared");
  }
});
</script>

<style scoped>
/* Your CSS styles here */
table {
  font-size: 1rem;
}

th {
  text-align: left;
  padding: 0.5rem; /* Use standard CSS properties instead of Tailwind utility classes */
}
</style>
