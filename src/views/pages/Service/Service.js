import React, { useEffect, useRef, useState } from 'react'
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Row,
  Col,
  Steps,
  Select,
  Checkbox,
  InputNumber,
  Divider,
  Space,
  Card,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  SearchOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderViewOutlined,
  FileAddOutlined,
} from '@ant-design/icons'
import { updateData, createData, deleteData, getData } from '../../../api'
import Highlighter from 'react-highlight-words'
import DynamicFormModal from './ModalForm'
import dayjs from 'dayjs'
const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'YYYY/MM/DD hh:mm:ss'

const { Step } = Steps
const { TextArea } = Input

const ServiceTable = () => {
  const [data, setData] = useState([])
  //const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [step1Values, setStep1Values] = useState({})
  const [formDataArray, setFormDataArray] = useState([
    { type: 'input', label: '', required: false, fieldname: 'field_1' },
  ]) // Default one field
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const handleOpenViewModal = () => {
    setIsViewModalVisible(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false)
  }

  const handleSubmitViewModal = (values) => {
    console.log('Submitted Values:', values)
    handleCloseViewModal()
  }

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
    loadServices()
  }, [])

  const handleError = (error) => {
    message.error((error.response && error.response.data ? error.response.data.message: '') || error.message|| error.message)
    if (error.status == 401) {
      navigate('/login')
    } else if (error.status === 500) {
      navigate('/500')
    }
  }

  const loadServices = async () => {
    try {
      const response = await getData('service')
      setData(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  //   const handleSearch = (value) => {
  //     setSearchText(value)
  //   }

  //   const filteredData = data.filter((item) =>
  //     item.name.toLowerCase().includes(searchText.toLowerCase()),
  //   )

  const showModal = (service) => {
    setCurrentService(service)
    form.setFieldsValue(service)
    if (service && service.formData) {
      setFormDataArray(service.formData) // Load existing formData
    } else {
      setFormDataArray([
        {
          type: 'input',
          label: '',
          required: false,
          fieldname: `field_1`,
        },
      ])
    }
    setIsModalVisible(true)
    setCurrentStep(0)
  }

  const showViewModal = (service) => {
    setCurrentService(service)
    setServiceName(service.name)
    if (service) {
      setFormDataArray(service.formData) // Load existing formData
    }
    setIsViewModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('service', id)
      loadServices()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const validateFormDataArray = () => {
    for (let field of formDataArray) {
      if (!field.label) {
      }
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      let valid = await form.validateFields()
      let formData = { ...step1Values, formData: formDataArray } // Add formDataArray to form values
      let res = currentService
        ? await updateData('service', currentService.id, formData)
        : await createData('service', formData)
      loadServices()
      handleCloseModal()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setCurrentService(null)
    setFormDataArray([{ type: 'input', label: '', required: false, fieldname: `field_1` }])
    form.resetFields()
  }

  const handleNextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1)
        const values = form.getFieldsValue()
        setStep1Values(values)
        console.log('Step 1 Values:', values)
      })
      .catch((info) => {
        console.log('Validation Failed:', info)
      })
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleAddField = () => {
    const newData = [
      ...formDataArray,
      { type: 'input', label: '', required: false, fieldname: `field_${formDataArray.length + 1}` },
    ]
    setFormDataArray(newData)
    form.setFieldsValue({ formData: newData })
  }
  const handleAddOption = (index, field) => {
    const newData = [...formDataArray]
    newData[index][field].push('')
    setFormDataArray(newData)
    form.setFieldsValue({ formData: newData })
  }

  const handleDeleteOption = (index, field, indexOption) => {
    const newData = [...formDataArray]
    newData[index][field].splice(indexOption, 1)
    setFormDataArray(newData)
    form.setFieldsValue({ formData: newData })
  }

  const handleRemoveField = (index) => {
    const newData = formDataArray.filter((_, i) => i !== index)
    setFormDataArray(newData)
    form.setFieldsValue({ formData: newData })
  }

  const handleFieldChange = (index, field, value) => {
    const newData = [...formDataArray]
    newData[index][field] = value
    if (field == 'type' && (value == 'select' || value == 'radio' || value == 'checkbox')) {
      newData[index].option = ['', '']
    }
    setFormDataArray(newData)
    form.setFieldsValue({ formData: newData })
    form.validateFields()
  }

  const handleFieldOptionChange = (index, field, indexOption, value) => {
    const newData = [...formDataArray]
    newData[index][field][indexOption] = value
    setFormDataArray(newData)
    form.setFieldsValue({ formData: newData })
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: (price) => price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      sorter: (a, b) => a.price - b.price,
      ellipsis: true,
    },
    {
      title: 'Description',
      ...getColumnSearchProps('description'),
      width: 400,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Create Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => dayjs(date).format(timeFormat),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      defaultSortOrder: 'descend',
      ellipsis: true,
    },
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
            color="primary"
            size="large"
            variant="text"
            onClick={() => showViewModal(record)}
            style={{ marginLeft: 5 }}
          >
            <FolderViewOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Button
            size="large"
            color="danger"
            variant="text"
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 5 }}
          >
            <DeleteOutlined style={{ fontSize: '20px' }} />
          </Button>
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentService ? 'Edit Service' : 'Add Service'}
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
        locale={{ emptyText: 'No services found' }}
      />
      <DynamicFormModal
        title={serviceName}
        visible={isViewModalVisible}
        onClose={handleCloseViewModal}
        formDataArray={formDataArray}
        onSubmit={handleSubmitViewModal}
      />
      <Modal
        title={modalTitle}
        open={isModalVisible}
        style={{ top: 120, maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden' }}
        width={1000}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Steps current={currentStep}>
          <Step title="Service Info" />
          <Step title="Format Form" />
        </Steps>

        <Form
          form={form}
          onFinish={handleAddOrUpdate}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17 }}
          style={{
            marginTop: 20,
            maxWidth: 'none',
          }}
          scrollToFirstError={true}
        >
          {currentStep === 0 && (
            <>
              {/* Step 1: Name, Price, Description */}
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input service name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                placeholder="$"
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please input service price!' }]}
              >
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please input service description!' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              {/* Step 2: Form Data */}
              {formDataArray.map((field, index) => (
                <Card
                  key={index}
                  size="small"
                  title={`Field ${index + 1}`}
                  marginLeft={70}
                  style={{ marginBottom: 15 }}
                  bodyStyle={{ marginLeft: 50 }}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        handleRemoveField(index)
                      }}
                    />
                  }
                >
                  <Row gutter={10}>
                    <Col span={7}>
                      <Form.Item
                        label="Type"
                        name={['formData', index, 'type']}
                        style={{ marginBottom: 5, marginLeft: 34 }}
                        labelCol={{ span: 6 }}
                        initialValue={'input'}
                        rules={[{ required: true, message: 'Please input field type' }]}
                      >
                        <Select onChange={(value) => handleFieldChange(index, 'type', value)}>
                          <Select.Option value="input">Input</Select.Option>
                          <Select.Option value="textarea">TextArea</Select.Option>
                          <Select.Option value="select">Select</Select.Option>
                          <Select.Option value="radio">Radio</Select.Option>
                          <Select.Option value="checkbox">Checkbox</Select.Option>
                          <Select.Option value="file">File</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label="Name"
                        name={['formData', index, 'fieldname']}
                        style={{ marginBottom: 5 }}
                        initialValue={`field_${index + 1}`}
                        rules={[
                          { required: true, message: 'Please input field name' },
                          {
                            validator: async (_, fieldname) => {
                              if (
                                formDataArray.filter((r) => r.fieldname == fieldname).length >= 2
                              ) {
                                return Promise.reject(new Error('Field name is duplicated'))
                              }
                            },
                          },
                        ]}
                      >
                        <Input
                          onChange={(e) => handleFieldChange(index, 'fieldname', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        label="Required"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 5 }}
                        style={{ marginBottom: 5 }}
                        name={['formData', index, 'required']}
                      >
                        <Checkbox
                          checked={field.required}
                          onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                        ></Checkbox>
                      </Form.Item>
                    </Col>

                    {/* <Col span={2}>
                      <Button type="primary" onClick={() => handleRemoveField(index)} danger>
                        Delete
                      </Button>
                    </Col> */}
                  </Row>
                  <Row gutter={10}>
                    <Col span={20}>
                      <Form.Item
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 28 }}
                        label="Label"
                        name={['formData', index, 'label']}
                        style={{ marginBottom: 5, marginLeft: 30 }}
                        initialValue={''}
                        rules={[{ required: true, message: 'Please input field label' }]}
                      >
                        <TextArea
                          onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {(field.type === 'select' ||
                    field.type === 'radio' ||
                    field.type === 'checkbox') && (
                    <>
                      <Row gutter={10} style={{ left: -15 }}>
                        {field.option.map((Option, indexOption) => (
                          <>
                            <Col span={10}>
                              <Form.Item
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 30 }}
                                label={`Option ${indexOption + 1}`}
                                style={{ marginBottom: 5 }}
                                name={['formData', index, 'option', indexOption]}
                                initialValue={Option}
                                rules={[{ required: true, message: 'Please input option' }]}
                              >
                                <Input.TextArea
                                  rows={1}
                                  onChange={(e) =>
                                    handleFieldOptionChange(
                                      index,
                                      'option',
                                      indexOption,
                                      e.target.value,
                                    )
                                  }
                                />
                              </Form.Item>
                            </Col>
                            {field.option.length > 1 && (
                              <>
                                <Button
                                  color="danger"
                                  variant="link"
                                  style={{ padding: '1px 13px 1px 1px' }}
                                  onClick={(e) => handleDeleteOption(index, 'option', indexOption)}
                                >
                                  x
                                </Button>
                              </>
                            )}
                          </>
                        ))}

                        <Button
                          color="primary"
                          variant="dashed"
                          onClick={(e) => handleAddOption(index, 'option')}
                          style={{ marginLeft: '5px' }}
                        >
                          +
                        </Button>
                      </Row>
                    </>
                  )}
                </Card>
              ))}
              <Button
                variant="dashed"
                color="primary"
                onClick={handleAddField}
                style={{ width: '100%' }}
              >
                + Add Field
              </Button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: 40 }} onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
            {currentStep < 1 && (
              <Button type="primary" onClick={handleNextStep}>
                Next
              </Button>
            )}
            {currentStep === 1 && (
              <Button type="primary" htmlType="submit">
                {currentService ? 'Update' : 'Add'}
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ServiceTable
