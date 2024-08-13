
<template>

  <DataViewPaginate title="Recent Processed Requests">
    <table class="table table-sm">
      <!-- head -->
      <thead>
        <tr>
          <th>ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Data Owner</th>
          <th>Version</th>
          <th>Date Processed</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody class="cursor-pointer">

        <tr v-for="item, i of requests" class="hover" @click="navigateTo('/home/' + item.requestId.split(',')[0])">
          <th>{{ i + 1 }}</th>
          <td>---</td>
          <td>---</td>
          <td>{{ item.dataOwnerId }}</td>
          <td>{{ item.version }}</td>
          <td>{{ item.dateProcessed.split('-').reverse().join('/') }}</td>
          <td>
            <span class="font-bold" :class="{
              'text-success': item.requestStatus === 'approved',
              'text-error': item.requestStatus === 'denied',
              'text-warning': item.requestStatus === 'pending'
            }">
              {{ item.requestStatus }}
            </span>
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
import type { RequestAccess } from '~/composables/useMande';
import type { Authenticator } from '~/global'

const api = inject<MandeInstance>('api')!
const auth = useAuthenticator() as Authenticator

const requests = ref<RequestAccess[]>([])

onMounted(async () => {
  const response = await api.get<{ requests: RequestAccess[] }>('/request', {
    query: { dataRequestorId: auth.user?.userId }
  })

  requests.value = response.requests
})
</script>