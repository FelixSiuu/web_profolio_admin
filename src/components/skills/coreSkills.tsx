'use client'

import { useState } from 'react'
import { Form, Table, Input, message, Button } from 'antd'
import { EditableColumnType, getActionColums } from './getByActionColumns'
import useSkillsHooks from '@/hooks/useSkillsHooks'

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

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps<CoreSkill>>> = ({ editing, dataIndex, title, children, required = true, isTextArea = false, ...restProps }) => {
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

export default function CoreSkills() {
  const [messageApi, contextHolder] = message.useMessage()
  const { data, confirmLoading, isLoading, deleteCoreSkill, editCoreSkill, addCoreSkill } = useSkillsHooks()
  const [form] = Form.useForm()

  const [editingKey, setEditingKey] = useState<null | number>(null)
  // 🎯 只用來記錄「當前正在被新增的虛擬行」，沒新增時就是 null
  const [pendingRecord, setPendingRecord] = useState<CoreSkill | null>(null)

  const isEditing = (record: CoreSkill) => record.id === editingKey

  const edit = (record: CoreSkill) => {
    form.setFieldsValue(record)
    setEditingKey(record.id)
    setPendingRecord(null)
  }

  const cancel = () => {
    setEditingKey(null)
    setPendingRecord(null)
    form.resetFields()
  }

  const onDelete = async (id: number) => {
    try {
      await deleteCoreSkill(id)
      messageApi.success('Delete success!!')
    } catch (error) {
      messageApi.destroy()
      if (error instanceof Error) messageApi.error(error.message)
    }
  }

  const save = async (key: number) => {
    try {
      const row = await form.validateFields()

      // 合并编辑后的数据
      const updatedRecord = {
        ...data.find((item: CoreSkill) => item.id === key),
        ...row
      }

      if (!pendingRecord) {
        // 執行編輯
        await editCoreSkill({
          id: key,
          postBody: updatedRecord
        })
        messageApi.success('Edit success!!')
      } else {
        // 執行添加
        await addCoreSkill(updatedRecord)
        messageApi.success('Add success!!')
      }

      setEditingKey(null)
      setPendingRecord(null)
    } catch (error) {
      if (error instanceof Error) {
        messageApi.error(error.message)
      }
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
    const newRecord: CoreSkill = {
      id: newId,
      summary: '',
      details: '',
      createTime: '',
      updateTime: ''
    }

    // 🟢 動作：把虛擬行存起來，並直接開啟編輯
    setPendingRecord(newRecord)
    setEditingKey(newId)
    form.setFieldsValue(newRecord)
  }

  // 🎯 這裡宣告成剛才訂製好的 EditableColumnType<Education> 陣列項
  const mergedColumns = columns.map((col: EditableColumnType<CoreSkill>) => {
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
        required: col.required ?? true, // 預設為required，除非特別標註不需要
        isTextArea: col.isLongText
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
          dataSource={pendingRecord ? [...data, pendingRecord] : data}
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
        Add a Skill !!
      </Button>
    </section>
  )
}
