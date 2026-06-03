'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, message, Table } from 'antd'
import { getCoreSkillsColumns } from './getByActionColumns'
import EditModal from '../editModal'
import useSkillsHooks from '@/hooks/useSkillsHooks'

const editColumns = ['summary', 'details']

export default function CoreSkills() {
  const [messageApi, contextHolder] = message.useMessage()
  const { data, confirmLoading, isLoading, fetchCoreSkills, deleteCoreSkill, editCoreSkill, addCoreSkill } = useSkillsHooks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editItemId, setEditItemId] = useState<null | CoreSkill['id']>(null)

  const editData = useMemo(() => {
    return data.find((item) => item.id === editItemId)
  }, [data, editItemId])

  const getData = useCallback(async () => {
    try {
      await fetchCoreSkills()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }, [fetchCoreSkills])

  const handleDelete = useCallback(
    async (id: number) => {
      messageApi.open({
        type: 'loading',
        content: 'Delete in progress',
        duration: 0
      })

      try {
        await deleteCoreSkill(id)
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
    [messageApi, deleteCoreSkill, getData]
  )

  const columns = useMemo(() => {
    return getCoreSkillsColumns({
      onEdit: (record) => {
        setModalOpen(true)
        setEditItemId(record.id)
      },
      onDelete: (record) => {
        handleDelete(record.id)
      }
    })
  }, [handleDelete])

  const handleSave = async (newValues: CoreSkill) => {
    const isAddMode = !editItemId
    const postBody = { summary: newValues.summary, details: newValues.details }

    try {
      switch (true) {
        case isAddMode: {
          await addCoreSkill(postBody)
          messageApi.success('add success!!')
          break
        }
        case !isAddMode: {
          await editCoreSkill(editItemId, postBody)
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

      <Table<CoreSkill> loading={isLoading} dataSource={data} columns={columns} rowKey={'id'} />

      <Button type="primary" className="mt-3" onClick={() => setModalOpen(true)}>
        Add a Skill !!
      </Button>

      {modalOpen && <EditModal<CoreSkill> title={editData ? 'edit Skill' : 'add a Skill'} isOpen={modalOpen} confirmLoading={confirmLoading} editData={editData} editColumns={editColumns} onSave={handleSave} onClose={handleCancel} />}
    </section>
  )
}
