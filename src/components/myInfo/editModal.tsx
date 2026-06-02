import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'

interface EditModal<T> {
  title: string
  isOpen: boolean
  confirmLoading: boolean
  editColumns: string[]
  editData: T
  onClose: () => void
  onSave: (values: T) => Promise<void>
}

export default function EditModal<T extends { id: string | number }>({ title, isOpen, confirmLoading, editColumns, editData, onClose, onSave }: EditModal<T>) {
  const [form] = Form.useForm()

  const handleOk = async () => {
    try {
      const values: T = await form.validateFields()
      onSave(values)
    } catch (error) {
      console.error('表單驗證失敗:', error)
    }
  }

  useEffect(() => {
    if (isOpen && editData) {
      for (const [key, value] of Object.entries(editData)) {
        form.setFieldValue(key, value)
      }
    } else {
      form.resetFields()
    }
  }, [isOpen, editData, form])

  return (
    <Modal title={title} open={isOpen} confirmLoading={confirmLoading} onOk={handleOk} onCancel={onClose} destroyOnHidden>
      <Form form={form} disabled={confirmLoading} layout="vertical" autoComplete="off" name="edit_form">
        {editColumns.map((name) => {
          return (
            <Form.Item key={name} name={name} layout="vertical" label={name} rules={[{ required: true }]}>
              <Input.TextArea rows={6} />
            </Form.Item>
          )
        })}
      </Form>
    </Modal>
  )
}
