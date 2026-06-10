import { utils } from '@/utils'
import { Button, Popconfirm, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { QuestionCircleOutlined } from '@ant-design/icons'

interface ColumnActions<T> {
  onEdit: (record: T) => void
  onDelete: (record: T) => void
}

export const getCoreSkillsColumns = <T extends CoreSkill>(actions: ColumnActions<T>): ColumnsType<T> => [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'summary',
    dataIndex: 'summary',
    key: 'summary'
  },
  {
    title: 'details',
    dataIndex: 'details',
    key: 'details'
  },
  {
    title: 'create time',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (_, record) => {
      return <>{utils.formatDateString(record.createTime)}</>
    }
  },
  {
    title: 'update time',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: (_, record) => {
      return <>{utils.formatDateString(record.updateTime)}</>
    }
  },
  {
    fixed: 'right',
    title: 'action',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => actions.onEdit(record)}>
          edit
        </Button>

        <Popconfirm title="Delete the data" onConfirm={() => actions.onDelete(record)} description="Are you sure to delete?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
          <Button type="link" danger>
            delete
          </Button>
        </Popconfirm>
      </Space>
    )
  }
]
