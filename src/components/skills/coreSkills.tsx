'use client'

import { useState } from 'react'
import { Button, message, Table } from 'antd'
import { getCoreSkillsColumns } from './getByActionColumns'
import EditModal from '../editModal'
import useSkillsHooks from '@/hooks/useSkillsHooks'

const editColumns = ['summary', 'details']

export default function CoreSkills() {
  const [messageApi, contextHolder] = message.useMessage()

  // 🎯 1. 狀態全自動接管：從 Hook 拿到自動綁定快取的 data 與 loading 狀態
  const { data, confirmLoading, isLoading, deleteCoreSkill, editCoreSkill, addCoreSkill } = useSkillsHooks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editItemId, setEditItemId] = useState<null | CoreSkill['id']>(null)

  const editData = data.find((item) => item.id === editItemId)

  // 🎯 3. 簡化後的刪除邏輯：不再需要手動呼叫 getData()
  const handleDelete = async (id: number) => {
    messageApi.open({ type: 'loading', content: 'Delete in progress', duration: 0 })
    try {
      await deleteCoreSkill(id)
      messageApi.destroy()
      messageApi.success('Delete success!!')
    } catch (error) {
      messageApi.destroy()
      if (error instanceof Error) messageApi.error(error.message)
    }
  }

  // 4. 表格欄位配置
  const columns = getCoreSkillsColumns({
    onEdit: (record) => {
      setEditItemId(record.id)
      setModalOpen(true)
    },
    onDelete: (record) => {
      handleDelete(record.id)
    }
  })

  // 🎯 5. 簡化後的儲存邏輯：同樣砍掉手動的 getData()
  const handleSave = async (newValues: CoreSkill) => {
    const isAddMode = !editItemId
    const postBody = { summary: newValues.summary, details: newValues.details }

    try {
      if (isAddMode) {
        await addCoreSkill(postBody)
      } else {
        await editCoreSkill({
          id: editItemId,
          postBody: postBody
        })
      }
      setModalOpen(false)
      setEditItemId(null)
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message)
    }
  }

  const handleCancel = () => {
    setEditItemId(null)
    setModalOpen(false)
  }

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
