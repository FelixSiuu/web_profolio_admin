'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, message, Table } from 'antd'
import { getAboutMeColumns } from './getByActionColumns'
import EditModal from './editModal'
import useAboutHooks from '@/hooks/useAboutHooks'

const editColumns = ['paragraph']

export default function AboutMe() {
  const [messageApi, contextHolder] = message.useMessage()
  const { data, confirmLoading, isLoading, fetchAboutMe, editAboutMe, deleteAboutMe, addAboutMe } = useAboutHooks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editItemId, setEditItemId] = useState<null | About['id']>(null)

  const editData = useMemo(() => {
    return data.find((item) => item.id === editItemId)
  }, [data, editItemId])

  const getData = useCallback(async () => {
    try {
      await fetchAboutMe()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }, [fetchAboutMe])

  const handleDelete = useCallback(
    async (id: number) => {
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

        await getData()
      } catch (error) {
        messageApi.destroy()
        if (error instanceof Error) {
          messageApi.error(error?.message)
        }
      }
    },
    [messageApi, deleteAboutMe, getData]
  )

  const columns = useMemo(() => {
    return getAboutMeColumns({
      onEdit: (record) => {
        setModalOpen(true)
        setEditItemId(record.id)
      },
      onDelete: (record) => {
        handleDelete(record.id)
      }
    })
  }, [handleDelete])

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
          await editAboutMe(editItemId, postBody)
          messageApi.success('edit success!!')
          break
        }
      }

      await getData()
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

  useEffect(() => {
    getData()
  }, [getData])

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
