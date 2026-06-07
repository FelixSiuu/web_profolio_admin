'use client'

import { useState } from 'react'
import { Button, message, Table } from 'antd'
import { getAboutMeColumns } from './getByActionColumns'
import EditModal from '../editModal'
import useAboutHooks from '@/hooks/useAboutHooks'

const editColumns = ['paragraph']

export default function AboutMe() {
  const [messageApi, contextHolder] = message.useMessage()
  const { data, confirmLoading, isLoading, editAboutMe, deleteAboutMe, addAboutMe } = useAboutHooks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editItemId, setEditItemId] = useState<null | About['id']>(null)

  const editData = data.find((item) => item.id === editItemId)

  const handleDelete = async (id: number) => {
    messageApi.open({
      type: 'loading',
      content: 'Delete in progress',
      duration: 0
    })

    try {
      await deleteAboutMe(id)
      messageApi.destroy()
      messageApi.open({
        type: 'success',
        content: 'Delete success!!'
      })
    } catch (error) {
      messageApi.destroy()
      if (error instanceof Error) {
        messageApi.error(error?.message)
      }
    }
  }

  const handleSave = async (newValues: About) => {
    const isAddMode = !editItemId
    const postBody = { paragraph: newValues.paragraph }

    try {
      switch (true) {
        case isAddMode: {
          await addAboutMe(postBody)
          messageApi.success('add success!!')
          break
        }
        case !isAddMode: {
          await editAboutMe({
            id: editItemId,
            postBody
          })
          messageApi.success('edit success!!')
          break
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message)
      }
    } finally {
      setModalOpen(false)
    }
  }

  const handleCancel = () => {
    setEditItemId(null)
    setModalOpen(false)
  }

  const columns = getAboutMeColumns({
    onEdit: (record) => {
      setModalOpen(true)
      setEditItemId(record.id)
    },
    onDelete: (record) => {
      handleDelete(record.id)
    }
  })

  return (
    <section>
      {contextHolder}

      <Table<About> loading={isLoading} dataSource={data} columns={columns} rowKey={'id'} />

      <Button type="primary" className="mt-3" onClick={() => setModalOpen(true)}>
        Add a paragraph
      </Button>

      {modalOpen && <EditModal<About> title={editData ? 'edit About Me' : 'add About Me'} isOpen={modalOpen} confirmLoading={confirmLoading} editData={editData} editColumns={editColumns} onSave={handleSave} onClose={handleCancel} />}
    </section>
  )
}
