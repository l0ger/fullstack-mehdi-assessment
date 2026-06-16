<template>
  <div>
    <h1>Cocktails List</h1>
    <div v-if="loading">Loading...</div>
    <ErrorMessage v-else-if="error" :message="error" />
    <div v-else>
        <label for="search">Search by description:</label>
       <input type="text" id="search" v-model="search" />
      <ul>
        <li v-for="item in data" :key="item.id">
            <router-link :to="`/cocktails/${item.id}`" style="font-weight: bold">{{ item.title }}</router-link> price: {{ item.price }}€
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { API_BASE_URL } from '@/api';
import ErrorMessage from '@/components/error-message.vue';

export default {
  name: 'CocktailList',
  components: { ErrorMessage },
  setup() {
    const data = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const search = ref('');
    let debounceTimer = null;

    const fetchCocktails = async (query) => {
      try {
        const url = query
          ? `${API_BASE_URL}/cocktails?search=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/cocktails`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        data.value = await response.json();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => fetchCocktails());

    // Fuzzy search (typo-tolerant) is handled server-side via Elasticsearch,
    // so the term is sent to the backend rather than filtered in the browser.
    watch(search, (value) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchCocktails(value), 300);
    });

    return {
      data,
      loading,
      error,
      search,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>