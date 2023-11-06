<template>
  <button
    :disabled="disable"
    class="btn"
    :class="customClass"
    @click="func"
  >
    <span v-if="text">{{ buttonText }}</span>
    <mdi-icon
      v-if="name"
      :icon="name"
    />
  </button>
</template>

<script lang="ts">


import { defineComponent, ref } from 'vue';
import MdiIcon from './MdiIcon.vue';
export default defineComponent({
    components: { MdiIcon },
    props: {
        icon: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'primary',
        },
        action: {
            type: Function,
            default: () => { },
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const name = ref(`mdi ${props.icon}`);
        return {
            name, customClass: props.type, func: (props.action as (payload: MouseEvent) => void), buttonText: props.text, disable: props.disabled,
        };
    },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.btn {
    text-align: center;
    border: none;
    margin: 0.25rem;
    text-decoration: none;
    font-size: 1.5rem;
    padding: 0.2rem;



    &:enabled:active {
        background-color: #3e8e41;
        box-shadow: 0 2px #666;
        transform: translateY(1px);
    }
}


.primary {
    background-color: $primary;
}

.secondary {
    background-color: $secondary;
}

.success {
    background-color: $success;
}

.info {
    background-color: $info;
}

.warning {
    background-color: $warning;
}

.danger {
    background-color: $danger;
}

.light {
    background-color: $light;
}

.dark {
    background-color: $dark;
}
</style>