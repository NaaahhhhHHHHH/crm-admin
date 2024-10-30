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
const CustomerTable = () => {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

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
    loadCustomers()
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

  const loadCustomers = async () => {
    try {
      const response = await getData('customer')
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

  const showModal = (customer) => {
    setCurrentCustomer(customer)
    form.setFieldsValue(customer)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('customer', id)
      loadCustomers()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      let res = currentCustomer
        ? await updateData('customer', currentCustomer.id, values)
        : await createData('customer', values)
      loadCustomers()
      setIsModalVisible(false)
      setCurrentCustomer(null)
      form.resetFields()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = async (values) => {
    // loadCustomers()
    setIsModalVisible(false)
    setCurrentCustomer(null)
    form.resetFields()
    //message.success(res.data.message)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      className: 'custom-width',
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend',
      textWrap: 'word-break',
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
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
      //ellipsis: true,
      textWrap: 'word-break',
      className: 'custom-width',
      key: 'email',
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      ...getColumnSearchProps('mobile'),
      ellipsis: true,
      width: 120,
      key: 'mobile',
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Work',
      dataIndex: 'work',
      ...getColumnSearchProps('work'),
      width: 120,
      key: 'work',
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Verification',
      dataIndex: 'verification',
      key: 'verification',
      align: 'center',
      width: 120,
      filters: [
        {
          text: <CheckOutlined style={{ color: 'green' }} />,
          value: true,
        },
        {
          text: <CloseOutlined style={{ color: 'red' }} />,
          value: false,
        },
      ],
      onFilter: (value, record) => record.verification === value,
      //filterSearch: true,
      render: (text) => (
        <div>
          {text ? (
            <CheckOutlined style={{ color: 'green', fontSize: '18px' }} />
          ) : (
            <CloseOutlined style={{ color: 'red', fontSize: '18px' }} />
          )}
        </div>
      ),
      showOnResponse: true,
      showOnDesktop: true,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (text, record) => (
        <>
          <Button color="primary" size="large" variant="text" onClick={() => showModal(record)}>
            <EditOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Popconfirm
            placement="bottom"
            title={'Delete customer'}
            description={'Are you sure to delete this customer?'}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              size="large"
              color="danger"
              variant="text"
              style={{ marginLeft: 5 }}
              //onClick={() => handleDelete(record.id)}
            >
              <DeleteOutlined style={{ fontSize: '20px' }} />
            </Button>
          </Popconfirm>
        </>
      ),
      showOnResponse: true,
      showOnDesktop: true,
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentCustomer ? 'Edit Customer Form' : 'Add Customer Form'}
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
        locale={{ emptyText: 'No customers found' }}
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
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input disabled={currentCustomer ? true : false} />
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
            label={currentCustomer ? 'New Password' : 'Password'}
            rules={[{ required: currentCustomer ? false : true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="verification" label="Verification" initialValue={false}>
            <Radio.Group>
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              {currentCustomer ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default CustomerTable
