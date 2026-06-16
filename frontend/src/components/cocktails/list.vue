<template>
  <div>
    <h1>Cocktails List</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
        <label for="search">Search by description:</label>
       <input type="text" id="search" v-model="search" />
      <ul>
        <li v-for="item in filteredData" :key="item.id">
            <router-link :to="`/cocktails/${item.id}`" style="font-weight: bold">{{ item.title }}</router-link> price: {{ item.price }}€
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'NewCocktail',
  setup() {
    const data = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const search = ref('');

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/cocktails');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        data.value = jsonData;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchData);

    const filteredData = computed(() =>
      data.value.filter((item) =>
        item.description?.toLowerCase().includes(search.value.toLowerCase())
      )
    );

    return {
      data,
      loading,
      error,
      search,
      filteredData,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>