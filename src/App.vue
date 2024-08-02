<template>
  <div id="app">
    <!-- Отображение логов -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const logs = ref([]);

onMounted(async () => {
  // Здесь должна быть интеграция с WAMP-сервисом для получения и отображения логов
  console.log("logs", logs);
});

export default defineComponent({
  name: "App",
});
</script>
