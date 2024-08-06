<template>
  <div class="flex pt-2">
    <div v-for="item, i of breadcrumbs" class="flex">
      <NuxtLink :to="item.path" class="text-xl font-medium mr-3 hover:opacity-100" :class="{'opacity-65': notLast(i) }">
        {{ item.name }}
      </NuxtLink>

      <span v-if="notLast(i)" class="mr-3">
        <Icon name="tabler:point-filled" class="size-5" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { breadcrumbs } from '~/composables/useBreadcrumb'

const notLast = (index: number) => index < breadcrumbs.value.length - 1

</script>