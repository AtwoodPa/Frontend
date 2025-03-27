<template>
  <div>{{ config.text }}</div>
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