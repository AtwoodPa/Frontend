<template>
  <div>{{ config.message }}</div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  }
};
</script>    