
<template>
  <div>
    <DataViewPaginate v-if="pcf">
      <template #title>
        <h3 class="card-title font-bold">PCF Details</h3>
        <hr>
      </template>

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
          <td>{{ pcf.pcfStatus }}</td>
        </tr>
      </table>

      <template #footer>
        <div class="py-3 px-4 flex justify-between">
          <button class="btn btn-sm" @click="router.back()">Go Back</button>

          <div class="flex space-x-3">
            <button class="btn btn-sm btn-error" @click="markAsDeprecated">Mark deprecated</button>
            <NuxtLink :to="`/me/published/${id}/update`" class="btn btn-sm btn-success">Update PCF</NuxtLink >
          </div>
        </div>
      </template>
    </DataViewPaginate>
  </div>
</template>

<script lang="ts" setup>
import { useAuthenticator } from '@aws-amplify/ui-vue'
import type { MandeInstance } from 'mande'
import type { Authenticator } from '~/global'

const { id } = useRoute().params
const router = useRouter()

useBreadcrumb('PCF Detail')

const api = inject<MandeInstance>('api')!
const auth = useAuthenticator() as Authenticator
const pcf = ref<PCF>()


onMounted(async () => {
  const { pcfs } = await api.get<{ pcfs: PCF[] }>('/pcf', {
    query: { dataOwnerId: auth.user?.userId, pcfId: id }
  }).catch(() => ({ pcfs: [] }))

  pcf.value = pcfs[0]

  if (!pcf.value) {
    router.push('/me/published')
  }
})

const markAsDeprecated = async () => {
  await api.put(`/pcf/${id}`, {
    pcfId: id,
    version: pcf.value!.version || '1',
    pcfStatus: 'deprecated'
  })
}

</script>

<style scoped>
table {
  font-size: 1rem;
}

th {
  text-align: left;
  @apply px-3 py-2;
}
</style>
