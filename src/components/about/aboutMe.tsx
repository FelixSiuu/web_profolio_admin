'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, message, Table } from 'antd'
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

const deleteAboutMe = async (id: number) => {
  try {
    const { success, message } = await aboutService.deleteAboutMe(id)
    if (!success) throw new Error(message)
  } catch (error) {
    throw error
  }
}

const addAboutMe = async (postBody: { paragraph: About['paragraph'] }) => {
  try {
    const { success, message } = await aboutService.addAboutMe(postBody)
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
  const [modalOpen, setModalOpen] = useState(false)
  const [editItemId, setEditItemId] = useState<null | About['id']>(null)
  const [pendingDeleteId, setPendingDeleteItemId] = useState<null | About['id']>(null)

  const columns = useMemo(() => {
    return getAboutMeColumns({
      onEdit: (record) => {
        setModalOpen(true)
        setEditItemId(record.id)
      },
      onDelete: (record) => {
        setPendingDeleteItemId(record.id)
      }
    })
  }, [])

  const editData = useMemo(() => {
    return data.find((item) => item.id === editItemId)
  }, [data, editItemId])

  const handleCancel = () => {
    setEditItemId(null)
    setModalOpen(false)
  }

  /**
   * 執行編輯 / 執行添加
   */
  const handleEditOk = async (newValues: About) => {
    const isAddMode = !editItemId
    const postBody = { paragraph: newValues.paragraph }

    try {
      setConfirmLoading(true)

      switch (true) {
        case isAddMode: {
          await addAboutMe(postBody)
          messageApi.success('add success!!')
          break
        }
        case !isAddMode: {
          await editAboutMe(editItemId, postBody)
          messageApi.success('edit success!!')
          break
        }
      }

      const data = await fetchAboutMe()
      setData(data)
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message)
      }
    } finally {
      setConfirmLoading(false)
      setModalOpen(false)
    }
  }

  /**
   * 獲取數據
   */
  useEffect(() => {
    fetchAboutMe()
      .then((res) => setData(res))
      .catch((error) => messageApi.error(error?.message))
      .finally(() => setIsLoading(false))
  }, [messageApi])

  /**
   * 執行刪除
   */
  useEffect(() => {
    if (!pendingDeleteId) return

    const handleDelete = async () => {
      messageApi.open({
        type: 'loading',
        content: 'Delete in progress..',
        duration: 0
      })
      try {
        await deleteAboutMe(pendingDeleteId)
        messageApi.destroy()
        messageApi.success('delete success!!')

        const data = await fetchAboutMe()
        setData(data)
      } catch (error) {
        messageApi.destroy()
        if (error instanceof Error) {
          messageApi.error(error.message)
        }
      } finally {
        setPendingDeleteItemId(null)
      }
    }

    handleDelete()
  }, [messageApi, pendingDeleteId])

  return (
    <section>
      {contextHolder}

      <Table<About> loading={isLoading} dataSource={data} columns={columns} rowKey={'id'} />

      <Button type="primary" className="mt-3" onClick={() => setModalOpen(true)}>
        Add a paragraph
      </Button>

      {modalOpen && <EditModal<About> title={editData ? 'edit About Me' : 'add About Me'} isOpen={modalOpen} confirmLoading={confirmLoading} editData={editData} editColumns={editColumns} onSave={handleEditOk} onClose={handleCancel} />}
    </section>
  )
}
