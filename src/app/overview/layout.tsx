'use client'

import React from 'react'
import { Layout } from 'antd'
import MyWrapper from '@/components/myWrapper'
import MySider from '@/components/mySider'
import MyHeader from '@/components/myHeader'

export default function OverViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MySider />

      <Layout>
        <MyHeader />

        <MyWrapper>{children}</MyWrapper>
      </Layout>
    </Layout>
  )
}
