import React, { useEffect, useState, useRef } from 'react'
import {
  Table,
  Space,
  Input,
  Button,
  Modal,
  Form,
  message,
  Row,
  Col,
  Checkbox,
  Radio,
  Popconfirm,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { updateData, createData, deleteData, getData } from '../../../api'
import dayjs from 'dayjs'
const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'YYYY/MM/DD hh:mm:ss'
import '../index.css'
import {
  SearchOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  FileAddOutlined,
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
// import { createStyles } from 'antd-style';
// const useStyle = createStyles(({ css, token }) => {
//   const { antCls } = token;
//   return {
//     customTable: css`
//       ${antCls}-table {
//         ${antCls}-table-container {
//           ${antCls}-table-body,
//           ${antCls}-table-content {
//             scrollbar-width: thin;
//             scrollbar-color: #eaeaea transparent;
//             scrollbar-gutter: stable;
//           }
//         }
//       }
//     `,
//   };
// });
const HistoryTable = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentHistory, setCurrentHistory] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  // const { styles } = useStyle();
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  useEffect(() => {
    loadHistory()
  }, [])

  const handleError = (error) => {
    message.error(
      (error.response && error.response.data ? error.response.data.message : '') ||
        error.message ||
        error.message,
    )
    if (error.status == 401) {
      navigate('/login')
    } else if (error.status == 500) {
      navigate('/500')
    }
  }

  const loadHistory = async () => {
    try {
      const response = await getData('historyLog')
      setData(response.data)
    } catch (error) {
      handleError(error)
    }
  }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id - b.id,
      fixed: 'left',
    },
    {
      title: 'Log',
      dataIndex: 'text',
      className: 'custom-width',
      key: 'text',
      ...getColumnSearchProps('text'),  
      sorter: (a, b) => a.text.localeCompare(b.text),
      textWrap: 'word-break',
      fixed: 'left',
    },
    {
      title: 'Create Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format(timeFormat),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      width: 180,
      defaultSortOrder: 'descend',
    },
  ]

  const highlightLineDiffs = (before = {}, after = {}) => {
    const beforeLines = JSON.stringify(before, null, 2).split('\n')
    const afterLines = JSON.stringify(after, null, 2).split('\n')
  
    const maxLength = Math.max(beforeLines.length, afterLines.length)
  
    const getLine = (line, color) => (
      <div style={{ backgroundColor: color }}>{line}</div>
    )
  
    const renderBeforeLines = () =>
      Array.from({ length: maxLength }).map((_, i) => {
        const isDifferent = beforeLines[i] !== afterLines[i]
        return getLine(beforeLines[i] || '', isDifferent ? '#ffecec' : 'transparent')
      })
  
    const renderAfterLines = () =>
      Array.from({ length: maxLength }).map((_, i) => {
        const isDifferent = beforeLines[i] !== afterLines[i]
        return getLine(afterLines[i] || '', isDifferent ? '#e6ffed' : 'transparent')
      })
  
    return {
      before: renderBeforeLines(),
      after: renderAfterLines()
    }
  }
  

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'No logs found' }} 
        tableLayout="auto"
        scroll={{
          x: '100%',
        }}
        expandable={{
          expandedRowRender: (record) => {
            const { before, after } = highlightLineDiffs(record.before, record.after)
          
            return (
              <>
                <div style={{ gap: 15, display: 'flex' }}>
                  <td style={{ margin: 5 }}>Model: {record.model}</td>
                  <td style={{ margin: 5 }}>Method: {record.operation}</td>
                </div>
                <div style={{ gap: 15, display: 'flex' }}>
                  <td style={{ margin: 5 }}>Name: {record.user.name}</td>
                  <td style={{ margin: 5 }}>Role: {record.user.role}</td>
                  </div>
                {Array.isArray(record.change) && record.change.length > 0 && (
                <div style={{ gap: 15, display: 'flex' }}>
                  <td style={{ margin: 5 }}>Change field: {record.change.join(', ')}</td>
                </div>
                )}
                <div style={{ gap: 15, display: 'flex' }}>
                  <td style={{ margin: 5 }}>Detail:</td>
                  </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <pre style={{ flex: 1, background: '#f6f6f6', padding: '12px', borderRadius: '8px', overflowX: 'auto' }}>
                    Before:
                    {before}
                  </pre>
                  <pre style={{ flex: 1, background: '#f6f6f6', padding: '12px', borderRadius: '8px', overflowX: 'auto' }}>
                    After:
                    {after}
                  </pre>
                </div>
              </>
            )
          },
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys([record.id])
            } else {
              setExpandedRowKeys([])
            }
          },
          rowExpandable: (record) => record,
        }}
      />
    </>
  )
}

export default HistoryTable
