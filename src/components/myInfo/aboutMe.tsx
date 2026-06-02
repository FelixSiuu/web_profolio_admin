'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, message, Table } from 'antd'
import SectionTitle from '../sectionTitle'
import { aboutService } from '@/services/myInfo.service'
import { getAboutMeColumns } from './getByActionColumns'
import EditModal from './editModal'

const fetchAboutMe = async () => {
  try {
    const { success, data, message } = await aboutService.getAboutMe()
    if (!success) throw new Error(message)
    return data
  } catch (error) {
    throw error
  }
}

const editAboutMe = async (id: number, postBody: { paragraph: About['paragraph'] }) => {
  try {
    const { success, message } = await aboutService.editAboutMe(id, postBody)
    if (!success) throw new Error(message)
  } catch (error) {
    throw error
  }
}

const editColumns = ['paragraph']

export default function AboutMe() {
  const [messageApi, contextHolder] = message.useMessage()
  const [data, setData] = useState<About[]>([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [itemId, setItemId] = useState<null | About['id']>(null)

  const columns = useMemo(() => {
    return getAboutMeColumns({
      onEdit: (record) => {
        setItemId(record.id)
      },
      onDelete: (record) => {
        console.log(record.id)
      }
    })
  }, [])

  const editData = useMemo(() => {
    return data.find((item) => item.id === itemId)
  }, [data, itemId])

  const handleEditOk = async (newValues: About) => {
    if (!itemId) return
    setConfirmLoading(true)
    try {
      await editAboutMe(itemId, { paragraph: newValues.paragraph })
      messageApi.success('edit success!!')

      const data = await fetchAboutMe()
      setData(data)
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message)
      }
    } finally {
      setConfirmLoading(false)
      setItemId(null)
    }
  }

  const handleCancel = () => {
    setItemId(null)
  }

  useEffect(() => {
    fetchAboutMe()
      .then((res) => setData(res))
      .catch((error) => messageApi.error(error?.message))
      .finally(() => setIsLoading(false))
  }, [messageApi])

  return (
    <section>
      {contextHolder}

      <SectionTitle>About Me</SectionTitle>

      <Table<About> loading={isLoading} dataSource={data} columns={columns} rowKey={'id'} />

      <Button type="primary" className="mt-4">
        Add a paragraph
      </Button>

      {editData && <EditModal<About> title="edit About Me" isOpen={!!itemId} confirmLoading={confirmLoading} editData={editData} editColumns={editColumns} onSave={handleEditOk} onClose={handleCancel} />}
    </section>
  )
}
