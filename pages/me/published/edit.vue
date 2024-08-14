<template>
  <div>
    <div class="card bg-base-100 max-w-2xl w-full mx-auto card-compact">
      <div class="px-5 py-3 border-b">
        <h3 class="card-title">PCF Details</h3>
      </div>

      <div class="card-body">
        <div class="form-control">
          <label class="label">PCF ID</label>
          <label class="label">abc1</label>
        </div>

        <div class="form-control"> 
          <label class="label">Product ID</label>
          <label class="label">product1</label>
        </div>

        <div class="form-control">
          <label class="label">Product Name</label>
          <label class="label">Car Seat</label>
        </div>

        <div class="form-control">
          <label class="label">Amount</label>
          <label class="label">4</label>
        </div>

        <div class="form-control">
          <label class="label">Emission per Unit</label>
          <label class="label">20 tCO2</label>
        </div>

        <div class="form-control">
          <label class="label">Status</label>
          <label class="label">Active</label>
        </div>

        <div class="form-control">
          <label class="label">Additional Info</label>
          <label class="label">. Data Quality:       80%</label>
        </div>

      </div>

      <div class="border-t card-actions p-5 justify-end space-x-5">
        <button class="btn btn-error btn-sm">Make Deprecated</button>
        <button class="btn btn-success btn-sm">Update PCF</button>
      </div>
    </div>
  </div>
</template>
