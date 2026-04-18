// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfigTooltip from '../../../packages/renderer/src/components/ConfigTooltip.vue';

const longName = 'aVeryLongConfigurationKeyNameThatShouldBeTruncatedInTheUI';

describe('ConfigTooltip', () => {
  it('renders the provided name', () => {
    const wrapper = mount(ConfigTooltip, {
      props: { name: longName },
    });
    expect(wrapper.text()).toContain(longName);
  });

  it('exposes the full name via native title attribute when truncated', () => {
    const wrapper = mount(ConfigTooltip, {
      props: { name: longName },
    });
    const span = wrapper.find('span');
    expect(span.attributes('title')).toBe(longName);
  });

  it('applies truncate utility classes by default', () => {
    const wrapper = mount(ConfigTooltip, {
      props: { name: longName },
    });
    const span = wrapper.find('span');
    const cls = span.classes();
    expect(cls).toContain('truncate');
    expect(cls).toContain('block');
    // root wrapper must allow shrinking inside a flex parent
    const rootCls = (wrapper.element as HTMLElement).classList;
    expect(rootCls.contains('min-w-0')).toBe(true);
    expect(rootCls.contains('flex-1')).toBe(true);
  });

  it('omits truncate classes and title when truncate is disabled', () => {
    const wrapper = mount(ConfigTooltip, {
      props: { name: longName, truncate: false },
    });
    const span = wrapper.find('span');
    expect(span.classes()).not.toContain('truncate');
    expect(span.attributes('title')).toBeUndefined();
    const rootCls = (wrapper.element as HTMLElement).classList;
    expect(rootCls.contains('min-w-0')).toBe(false);
    expect(rootCls.contains('flex-1')).toBe(false);
  });
});
