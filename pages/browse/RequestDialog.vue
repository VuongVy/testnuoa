<template>
  <Modal ref="dialog" v-slot="{ close }">
    <h3 class="text-2xl font-semibold opacity-80 mb-3">Requesting Access</h3>

    <div class="py-5 border-y space-y-3">
      <p><strong>PCF ID:</strong> {{ pcf.pcfId }}</p>
      <p><strong>Please provide the reason why you need to access the PCF:</strong></p>
      <textarea v-model="pcf.message" class="textarea w-full textarea-bordered" placeholder="Message here..."></textarea>
    </div>

    <div class="modal-action">
      <button class="btn btn-error text-white" @click="close">Close</button>
      <button class="btn btn-success text-white" @click="submit">Submit</button>
    </div>
  </Modal>
</template>

<script lang="ts">
export type SubmitResponse = {
  success: boolean
  message: string
  requestId?: string
}

</script>

<script lang="ts" setup> 
import type { MandeError, MandeInstance } from 'mande'
import Modal from '~/components/Modal.vue'
import dayjs from 'dayjs'

const dialog = ref<InstanceType<typeof Modal>>()
const api = inject<MandeInstance>('api')!
const emit = defineEmits<{
  status: [status: SubmitResponse]
}>()

const pcf = reactive({
  pcfId: '',
  message: '',
  dataOwnerId: '',
  version: '',
})


const open = (pcfId: string, version: string, dataOwnerId: string) => {
  pcf.pcfId = pcfId
  pcf.version = version
  pcf.dataOwnerId = dataOwnerId
  pcf.message = ''

  dialog.value?.show()
}

const submit = async () => {
  const status = await api.post<SubmitResponse>('/request', {
    ... pcf,
    dateRequested: dayjs().format('YYYY-MM-DD'),
  }).catch((e: MandeError) => {
    return { ...e.body, success: false }
  })

  status.success ??= true

  emit('status', status)

  dialog.value?.close()
}

defineExpose({ open })
</script>