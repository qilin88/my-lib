// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { HTMLAttributes } from 'react';
import Button from '@ql/components/Button';

// 定义 meta 配置
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '一个可复用的按钮组件，支持多种样式、尺寸和状态。'
      }
    }
  },
  // 添加控制项配置
  argTypes: {
    variant: {
      description: '按钮样式变体',
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      table: {
        type: { summary: 'primary | secondary | danger' },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      description: '按钮尺寸',
      control: 'radio',
      options: ['small', 'medium', 'large'],
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' }
      }
    },
    disabled: {
      description: '是否禁用',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    onClick: {
      description: '点击事件处理函数',
      action: 'clicked'
    },
    children: {
      description: '按钮内容',
      control: 'text'
    }
  }
};

export default meta;

// 定义 Story 类型
type Story = StoryObj<typeof Button>;

// 基础示例
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary'
  }
};

// 次要按钮
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary'
  }
};

// 危险按钮
export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger'
  }
};

// 不同尺寸示例
export const Sizes: Story = {
  render: function Render() {
    const divStyle: React.CSSProperties = {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    };

    return React.createElement('div', { style: divStyle }, [
      React.createElement(Button, { size: 'small', key: 'small', children: 'Small' }),
      React.createElement(Button, { size: 'medium', key: 'medium', children: 'Medium' }),
      React.createElement(Button, { size: 'large', key: 'large', children: 'Large' })
    ]);
  }
};

// 禁用状态
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true
  }
};

// 所有变体示例
export const AllVariants: Story = {
  render: function Render() {
    return React.createElement('div', 
      { 
        style: { 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem' 
        } 
      },
      [
        // 第一行按钮
        React.createElement('div',
          {
            key: 'row1',
            style: { display: 'flex', gap: '1rem' }
          },
          [
            React.createElement(Button, { key: 'primary', variant: 'primary', children: 'Primary' }),
            React.createElement(Button, { key: 'secondary', variant: 'secondary', children: 'Secondary' }),
            React.createElement(Button, { key: 'danger', variant: 'danger', children: 'Danger' })
          ]
        ),
        // 第二行禁用按钮
        React.createElement('div',
          {
            key: 'row2',
            style: { display: 'flex', gap: '1rem' }
          },
          [
            React.createElement(Button, { key: 'primary-disabled', variant: 'primary', disabled: true, children: 'Primary Disabled' }),
            React.createElement(Button, { key: 'secondary-disabled', variant: 'secondary', disabled: true, children: 'Secondary Disabled' }),
            React.createElement(Button, { key: 'danger-disabled', variant: 'danger', disabled: true, children: 'Danger Disabled' })
          ]
        )
      ]
    );
  }
 };

// 带事件处理
export const WithClickHandler: Story = {
  args: {
    children: 'Click Me',
    onClick: () => console.log('Button clicked!')
  }
};