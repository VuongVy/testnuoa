<template>
  <div>
    <div class="card bg-base-100 max-w-2xl w-full mx-auto card-compact">
      <div class="px-5 py-3 border-b">
        <h3 class="card-title">Create new PCF</h3>
      </div>

      <div class="card-body">
        <div class="form-control">
          <label class="label">Product ID</label>
          <input v-model="pcf.productId" type="text" class="input input-bordered">
        </div>

        <div class="form-control">
          <label class="label">Product Name</label>
          <input v-model="pcf.productName" type="text" class="input input-bordered">
        </div>

        <div class="form-control">
          <label class="label">Amount</label>
          <input v-model="pcf.amount" type="number" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">Emission per Unit (tCO2)</label>
          <input v-model="pcf.emissionPerUnit" type="number" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">Additional Information</label>

          <div v-for="info,i of additional" class="flex space-x-3 mb-3">
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
        <button class="btn btn-error btn-sm">Cancel</button>
        <button class="btn btn-success btn-sm" @click="create">Submit</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MandeError, MandeInstance } from 'mande'


const additional = reactive(
  new Array<{ name: string, value: string }>()
)

const api = inject<MandeInstance>('api')!

const pcf = reactive({
  productId: '',
  productName: '',
  amount: 0,
  emissionPerUnit: 0,
  version: 1,
  pcfStatus: 'active'
})

const create = async () => {
  const extra = additional
    .filter(it => it.name && it.value)

  additional.length = 0
  additional.push(... extra)

  const additionalData = Object.fromEntries(extra.map(it => [it.name, it.value]))

  api.post<{ message: string }>('/pcf', {
    ... pcf,
    additionalData
  }).then(() => {
    alert('PCF created successfully')
    navigateTo('/me/published')
  }).catch((error: MandeError) => {
    alert(error.body.message)
  })
}

useBreadcrumb('Create new PCF')
</script>
