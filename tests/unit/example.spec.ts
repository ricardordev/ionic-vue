import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Tab1Page from '@/views/Tab1Page.vue'
import { describe, expect, test } from 'vitest'

describe('Tab1Page.vue', () => {
  test('renders tab 1 Tab1Page', () => {
    setActivePinia(createPinia())
    const wrapper = mount(Tab1Page)
    expect(wrapper.text()).toMatch('Tab 1')
  })
})
