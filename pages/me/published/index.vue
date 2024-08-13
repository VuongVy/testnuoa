<template>
  <DataViewPaginate class="min-h-[60vh]">
    <template #title>
      <div class="flex justify-between space-x-3 px-3">
        <h3 class="card-title font-bold">My published PCFs</h3>
        <NuxtLink to="/me/published/create" class="btn btn-sm btn-success">New PCF</NuxtLink>
      </div>
      <hr>
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>PCF ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Amount</th>
          <th>Emission per Unit</th>
          <th>version</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>

        <tr v-for="pcf of pcfs" class="hover cursor-pointer" @click="navigateTo(`/me/published/${pcf.pcfId}`)">
          <th>{{ pcf.pcfId }}</th>
          <td>{{ pcf.productId }}</td>
          <td>{{ pcf.productName }}</td>
          <td>{{ pcf.amount }}</td>
          <td>{{ pcf.emissionPerUnit }}</td>
          <td>{{ pcf.version }}</td>
          <td>
            <a class="text-success" v-if="pcf.pcfStatus === 'active'">Active</a>
            <a class="text-error" v-else-if="pcf.pcfStatus === 'deprecated'">Deprecated</a>
            <a class="text-warning" v-else>{{ pcf.pcfStatus }}</a>
          </td>
        </tr>

      </tbody>
    </table>
  </DataViewPaginate>
</template>

<script lang="ts" setup>
import { useAuthenticator } from '@aws-amplify/ui-vue'
import type { MandeInstance } from 'mande'
import DataViewPaginate from '~/components/DataViewPaginate.vue'
import type { Authenticator } from '~/global'

useBreadcrumb('All published PCFs')

const api = inject<MandeInstance>('api')!
const auth = useAuthenticator() as Authenticator

const pcfs = ref<PCF[]>([])

onMounted(async () => {
  const response = await api.get<{ pcfs: PCF[] }>('/pcf', {
    query: { dataOwnerId: auth.user?.userId }
  })

  pcfs.value = response.pcfs
})

</script>