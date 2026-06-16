<template>
  <div>
    <h1>Cocktails List</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
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

export default {
  name: 'NewCocktail',
  setup() {
    const data = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const search = ref('');
    let debounceTimer = null;

    const fetchCocktails = async (query) => {
      try {
        const url = query
          ? `http://localhost:3000/cocktails?search=${encodeURIComponent(query)}`
          : 'http://localhost:3000/cocktails';
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