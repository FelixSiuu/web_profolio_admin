import { Button, Form, Input, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface EditModal<T> {
  title: string
  isOpen: boolean
  confirmLoading: boolean
  editColumns: { name: string; require?: boolean; expandable?: boolean }[]
  editData: T | undefined | null
  onClose: () => void
  onSave: (values: T) => Promise<void>
}

export default function EditModal<T>({ title, isOpen, confirmLoading, editColumns, editData, onClose, onSave }: EditModal<T>) {
  const [form] = Form.useForm()

  const handleOk = async () => {
    try {
      const values: T = await form.validateFields()
      onSave(values)
    } catch (error) {
      console.error('表單驗證失敗:', error)
    }
  }

  return (
    <Modal title={title} open={isOpen} confirmLoading={confirmLoading} onOk={handleOk} onCancel={onClose} destroyOnHidden>
      <Form form={form} disabled={confirmLoading} initialValues={editData ?? undefined} layout="vertical" autoComplete="off" name="edit_form">
        {editColumns.map((item) => {
          if (item.expandable) {
            return (
              <Form.Item label={item.name} layout="vertical" key={item.name}>
                <Form.List name={item.name}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="grid grid-cols-[1fr_40px] gap-x-4 mb-4 items-center">
                          <Form.Item {...restField} name={[name, 'title']} label="title" rules={[{ required: false, message: 'Missing title' }]}>
                            <Input />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, 'responsibility']} label="responsibility" rules={[{ required: true, message: 'Missing responsibility' }]}>
                            <Input.TextArea autoSize={{ minRows: 2 }} />
                          </Form.Item>

                          <div
                            className="items-center justify-center h-full flex"
                            style={{
                              gridColumn: '2',
                              gridRow: '1 / span 2' // 👈 相當於 rowSpan=2
                            }}
                          >
                            <DeleteOutlined className="text-red-500 cursor-pointer text-xl hover:text-red-700 transitions-colors" onClick={() => remove(name)} />
                          </div>
                        </div>
                      ))}

                      <Button type="dashed" onClick={() => add()} block style={{ marginTop: '8px' }}>
                        + Add Responsibility Item
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            )
          }

          return (
            <Form.Item key={item.name} name={item.name} layout="vertical" label={item.name} rules={[{ required: item.require ?? true, message: `Missing ${item.name}` }]}>
              <Input />
            </Form.Item>
          )
        })}
      </Form>
    </Modal>
  )
}
