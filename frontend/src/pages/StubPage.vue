<template>
  <div style="padding: 20px">
    <h2 style="margin: 0 0 12px">{{ title }}</h2>
    <div style="color: #666">路由占位页（phase8 会补齐完整 UI）。</div>
    <pre style="margin-top: 16px; background: #f6f6f6; padding: 12px; border-radius: 8px">{{ params }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => (route.meta.title as string) ?? route.path)
const params = computed(() => JSON.stringify(route.params, null, 2))
</script>

