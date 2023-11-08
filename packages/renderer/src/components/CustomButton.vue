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


import { defineComponent, ref, watch } from 'vue';
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
        const disable = ref(props.disabled);

        watch(() => props.disabled, (newVal: boolean) => {
            disable.value = newVal;
        });
        return {
            name, customClass: props.type, func: (props.action as (payload: MouseEvent) => void), buttonText: props.text, disable,
        };
    },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.btn {
    border: none;
    margin: 0.25rem;
    text-decoration: none;
    font-size: 1.5rem;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    aspect-ratio: 1/1;
    border-radius: 10%;

    &:enabled:active {
        background-color: $accent;
        transform: translateY(1px);
    }
}


.primary {
    background-color: $accent;
}

.secondary {
    background-color: $secondary-color;
}

.success {
    background-color: $success-color;
}

.info {
    background-color: $info-color;
}

.warning {
    background-color: $warning-color;
}

.error {
    background-color: $error-color;
}

.light {
    background-color: $light;
}

.dark {
    background-color: $dark;
}
</style>