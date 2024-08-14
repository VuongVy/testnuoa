<template>
  <div>
    <div class="card bg-base-100 max-w-2xl w-full mx-auto card-compact">
      <div class="px-5 py-3 border-b">
        <h3 class="card-title">Create new PCF</h3>
      </div>

      <div v-if="pcf" class="card-body">
        <p><strong>Product ID:</strong> {{ pcf.pcfId }}</p>
        <p><strong>Product name:</strong> {{ pcf.productName }}</p>

        <div class="form-control">
          <label class="label">Product Name</label>
          <input v-model="pcf.productName" type="text" class="input input-bordered" disabled/>
        </div>

        <div class="form-control">
          <label class="label">Amount</label>
          <input v-model="pcf.amount" type="number" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">Emission per Unit (tCO2)</label>
          <input v-model="pcf.emissionPerUnit" type="text" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">Additional Information</label>

          <div v-for="info, i of additional" class="flex space-x-3 mb-3">
            <input class="input input-bordered w-full" type="text" v-model="additional[i].name">
            <input class="input input-bordered w-full" type="text" v-model="additional[i].value">
            <div class="grid place-content-center">
              <button class="btn btn-error btn-outline btn-circle btn-sm" @click="additional.splice(i, 1)">X</button>
            </div>
          </div>

          <label class="label cursor-pointer text-blue-600`" @click="additional.push({ name: '', value: '' })">
            + Add more Information
          </label>
        </div>

      </div>

      <div class="border-t card-actions p-5 justify-end space-x-5">
        <button class="btn btn-error btn-sm" @click="router.back()">Cancel</button>
        <button class="btn btn-success btn-sm" @click="update">Submit</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthenticator } from '@aws-amplify/ui-vue'
import type { MandeError, MandeInstance } from 'mande'
import type { Authenticator } from '~/global'

const { id } = useRoute().params
const router = useRouter()

const api = inject<MandeInstance>('api')!
const auth = useAuthenticator() as Authenticator
const pcf = ref<PCF>()

const additional = reactive(
  new Array<{ name: string, value: string }>()
)

useBreadcrumb('Update PCF')

const update = async () => {
  const extra = additional
    .filter(({ name, value }) => name && value)

  additional.length = 0
  additional.push(... extra)

  const payload = {
    ... pcf.value,
    version: pcf.value!.version,
    additionalData: Object.fromEntries(additional.map(it => [it.name, it.value])),
  }

  delete payload.productId
  delete payload.productName

  await api.put('/pcf/' + id, payload).then(() => {
    alert('PCF updated successfully')
  }).catch((error: MandeError) => {
    alert(error.body.message ?? 'Failed to update PCF')
  })
}

onMounted(async () => {
  const { pcfs } = await api.get<{ pcfs: PCF[] }>('/pcf', {
    query: { dataOwnerId: auth.user?.userId, pcfId: id }
  }).catch(() => ({ pcfs: [] }))

  pcf.value = pcfs[0]

  if (!pcf.value) {
    return router.push('/me/published')
  }

  const extra = Object.entries(pcf.value.additionalData ?? {})
    .map(([name, value]) => ({ name, value }))

  pcf.value.additionalData = undefined

  additional.push(... extra)
})
</script>
