
<template>
  <div>
    <DataViewPaginate>
      <template #title>
        <h3 class="card-title font-bold">PCF Details</h3>
        <hr>
      </template>

      <table>
        <tr>
          <th>PCF ID:</th>
          <td>abc4</td>
        </tr>
        <tr>
          <th>Product ID:</th>
          <td>product4</td>
        </tr>
        <tr>
          <th>Product Name:</th>
          <td>Car Seat</td>
        </tr>
        <tr>
          <th>Amount:</th>
          <td>4</td>
        </tr>
        <tr>
          <th>Emission per Unit:</th>
          <td>20 tCO2</td>
        </tr>
        <tr>
          <th>Version:</th>
          <td>1</td>
        </tr>
        <tr>
          <th>Status:</th>
          <td>active</td>
        </tr>
      </table>

      <template #footer>
        <div class="py-3 px-4 flex justify-between">
          <button class="btn btn-sm" @click="router.back()">Go Back</button>

          <div class="flex space-x-3">
            <button class="btn btn-sm btn-error">Mark deprecated</button>
            <NuxtLink to="/me/published/update" class="btn btn-sm btn-success">Update PCF</NuxtLink >
          </div>
        </div>
      </template>
    </DataViewPaginate>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()

useBreadcrumb('PCF Detail')
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
