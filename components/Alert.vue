<template>
  <TransitionGroup name="list" tag="div" class="space-y-3 px-5">
    <div
      v-for="item, i of notifications"
      :key="item.icon+item.message"
      role="alert" class="alert shadow"
      :class="{
        'bg-green-200': item.mode === 'success',
        'bg-red-200': item.mode === 'error',
        'bg-white': !item.mode
      }"
    >
      <Icon
        v-if="item.icon"
        :name="item.icon"
        class="size-7"
        :class="{
          'text-success': item.mode === 'success',
          'text-error': item.mode === 'error'
        }"
      />

      <span>{{ item.message }}</span>

      <button class="btn btn-sm btn-ghost btn-circle" @click="notifications.splice(i, 1)">
        <Icon name="ic:close" class="size-6" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script lang="ts" setup>
const notifications = useNotification();
</script>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>