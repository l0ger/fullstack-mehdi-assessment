<template>
  <div>
    <form @submit.prevent="submitForm">
      <div>
        <label for="title">Title:</label>
        <input type="text" v-model="form.title" id="title" required>
      </div>
      <div>
        <label for="price">Price:</label>
        <input type="number" v-model.number="form.price" id="price" min="0" max="999.99" step="0.01" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="form.description" id="description" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
    <ErrorMessage :message="error" />
  </div>
</template>

<script>
import { API_BASE_URL } from '@/api';
import ErrorMessage from '@/components/error-message.vue';

export default {
  name: 'CocktailNew',
  components: { ErrorMessage },
  data() {
    return {
      form: {
        title: '',
        price: '',
        description: ''
      },
      error: null
    };
  },
  methods: {
    async submitForm() {
      this.error = null;
      try {
        let response;
        try {
          response = await fetch(`${API_BASE_URL}/cocktails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.form)
          });
        } catch {
          throw new Error('Could not reach the server. Please check your connection and try again.');
        }

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
          throw new Error(message || 'Could not add the cocktail. Please try again.');
        }

        const data = await response.json();
        console.log('Form submitted successfully:', data);
        // Clear the form
        this.form.title = '';
        this.form.price = '';
        this.form.description = '';
      } catch (error) {
        console.error('There was an error submitting the form:', error);
        this.error = error.message;
      }
    }
  }
};
</script>

<style scoped>
/* Optional: Add some basic styling */
form {
  max-width: 400px;
  margin: 0 auto;
}
div {
  margin-bottom: 10px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input, textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>