'use client'

import { useState } from 'react'
import { Button, message, Table } from 'antd'
import { getWorkingExperienceColumns, getSubTableColumns } from './getByActionColumns'
import useExperienceHooks from '@/hooks/useExperienceHooks'
import EditModal from './editModal'

const editColumns = [
  {
    name: 'workingId'
  },
  {
    name: 'startDate'
  },
  {
    name: 'endDate',
    require: false
  },
  {
    name: 'jobTitle'
  },
  {
    name: 'company'
  },
  {
    name: 'location'
  },
  {
    name: 'keyResponsibilities',
    expandable: true
  }
]

export default function WorkingExperience() {
  const [messageApi, contextHolder] = message.useMessage()
  const { data, confirmLoading, isLoading, deleteWorkingExp, editWorkingExp, addWorkingExp } = useExperienceHooks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editItemId, setEditItemId] = useState<null | WorkingExperience['id']>(null)

  const editData = data.find((item) => item.id === editItemId)

  const handleDelete = async (id: number) => {
    messageApi.open({
      type: 'loading',
      content: 'Delete in progress',
      duration: 0
    })

    try {
      await deleteWorkingExp(id)
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

  const handleSave = async (newValues: WorkingExperience) => {
    const isAddMode = !editItemId
    const postBody = newValues

    try {
      switch (true) {
        case isAddMode: {
          await addWorkingExp(postBody)
          messageApi.success('add success!!')
          break
        }
        case !isAddMode: {
          await editWorkingExp({
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

  const columns = getWorkingExperienceColumns({
    onEdit: (record) => {
      setModalOpen(true)
      setEditItemId(record.id)
    },
    onDelete: (record) => {
      handleDelete(record.id)
    }
  })

  const expandedRowRender = (record: WorkingExperience) => <Table<KeyResponsibility> columns={getSubTableColumns()} dataSource={record.keyResponsibilities ?? []} rowKey={'id'} pagination={false} />

  return (
    <section>
      {contextHolder}

      <Table<WorkingExperience> expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }} loading={isLoading} dataSource={data} columns={columns} rowKey={'id'} />

      <Button type="primary" className="mt-3" onClick={() => setModalOpen(true)}>
        Add a Experience !!
      </Button>

      {modalOpen && <EditModal title={editData ? 'edit Experience' : 'add a Experience'} isOpen={modalOpen} confirmLoading={confirmLoading} editData={editData} editColumns={editColumns} onSave={handleSave} onClose={handleCancel} />}
    </section>
  )
}
