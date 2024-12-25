export default {
    props: {
        target: Object,
        modelValue: Boolean,
    },
    computed: {
        showDrawer: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    methods: {
        doHide(item) {
            this.showDrawer = false;
            if (this.target && this.target.cb) {
                this.target.cb(item);
            }
        },
    },
};
