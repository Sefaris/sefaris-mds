<template>
  <button
    ref="reference"
    :disabled="disable"
    class="btn"
    :class="customClass"
    @click="func"
  >
    <mdi-icon
      v-if="name"
      :icon="name"
    />
  </button>
  <div
    v-if="title"
    ref="floating"
    :style="floatingStyles"
    class="tooltip"
  >
    {{ title }}
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';
import MdiIcon from './MdiIcon.vue';
import {flip, hide, offset, shift, useFloating} from '@floating-ui/vue';

export default defineComponent({
  components: {MdiIcon},
  props: {
    icon: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'primary',
    },
    action: {
      type: Function,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const name = ref(`mdi ${props.icon}`);
    const disable = ref(props.disabled);
    const title = ref(props.tooltip);
    const customClass = ref(props.type);

    const reference = ref(null);
    const floating = ref(null);

    const {floatingStyles, middlewareData} = useFloating(reference, floating, {
      placement: 'bottom',
      middleware: [offset(4), flip(), shift({padding: 8}), hide({strategy: 'escaped'})],
    });

    watch(
      () => props.disabled,
      (newVal: boolean) => {
        disable.value = newVal;
      },
    );
    watch(
      () => props.tooltip,
      (newVal: string) => {
        title.value = newVal;
      },
    );

    return {
      name,
      customClass,
      func: props.action as (payload: MouseEvent) => void,
      title,
      disable,
      reference,
      floating,
      floatingStyles,
      middlewareData,
    };
  },
});
</script>

<style lang="scss">
@import '../../assets/styles/variables.scss';

.btn {
  border: none;
  text-decoration: none;
  font-size: 1.5rem;
  padding: 0.2rem;
  height: 2rem;
  aspect-ratio: 1/1;
  border-radius: 10%;
  margin: 0.2rem;

  &:enabled:active {
    background-color: $accent;
    transform: translateY(1px);
  }
}

.btn:hover + .tooltip {
  visibility: visible;
}

.tooltip {
  background-color: $secondary-color;
  border: 1px solid $accent;
  color: $text-color;
  visibility: hidden;
  border-radius: 0.25rem;
  padding: 0.25rem;
  text-align: center;
  white-space: nowrap;
  z-index: 1;
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
