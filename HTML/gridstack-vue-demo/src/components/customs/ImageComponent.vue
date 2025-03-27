<template>
  <img :src="config.src" alt="图片" />
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