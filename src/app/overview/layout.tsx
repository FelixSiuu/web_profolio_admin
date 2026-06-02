'use client'

import React from 'react'
import { Layout } from 'antd'
import MyWrapper from '@/components/myWrapper'
import MySider from '@/components/mySider'

export default function OverViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <MySider />
      <Layout>
        <MyWrapper>{children}</MyWrapper>
      </Layout>
    </Layout>
  )
}
