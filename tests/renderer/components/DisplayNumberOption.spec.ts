// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DisplayNumberOption from '../../../packages/renderer/src/components/DisplayOptions/DisplayNumberOption.vue';
import type { ConfigOption } from '../../../interfaces/ConfigOption';

const mountOptions = { global: { mocks: { $t: (key: string) => key } } };

const baseOption = (value: number, ranges: number[] = [0, 100, 1]): ConfigOption => ({
  name: 'fFarClippingPlane_High',
  description: 'desc',
  type: 'number',
  value,
  defaultValue: value,
  ranges,
});

describe('DisplayNumberOption', () => {
  it('renders the slider and a value display by default (no number input visible)', () => {
    const wrapper = mount(DisplayNumberOption, {
      props: { option: baseOption(10) },
      ...mountOptions,
    });
    expect(wrapper.find('input[type="range"]').exists()).toBe(true);
    expect(wrapper.find('input[type="number"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('10');
  });

  it('reveals the number input when the value is clicked', async () => {
    const wrapper = mount(DisplayNumberOption, {
      props: { option: baseOption(10) },
      ...mountOptions,
    });
    await wrapper.find('span.cursor-pointer').trigger('click');
    await nextTick();
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
  });

  it('updates the option value when the numeric input changes', async () => {
    const option = baseOption(10, [0, 100, 1]);
    const wrapper = mount(DisplayNumberOption, { props: { option }, ...mountOptions });
    await wrapper.find('span.cursor-pointer').trigger('click');
    await nextTick();
    const input = wrapper.find('input[type="number"]');
    await input.setValue('42');
    await input.trigger('change');
    expect(option.value).toBe(42);
  });

  it('clamps numeric input to the configured max', async () => {
    const option = baseOption(10, [0, 100, 1]);
    const wrapper = mount(DisplayNumberOption, { props: { option }, ...mountOptions });
    await wrapper.find('span.cursor-pointer').trigger('click');
    await nextTick();
    const input = wrapper.find('input[type="number"]');
    await input.setValue('9999');
    await input.trigger('change');
    expect(option.value).toBe(100);
  });

  it('clamps numeric input to the configured min', async () => {
    const option = baseOption(10, [5, 100, 1]);
    const wrapper = mount(DisplayNumberOption, { props: { option }, ...mountOptions });
    await wrapper.find('span.cursor-pointer').trigger('click');
    await nextTick();
    const input = wrapper.find('input[type="number"]');
    await input.setValue('-1');
    await input.trigger('change');
    expect(option.value).toBe(5);
  });

  it('ignores non-numeric input', async () => {
    const option = baseOption(10, [0, 100, 1]);
    const wrapper = mount(DisplayNumberOption, { props: { option }, ...mountOptions });
    await wrapper.find('span.cursor-pointer').trigger('click');
    await nextTick();
    const input = wrapper.find('input[type="number"]');
    const el = input.element as HTMLInputElement;
    el.value = 'abc';
    await input.trigger('change');
    expect(option.value).toBe(10);
  });

  it('updates the option value live as the slider input fires', async () => {
    const option = baseOption(10, [0, 100, 1]);
    const wrapper = mount(DisplayNumberOption, { props: { option }, ...mountOptions });
    const slider = wrapper.find('input[type="range"]');
    (slider.element as HTMLInputElement).value = '55';
    await slider.trigger('input');
    expect(option.value).toBe(55);
  });
});
