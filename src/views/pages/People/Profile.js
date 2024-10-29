import React, { useEffect, useState, useRef } from 'react'
import { Table, Space, Input, Button, Modal, Form, message, Row, Col, Checkbox, Radio } from 'antd'
import { useNavigate } from 'react-router-dom'
import { updateData, createData, deleteData, getData } from '../../../api'
import {
  SearchOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  FileAddOutlined,
} from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { useSelector, useDispatch } from 'react-redux'

const EmployeeTable = () => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const user = useSelector((state) => state.user)
  const name = user && user.name ? user.name.split(' ')[0] : ''
  const role = user && user.role ? user.role : ''
  const id = user && user.id ? user.id : 0
  
  useEffect(() => {
    loadProfile()
  }, [user])

  const handleError = (error) => {
    message.error((error.response && error.response.data ? error.response.data.message: '') || error.message|| error.message)
    if (error.status == 401) {
      navigate('/login')
    } else if (error.status == 500) {
      navigate('/500')
    }
  }

  const handleUpdate = async (values) => {
    try {
      let res = await updateData(`${role}`, `${id}`, values)
      let updateUser = {... user}
      updateUser.name = values.name
      dispatch({ type: 'set', user: updateUser })
      loadProfile()
      //form.resetFields()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const loadProfile = async () => {
    try {
      const response = await getData(`${role}/${id}`)
      setData(response.data)
      form.setFieldsValue(response.data)
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

  return (
    <>
        <Form
          form={form}
          // layout="vertical"
          onFinish={handleUpdate}
          labelCol= {{
            xs: { span: 24 },
            sm: { span: 8 },
          }}
          wrapperCol= {{
            xs: { span: 14 },
            sm: { span: 10 },
          }}
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
            <Input disabled={true}/>
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
          {/* <Form.Item
            name="password"
            label={currentEmployee ? 'New Password' : 'Password'}
            rules={[{ required: currentEmployee ? false : true }]}
          >
            <Input.Password />
          </Form.Item> */}
          <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
            <Button type="primary" htmlType="submit">
              {'Update'}
            </Button>
          </Form.Item>
        </Form>
    </>
  )
}

export default EmployeeTable
