<template>
  <DataViewPaginate class="min-h-[60vh]">
    <template #title>
      <div class="flex justify-between space-x-3 px-3">
        <h3 class="card-title font-bold">Current Requests</h3>
        <NuxtLink to="/me/published/create" class="btn btn-sm btn-success">New PCF</NuxtLink>
      </div>
      <hr>
    </template>

    <table class="table">
      <thead>
        <tr>
          <th>Request No</th>
          <th>Requester Name</th>
          <th>PCF ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Requested Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>

        <tr class="hover">
          <th>1</th>
          <td>Company A</td>
          <td>abc1</td>
          <td>product1</td>
          <td>Door Car</td>
          <td>07/05/2024</td>
          <td>
            <NuxtLink to="/me/incoming/manage" class="link text-blue-600" style="display: block; width: 5rem;">
              <p>View detail</p>
            </NuxtLink>
          </td>
        </tr>

      </tbody>
    </table>
  </DataViewPaginate>
</template>

<script lang="ts" setup>
import DataViewPaginate from '~/components/DataViewPaginate.vue'
</script>