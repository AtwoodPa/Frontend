<script>
export default {
  props: {
    renderFunction: Function,
  },
  render() {
    return this.renderFunction();
  },
};
</script>
