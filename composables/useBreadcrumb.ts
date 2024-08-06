type BreadcrumbItem = { path: string, name: string }

type Breadcrumb = Array<BreadcrumbItem>

export const breadcrumbs = ref([] as Breadcrumb)

export const useBreadcrumb = (name: string) => {
  const route = useRoute()
  const stack = inject<Breadcrumb>('breadcrumb', [], true)

  stack.push({ path: route.path, name })

  const set = [...new Set(stack.map(it => `${it.path}#${it.name}`))].map(it => {
    const [path, name] = it.split('#')

    return { path, name }
  }).filter(it => route.path.startsWith(it.path))

  provide('breadcrumb', set)
  breadcrumbs.value = set

  onBeforeRouteLeave(() => {
    breadcrumbs.value = []
  })
}