<template>
  <div>
    <img src="/logo.svg" />

    <ul class="menu p-4 font-semibold text-stone-600">
      <li v-for="(link, path) of links" :key="path">
        <details v-if="link.children">
          <summary>
            <Icon v-if="link.icon" :name="link.icon" class="size-7" />
            {{ link.name }}
          </summary>
          <ul>
            <li v-for="(sub, uri) of link.children" :key="uri">
              <NuxtLink
                :to="`/${path}/${uri}`"
                :class="active(`/${path}/${uri}`)"
                >{{ sub.name }}</NuxtLink
              >
            </li>
          </ul>
        </details>

        <NuxtLink v-else :to="`/${path}`" :class="active(`/${path}`)">
          <Icon v-if="link.icon" :name="link.icon" class="size-7" />
          {{ link.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
type Links = {
  [key: string]: {
    name: string;
    icon?: string;
    children?: Links;
  };
};

const links: Links = {
  home: { name: "Home", icon: "ic:outline-home" },
  me: {
    name: "My PCFs",
    icon: "game-icons:jigsaw-piece",
    children: {
      published: { name: "My Published PCFs" },
      shared: { name: "PCF Shared With Me" },
    },
  },
  requests: {
    name: "My Requests",
    icon: "ic:outline-request-quote",
    children: {
      incoming: { name: "Incoming Requests" },
      sent: { name: "Sent Requests" },
    },
  },
  browse: { name: "Browse PCFs", icon: "hugeicons:discover-circle" },
};
</script>

<script lang="ts" setup>
const route = useRoute();

const active = (uri: string) => {
  return route.path.startsWith(uri) ? "text-primary bg-green-200/80" : "";
};
</script>
