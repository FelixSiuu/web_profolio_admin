'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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
  const { data, confirmLoading, isLoading, fetchWorkingExp, deleteWorkingExp, editWorkingExp, addWorkingExp } = useExperienceHooks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editItemId, setEditItemId] = useState<null | WorkingExperience['id']>(null)

  const editData = useMemo(() => {
    return data.find((item) => item.id === editItemId)
  }, [data, editItemId])

  const getData = useCallback(async () => {
    try {
      await fetchWorkingExp()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }, [fetchWorkingExp])

  const handleDelete = useCallback(
    async (id: number) => {
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

        await getData()
      } catch (error) {
        messageApi.destroy()
        if (error instanceof Error) {
          messageApi.error(error?.message)
        }
      }
    },
    [deleteWorkingExp, getData, messageApi]
  )

  const columns = useMemo(() => {
    return getWorkingExperienceColumns({
      onEdit: (record) => {
        setModalOpen(true)
        setEditItemId(record.id)
      },
      onDelete: (record) => {
        handleDelete(record.id)
      }
    })
  }, [handleDelete])

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
          await editWorkingExp(editItemId, postBody)
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
