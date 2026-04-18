// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import DisplayBaseOption from '../../../packages/renderer/src/components/DisplayOptions/DisplayBaseOption.vue';
import type { ConfigOption } from '../../../interfaces/ConfigOption';

const mountOptions = { global: { mocks: { $t: (key: string) => key } } };

const baseOption = (value: ConfigOption['value']): ConfigOption =>
  reactive({
    name: 'SomeKey',
    description: 'desc',
    type: 'number',
    value,
    defaultValue: value,
  }) as ConfigOption;

describe('DisplayBaseOption', () => {
  it('keeps the revert button hidden (but space reserved) when the value is unchanged', () => {
    const wrapper = mount(DisplayBaseOption, {
      props: { option: baseOption(10) },
      ...mountOptions,
    });
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.classes()).toContain('invisible');
  });

  it('shows the revert button and highlights the name once the value changes', async () => {
    const option = baseOption(10);
    const wrapper = mount(DisplayBaseOption, { props: { option }, ...mountOptions });
    option.value = 42;
    await wrapper.vm.$nextTick();
    const button = wrapper.find('button');
    expect(button.classes()).toContain('visible');
    const nameSpan = wrapper.find('span.fake-bold');
    expect(nameSpan.exists()).toBe(true);
    expect(nameSpan.text()).toBe('SomeKey');
  });

  it('reverts the value to the originally loaded one when the revert button is clicked', async () => {
    const option = baseOption(10);
    const wrapper = mount(DisplayBaseOption, { props: { option }, ...mountOptions });
    option.value = 99;
    await wrapper.vm.$nextTick();
    await wrapper.find('button').trigger('click');
    expect(option.value).toBe(10);
    expect(wrapper.find('button').classes()).toContain('invisible');
  });
});
