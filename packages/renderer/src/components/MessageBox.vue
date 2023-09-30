<template>
  <div
    class="message-box"
    :class="messageType"
  >
    {{ text }}
    <span
      class="close-btn"
      @click="close"
    >x</span>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';

export default defineComponent({
  components: {},
  props: {
    message: {
      type: String,
      required: true,
    },
    lifeTime: {
      type: Number,
      default: 5000,
    },
    type: {
      type: String,
      default: 'info',
    },
  },
  emits: ['close'],
  setup(props, {emit}) {
    onMounted(() => {
      setTimeout(() => {
        emit('close');
      }, props.lifeTime);
    });
    return {text: props.message, messageType: props.type};
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss">
.close-btn {
  position: absolute;
  top: 0.05rem;
  right: 0.3rem;
  color: black;
  cursor: pointer;
}
.message-box {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 18rem;
  min-height: 2rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.success {
  background-color: #63921dd5;
}
.info {
  background-color: #1e90ffd5;
}
.danger {
  background-color: #ff0000d5;
}
</style>
