'use client'

import { useEffect, useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, theme } from 'antd'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/navigation'

const { Header, Sider } = Layout

export default function MySider() {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const router = useRouter()
  const [activeKey, setActiveKey] = useState('myinfo')

  const onClick: MenuProps['onClick'] = (e) => {
    setActiveKey(e.key)
  }

  useEffect(() => {
    if (!router) return

    router.push(`/overview/${activeKey}`)
  }, [activeKey, router])

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
      <Menu
        theme="dark"
        mode="inline"
        // defaultSelectedKeys={['myinfo']}
        items={[
          {
            key: 'myinfo',
            icon: <UserOutlined />,
            label: '我的信息'
          }
        ]}
        selectedKeys={[activeKey]}
        onClick={onClick}
      />
    </Sider>
  )
}
