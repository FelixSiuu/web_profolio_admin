'use client'

import { useState } from 'react'
import { UserOutlined, StarOutlined, HistoryOutlined, BookOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import type { MenuProps } from 'antd'
import { usePathname, useRouter } from 'next/navigation'

const { Header, Sider } = Layout

const MenuItems = [
  {
    key: '/overview/aboutme',
    icon: <UserOutlined />,
    label: 'About Me'
  },
  {
    key: '/overview/coreskills',
    icon: <StarOutlined />,
    label: 'Core Skills'
  },
  {
    key: '/overview/workingexperience',
    icon: <HistoryOutlined />,
    label: 'Working Experience'
  },
  {
    key: '/overview/education',
    icon: <BookOutlined />,
    label: 'Education'
  }
]

export default function MySider() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const router = useRouter()
  const pathname = usePathname()

  const onClick: MenuProps['onClick'] = (e) => {
    router.push(e.key)
  }

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      {/* <Header style={{ padding: 0, background: colorBgContainer }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64
          }}
        />
      </Header> */}

      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" items={MenuItems} selectedKeys={[pathname]} onClick={onClick} />
    </Sider>
  )
}
