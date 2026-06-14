'use client'

import React from 'react'
import { Layout } from 'antd'
import MyWrapper from '@/components/myWrapper'
import MySider from '@/components/mySider'

export default function OverViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MySider />

      <Layout>
        <MyWrapper>{children}</MyWrapper>
      </Layout>
    </Layout>
  )
}
