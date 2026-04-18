// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DisplayModeOption from '../../../packages/renderer/src/components/DisplayOptions/DisplayModeOption.vue';
import type { ConfigOption } from '../../../interfaces/ConfigOption';

const mountOptions = { global: { mocks: { $t: (key: string) => key } } };

const baseOption = (modes: string[], value: string): ConfigOption => ({
  name: 'Text',
  description: 'desc',
  type: 'mode',
  value,
  defaultValue: value,
  modes,
});

describe('DisplayModeOption', () => {
  it('renders radio-style buttons when there are 4 or fewer modes', () => {
    const wrapper = mount(DisplayModeOption, {
      props: { option: baseOption(['A', 'B', 'C', 'D'], 'A') },
      ...mountOptions,
    });
    expect(wrapper.find('select').exists()).toBe(false);
    // 4 mode-buttons + 1 revert button (always rendered, hidden when not dirty)
    expect(wrapper.findAll('button').length).toBe(5);
  });

  it('renders a value display (no select visible) when there are more than 4 modes', () => {
    const wrapper = mount(DisplayModeOption, {
      props: { option: baseOption(['A', 'B', 'C', 'D', 'E'], 'A') },
      ...mountOptions,
    });
    expect(wrapper.find('select').exists()).toBe(false);
    expect(wrapper.text()).toContain('A');
  });

  it('reveals the select when the value is clicked, and updates the option on change', async () => {
    const option = baseOption(['A', 'B', 'C', 'D', 'E'], 'A');
    const wrapper = mount(DisplayModeOption, { props: { option }, ...mountOptions });
    await wrapper.find('span.cursor-pointer').trigger('click');
    await nextTick();
    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);
    expect(wrapper.findAll('option').length).toBe(5);
    await select.setValue('C');
    expect(option.value).toBe('C');
  });

  it('updates option value when a radio button is clicked', async () => {
    const option = baseOption(['A', 'B', 'C'], 'A');
    const wrapper = mount(DisplayModeOption, { props: { option }, ...mountOptions });
    // first button is the always-rendered revert button; mode buttons follow
    const buttons = wrapper.findAll('button');
    await buttons[2].trigger('click');
    expect(option.value).toBe('B');
  });
});
