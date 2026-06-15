'use client'

import { useState } from 'react'
import useEducationHooks from '@/hooks/useEducationHooks'
import { Form, Table, Input, message, Button } from 'antd'
import { EditableColumnType, getActionColums } from './getByActionColumns'

interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: string
  inputType: 'number' | 'text'
  record: T
  index: number
  required?: boolean
  isTextArea?: boolean
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps<Education>>> = ({ editing, dataIndex, title, children, required = true, isTextArea = false, ...restProps }) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: required,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {isTextArea ? <Input.TextArea autoSize={{ minRows: 2 }} /> : <Input />}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export default function Education() {
  const [messageApi, contextHolder] = message.useMessage()
  const { data, isLoading, confirmLoading, addEducation, editEducation, deleteEducation } = useEducationHooks()
  const [form] = Form.useForm()

  const [editingKey, setEditingKey] = useState<null | number>(null)
  // 🎯 只用來記錄「當前正在被新增的虛擬行」，沒新增時就是 null
  const [pendingRecord, setPendingRecord] = useState<Education | null>(null)

  const isEditing = (record: Education) => record.id === editingKey

  const edit = (record: Education) => {
    form.setFieldsValue(record)
    setEditingKey(record.id)
    setPendingRecord(null)
  }

  const cancel = () => {
    setEditingKey(null)
    setPendingRecord(null) // 🟢 取消時，直接把虛擬行扔掉，完全不需要對比長度！
    form.resetFields()
  }

  const save = async (key: number) => {
    try {
      const row = await form.validateFields()

      // 合并编辑后的数据
      const updatedRecord = {
        ...data.find((item: Education) => item.id === key),
        ...row
      }

      if (!pendingRecord) {
        // 執行編輯
        await editEducation({
          id: key,
          postBody: updatedRecord
        })
        messageApi.success('Edit success!!')
      } else {
        // 執行添加
        await addEducation(updatedRecord)
        messageApi.success('Add success!!')
      }

      setEditingKey(null)
      setPendingRecord(null)
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message)
    }
  }

  const onDelete = async (key: number) => {
    try {
      await deleteEducation(key)
      messageApi.success('Delete success!!')
    } catch (error) {
      if (error instanceof Error) messageApi.error(error.message)
    }
  }

  const columns = getActionColums(
    {
      onEdit: edit,
      onSave: save,
      onCancel: cancel,
      onDelete: onDelete
    },
    isEditing
  )

  const handleAdd = () => {
    const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1
    const newRecord: Education = {
      id: newId,
      startDate: '',
      endDate: null,
      institution: '',
      degree: null,
      major: '',
      location: ''
    }

    // 🟢 動作：把虛擬行存起來，並直接開啟編輯
    setPendingRecord(newRecord)
    setEditingKey(newId)
    form.setFieldsValue(newRecord)
  }

  // 🎯 這裡宣告成剛才訂製好的 EditableColumnType<Education> 陣列項
  const mergedColumns = columns.map((col: EditableColumnType<Education>) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: typeof col.title === 'string' ? col.title : String(col.title || ''),
        editing: isEditing(record),
        required: col.required ?? true // 預設為required，除非特別標註不需要
      })
    }
  })

  return (
    <section>
      {contextHolder}

      <Form form={form} component={false} disabled={confirmLoading}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={pendingRecord ? [pendingRecord, ...data] : data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel
          }}
          loading={isLoading}
          rowKey="id"
        />
      </Form>

      <Button type="primary" className="mt-3" onClick={handleAdd}>
        Add a Education !!
      </Button>
    </section>
  )
}
