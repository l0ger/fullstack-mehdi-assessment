<template>
  <div>
    <h1>Cocktail Detail</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="cocktail">
      <p><strong>{{ cocktail.title }}</strong></p>
      <p>{{ cocktail.description }}</p>
      <p>Price: {{ cocktail.price }}€</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'CocktailDetail',
  setup() {
    const route = useRoute();
    const cocktail = ref(null);
    const loading = ref(true);
    const error = ref(null);

    onMounted(async () => {
      try {
        const response = await fetch(`http://localhost:3000/cocktails/${route.params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        cocktail.value = await response.json();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    return {
      cocktail,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
