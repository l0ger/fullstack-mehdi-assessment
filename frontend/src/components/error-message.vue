<template>
  <p v-if="message">{{ message }}</p>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      default: null,
    },
  },
};
</script>
