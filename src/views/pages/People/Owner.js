import React, { useEffect, useState, useRef } from 'react'
import { Table, Space, Input, Button, Modal, Form, message, Row, Col, Checkbox, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'
import { updateData, createData, deleteData, getData } from '../../../api'
import {
  SearchOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderViewOutlined,
  FileAddOutlined,
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

const OwnerTable = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentOwner, setCurrentOwner] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

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
    loadOwners()
  }, [])

  const handleError = (error) => {
    message.error((error.response && error.response.data ? error.response.data.message: '') || error.message|| error.message)
    if (error.status == 401) {
      navigate('/login')
    } else if (error.status == 500) {
      navigate('/500')
    }
  }

  const loadOwners = async () => {
    try {
      const response = await getData('owner')
      setData(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  // const handleSearch = (value) => {
  //   setSearchText(value)
  // }

  const handleCloseModal = async (values) => {
    // loadCustomers()
    setIsModalVisible(false)
    setCurrentOwner(null)
    form.resetFields()
    //message.success(res.data.message)
  }

  // const filteredData = data.filter((item) =>
  //   item.name.toLowerCase().includes(searchText.toLowerCase()),
  // )

  const showModal = (owner) => {
    setCurrentOwner(owner)
    form.setFieldsValue(owner)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('owner', id)
      loadOwners()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      let res = currentOwner
        ? await updateData('owner', currentOwner.id, values)
        : await createData('owner', values)
      loadOwners()
      setIsModalVisible(false)
      setCurrentOwner(null)
      form.resetFields()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      width: 250,
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend',
      ellipsis: true,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 250,
      ...getColumnSearchProps('username'),
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      ...getColumnSearchProps('email'),
      ellipsis: true,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 150,
      ...getColumnSearchProps('mobile'),
    },
    { title: 'Work', dataIndex: 'work', key: 'work', width: 150, ...getColumnSearchProps('work') },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (text, record) => (
        <>
          <Button color="primary" size="large" variant="text" onClick={() => showModal(record)}>
            <EditOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Button
            size="large"
            color="danger"
            style={{ marginLeft: 5 }}
            variant="text"
            onClick={() => handleDelete(record.id)}
          >
            <DeleteOutlined style={{ fontSize: '20px' }} />
          </Button>
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentOwner ? 'Edit Owner Form' : 'Add Owner Form'}
      <br></br>
    </div>
  )

  return (
    <>
      <Row style={{ display: 'block', marginBottom: 5, textAlign: 'right' }}>
        {/* <Col span={12}>
          <Input.Search
            placeholder="Search by name"
            onSearch={handleSearch}
            enterButton
            style={{ width: '100%' }}
          />
        </Col> */}
        <Col>
          <Button color="primary" variant="text" size="large" onClick={() => showModal(null)}>
            <FileAddOutlined style={{ fontSize: '20px' }}></FileAddOutlined>
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'No owners found' }}
      />
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        style={{ top: 120 }}
        onCancel={() => handleCloseModal()}
        onClose={() => handleCloseModal()}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdate}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please input valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: 'Please input mobile!' },
              {
                pattern: /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
                message: 'Please enter a valid US phone number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="work"
            label="Work Mobile"
            rules={[
              {
                pattern: /^(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
                message: 'Please enter a valid work phone number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={currentOwner ? 'New Password' : 'Password'}
            rules={[{ required: currentOwner ? false : true }]}
          >
            <Input.Password />
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              {currentOwner ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default OwnerTable
