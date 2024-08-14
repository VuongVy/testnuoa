<template>
  <div class="min-h-screen">
    <div class="grid md:grid-cols-2 gap-5">
      <DataViewPaginate>
        <template #title>
          <h3 class="card-title font-bold">Request Detail:</h3>
          <hr>
        </template>

        <div class="space-y-3">
          <p><strong>From:</strong> Company A</p>
          <p><strong>Seeking permission for PCF ID:</strong> abc1</p>
          <p><strong>Message:</strong></p>
          <div class="form-control">
            <textarea  rows="3" class="textarea textarea-bordered"></textarea>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between py-3 px-4">
            <div class="grid place-content-center">
              <strong>Action to do:</strong>
            </div>

            <div class="flex space-x-3">
              <button class="btn btn-primary btn-sm">Accept</button>
              <button class="btn btn-error btn-sm">Deny</button>
            </div>
          </div>
        </template>

      </DataViewPaginate>

      <DataViewPaginate>
        <template #title>
          <h3 class="card-title font-bold">Request on this PCF:</h3>
          <hr>
        </template>

        <table class="table">
          <thead>
            <tr>
              <th><strong>Requester Name</strong></th>
              <th><strong>Requester Date</strong></th>
              <th><strong>Manage Access</strong></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="i of new Array(3)" class="hover">
              <th>Company A</th>
              <td>07/05/2024</td>
              <td class="space-x-2">
                <button class="btn btn-xs btn-circle btn-error">
                  <Icon name="material-symbols:close" class="size-4 text-white"/>
                </button>
                <button class="btn btn-xs btn-circle btn-success">
                  <Icon name="material-symbols:check" class="size-4 text-white" />
                </button>
              </td>
            </tr>

          </tbody>
        </table>

      </DataViewPaginate>

    </div>
  </div>
</template>

<script lang="ts" setup>
import DataViewPaginate from '~/components/DataViewPaginate.vue'
</script>