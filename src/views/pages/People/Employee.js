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
import { useSelector, useDispatch } from 'react-redux'
import '../index.css'
import {
  SearchOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  FileAddOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

const EmployeeTable = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const user = useSelector((state) => state.user)
  const role = user ? user.role : ''
  const userId = user ? user.id : 0

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
    loadEmployees()
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

  const loadEmployees = async () => {
    try {
      const response = await getData('employee')
      setData(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  // const handleSearch = (value) => {
  //   setSearchText(value)
  // }

  // const filteredData = data.filter((item) =>
  //   item.name.toLowerCase().includes(searchText.toLowerCase()),
  // )

  const showModal = (employee) => {
    setCurrentEmployee(employee)
    form.setFieldsValue(employee)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('employee', id)
      loadEmployees()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      let res = currentEmployee
        ? await updateData('employee', currentEmployee.id, values)
        : await createData('employee', values)
      loadEmployees()
      setIsModalVisible(false)
      setCurrentEmployee(null)
      form.resetFields()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = async () => {
    // loadCustomers()
    setIsModalVisible(false)
    setCurrentEmployee(null)
    form.resetFields()
    //message.success(res.data.message)
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
      title: 'Name',
      dataIndex: 'name',
      className: 'custom-width',
      key: 'name',
      ...getColumnSearchProps('name'),
      textWrap: 'word-break',
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend',
      fixed: 'left',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      ...getColumnSearchProps('username'),
      className: 'custom-width',
      // ellipsis: true,
      textWrap: 'word-break',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
      //ellipsis: true,
      textWrap: 'word-break',
      className: 'custom-width',
      key: 'email',
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
      fixed: 'right',
      width: 150,
      render: (text, record) => (
        <>
          {role == 'owner' && (
            <>
              <Button color="primary" size="large" variant="text" onClick={() => showModal(record)}>
                <EditOutlined style={{ fontSize: '20px' }} />
              </Button>
              <Popconfirm
                placement="bottom"
                title={'Delete employee'}
                description={'Are you sure to delete this employee?'}
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button
                  size="large"
                  color="danger"
                  style={{ marginLeft: 5 }}
                  variant="text"
                  // onClick={() => handleDelete(record.id)}
                >
                  <DeleteOutlined style={{ fontSize: '20px' }} />
                </Button>
              </Popconfirm>
            </>
          )}
          {role == 'employee' && (
            <>
              <Button color="primary" size="large" variant="text" onClick={() => showModal(record)}>
                <EyeOutlined style={{ fontSize: '20px' }} />
              </Button>
            </>
          )}
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentEmployee ? 'Edit Employee Form' : 'Add Employee Form'}
      <br></br>
    </div>
  )

  return (
    <>
      {role == 'owner' && (
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
      )}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'No employees found' }}
        tableLayout="auto"
        scroll={{
          x: '100%',
        }}
      />
      <Modal
        title={modalTitle}
        open={isModalVisible}
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
            scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
          >
            <Input readOnly={role == 'employee'} />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input disabled={currentEmployee ? true : false} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please input valid email!' },
            ]}
          >
            <Input readOnly={role == 'employee'} />
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
            <Input readOnly={role == 'employee'} />
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
            <Input readOnly={role == 'employee'} />
          </Form.Item>
          {role == 'owner' && (
            <>
              <Form.Item
                name="password"
                label={currentEmployee ? 'New Password' : 'Password'}
                rules={[{ required: currentEmployee ? false : true }]}
              >
                <Input.Password 
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
                />
              </Form.Item>
              <div style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit">
                  {currentEmployee ? 'Update' : 'Add'}
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default EmployeeTable
