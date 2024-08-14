<template>
  <Transition name="fade">
    <PCF :pcf="pcf" v-if="pcf" />
  </Transition>
</template>

<script lang="ts" setup>
import type { MandeInstance } from 'mande'

const { id } = useRoute().params
const router = useRouter()

useBreadcrumb('PCF Details')

const api = inject<MandeInstance>('api')!
const pcf = ref<PCF>()

const { pcfs } = await api.get<{ pcfs: PCF[] }>('/pcf', {
  query: { pcfId: id }
}).catch(() => ({ pcfs: [] }))

pcf.value = pcfs[0]

if (!pcf.value) {
  router.push('/home')
}
</script>
