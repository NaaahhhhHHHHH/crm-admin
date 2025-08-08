import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
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
  Popconfirm,
  Radio,
  DatePicker,
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
import '../index.css'
import { updateData, createData, deleteData, getData } from '../../../api'
import Highlighter from 'react-highlight-words'
import DynamicFormModal from './ModalForm'
import { main } from '@popperjs/core'
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
  const [step2Values, setStep2Values] = useState([])
  const [employeeData, setEmployeeData] = useState([])
  const [formDataArray, setFormDataArray] = useState([
    { type: 'input', label: '', required: false, fieldname: 'field_1' },
  ]) // Default one field
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [bluePrint, setBlueprint] = useState({
    checked: false,
    listE: [],
  })
  const [maintain, setMaintain] = useState({
    checked: false,
    period: null,
    price: null,
    date: null,
    remind: null,
    listE: [],
  })
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
    message.error(
      (error.response && error.response.data ? error.response.data.message : '') ||
        error.message ||
        error.message,
    )
    if (error.status == 401) {
      navigate('/login')
    } else if (error.status === 500) {
      navigate('/500')
    }
  }

  const loadServices = async () => {
    try {
      const [response0, response1] = await Promise.all([getData('service'), getData('employee')])
      let serviceData = response0.data
      setData(serviceData)
      let employeeList = response1.data
      let employeeOption = employeeList.map((r) => ({ label: r.name, value: r.id }))
      setEmployeeData(employeeOption)
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
    let serviceData = service
    if (serviceData && serviceData.formData && serviceData.blueprint) {
      // if (serviceData.blueprint && serviceData.blueprint.listE) {
      //   serviceData.blueprint.listE.forEach((re) => {
      //     if (re.payment && re.payment.method == 'Period') {
      //       re.payment.period.forEach((pe) => {
      //         pe.date = dayjs(pe.date, dateFormat)
      //       })
      //     }
      //   })
      // }
      setCurrentService(serviceData)
      form.setFieldsValue(serviceData)
      setFormDataArray(serviceData.formData) // Load existing formData
      setBlueprint(serviceData.blueprint)
      setMaintain(
        serviceData.maintain
          ? serviceData.maintain
          : {
              checked: false,
              period: null,
              price: null,
              date: null,
              remind: null,
              listE: [],
            },
      )
    } else {
      setFormDataArray([
        {
          type: 'input',
          label: '',
          required: false,
          fieldname: `field_1`,
        },
      ])
      setBlueprint({
        checked: false,
        listE: [],
      })
      setMaintain({
        checked: false,
        period: null,
        price: null,
        date: null,
        remind: null,
        listE: [],
      })
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
      let r = { ...step1Values }
      // if (r.blueprint && r.blueprint.listE) {
      //   r.blueprint.listE.forEach((re) => {
      //     if (re.payment && re.payment.method == 'Period') {
      //       re.payment.period.forEach((pe) => {
      //         pe.date = pe.date.format(dateFormat)
      //       })
      //     }
      //   })
      // }
      let formData = { ...step1Values, formData: formDataArray, maintain: maintain } // Add formDataArray to form values
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
    setBlueprint({
      checked: false,
      listE: [
        {
          eid: null,
          expire: null,
          reassignment: false,
          status: 'Waiting',
          payment: {
            method: '1 Time',
            budget: null,
            currentbudget: null,
          },
        },
      ],
    })
    setFormDataArray([{ type: 'input', label: '', required: false, fieldname: `field_1` }])
    form.resetFields()
  }

  const handleNextStep = async () => {
    await form
      .validateFields()
      .then(() => {
        if (currentStep == 0) {
          setCurrentStep(currentStep + 1)
          const values = form.getFieldsValue()
          values.blueprint = { ...bluePrint }
          setStep1Values(values)
          console.log('Step 1 Values:', values)
        } else if (currentStep == 1) {
          setCurrentStep(currentStep + 1)
          const values = form.getFieldsValue()
          // values.blueprint = { ...bluePrint }
          setStep2Values(values)
          // console.log('Step 1 Values:', values)
        }
      })
      .catch((info) => {
        form
          .getFieldInstance(info.errorFields[0].name)
          .nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
      key: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      className: 'custom-width',
      minWidth: 200,
      textWrap: 'word-break',
      fixed: 'left',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: (price) => price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      sorter: (a, b) => a.price - b.price,
      className: 'custom-width',
      minWidth: 200,
      textWrap: 'word-break',
    },
    {
      title: 'Description',
      ...getColumnSearchProps('description'),
      width: 400,
      dataIndex: 'description',
      key: 'description',
      className: 'custom-width-long',
      minWidth: 300,
      textWrap: 'word-break',
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
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      minWidth: 100,
      fixed: 'right',
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
          <Popconfirm
            placement="bottom"
            title={'Delete service'}
            description={'Are you sure to delete this service ?'}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              size="large"
              color="danger"
              variant="text"
              // onClick={() => handleDelete(record.id)}
              style={{ marginLeft: 5 }}
            >
              <DeleteOutlined style={{ fontSize: '20px' }} />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {currentService ? 'Edit Service' : 'Add Service'}
    </div>
  )

  const totalBudget = () => {
    let newData = bluePrint.listE
    let totalBudget = 0
    newData.forEach((r) => {
      let budget = r.payment.budget ? r.payment.budget : 0
      totalBudget += budget
    })
    return totalBudget
  }

  const totalBudgetMaintain = () => {
    let newData = maintain.listE
    let totalBudget = 0
    newData.forEach((r) => {
      let budget = r.payment.budget ? r.payment.budget : 0
      totalBudget += budget
    })
    return totalBudget
  }

  const dateFormat = 'YYYY/MM/DD'

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
        scroll={{
          x: '100%',
        }}
        tableLayout="auto"
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
        style={{ top: 120, overflowY: 'auto', overflowX: 'hidden' }}
        width={1000}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Steps current={currentStep}>
          <Step title="Service Info" />
          <Step title="Format Form" />
          <Step title="Maintain" />
        </Steps>

        <Form
          form={form}
          onFinish={handleAddOrUpdate}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 17 }}
          style={{
            marginTop: 20,
            maxWidth: 'none',
          }}
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
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
                label="Price ($)"
                rules={[
                  { required: true, message: 'Please input service price!' },
                  ({ getFieldValue }) => ({
                    validator: (_, value) =>
                      totalBudget() <= value || value == undefined
                        ? Promise.resolve()
                        : Promise.reject(new Error(`Total budget limit exceeded maximum`)),
                  }),
                ]}
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
              <Form.Item name={['maintain', 'checked']} label="Maintain">
                <Checkbox
                  checked={maintain.checked}
                  onChange={(e) => {
                    // const newData = form.getFieldsValue()
                    // newData.maintain.checked = e.target.checked
                    // form.setFieldsValue(newData)
                    if (!e.target.checked) {
                      setMaintain({
                        checked: false,
                        period: null,
                        price: null,
                        date: null,
                        remind: null,
                        listE: [],
                      })
                    } else {
                      setMaintain({
                        checked: true,
                        period: null,
                        price: null,
                        date: null,
                        remind: null,
                        listE: [
                          {
                            eid: null,
                            expire: null,
                            reassignment: false,
                            status: 'Waiting',
                            payment: {
                              method: '1 Time',
                              budget: null,
                              currentbudget: null,
                            },
                          },
                        ],
                      })
                    }
                  }}
                ></Checkbox>
              </Form.Item>
              <Form.Item label="Blueprint" name={['blueprint', 'checked']}>
                <Checkbox
                  checked={bluePrint.checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const newData = form.getFieldsValue()
                      newData.blueprint.checked = true
                      newData.blueprint.listE = []
                      form.setFieldsValue(newData)
                      setBlueprint({
                        checked: true,
                        listE: [
                          {
                            eid: null,
                            expire: null,
                            reassignment: false,
                            status: 'Waiting',
                            payment: {
                              method: '1 Time',
                              budget: null,
                              currentbudget: null,
                            },
                          },
                        ],
                      })
                    } else {
                      const newData = form.getFieldsValue()
                      newData.blueprint.checked = false
                      newData.blueprint.listE = [null]
                      form.setFieldsValue(newData)
                      setBlueprint({
                        checked: false,
                        listE: [],
                      })
                    }
                  }}
                />
              </Form.Item>

              {bluePrint.checked && (
                <>
                  {bluePrint.listE.map((field, index) => (
                    <Card
                      size="small"
                      title={`Employee ${index + 1}`}
                      style={{ marginBottom: 15, width: '80%', left: '10%' }}
                      key={index}
                      extra={
                        bluePrint.listE.length > 1 ? (
                          <CloseOutlined
                            onClick={() => {
                              const newData = { ...bluePrint }
                              newData.listE.splice(index, 1)
                              setBlueprint(newData)
                              const newForm = form.getFieldsValue()
                              newForm.blueprint = newData
                              form.setFieldsValue(newForm)
                            }}
                          />
                        ) : null
                      }
                    >
                      <Form.Item
                        style={{
                          marginBottom: 5,
                          width: '100%',
                          zIndex: 10,
                        }}
                        name={['blueprint', 'listE', index, 'eid']}
                        label={`Employee`}
                        rules={[{ required: true, message: 'Please select employee!' }]}
                      >
                        <Select
                          onChange={(e) => {
                            const newData = { ...bluePrint }
                            newData.listE[index].eid = e
                            setBlueprint(newData)
                          }}
                        >
                          {employeeData
                            .filter(
                              (r) =>
                                bluePrint.listE[index].eid == r.value ||
                                !bluePrint.listE.find((re) => re.eid == r.value),
                            )
                            .map((option, idx) => (
                              <Select.Option key={option.value} value={option.value}>
                                {option.label}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        style={{
                          marginBottom: 5,
                          width: '100%',
                          zIndex: 10,
                        }}
                        name={['blueprint', 'listE', index, 'expire']}
                        label={`Expire Date`}
                        rules={[{ required: true, message: 'Please enter expire date!' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          onChange={(e) => {
                            const newData = { ...bluePrint }
                            newData.listE[index].expire = e
                            setBlueprint(newData)
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        style={{
                          marginBottom: 5,
                          width: '100%',
                          zIndex: 10,
                        }}
                        name={['blueprint', 'listE', index, 'reassignment']}
                        label={`Reassignment`}
                        initialValue={false}
                        value={
                          bluePrint.listE[index].reassignment
                            ? bluePrint.listE[index].reassignment
                            : false
                        }
                      >
                        <Radio.Group
                          onChange={(e) => {
                            const newData = { ...bluePrint }
                            newData.listE[index].reassignment = e.target.value
                            setBlueprint(newData)
                          }}
                        >
                          <Radio value={false}>False</Radio>
                          <Radio value={true}>True</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Payment method"
                        style={{
                          marginBottom: 5,
                          width: '100%',
                          zIndex: 10,
                        }}
                        name={['blueprint', 'listE', index, 'payment', 'method']}
                        initialValue="1 Time"
                        //value={fields.payment.method}
                        // rules={[
                        //   { required: true, message: 'Please choose payment method' },
                        //   ({ getFieldValue }) => ({
                        //     validator: (_, value) =>
                        //       totalBudget() <= form.getFieldsValue().price
                        //         ? Promise.resolve()
                        //         : Promise.reject(
                        //             new Error(
                        //               `Total budget limit exceeded maximum ($${form.getFieldsValue().price})`,
                        //             ),
                        //           ),
                        //   }),
                        // ]}
                      >
                        <Select
                          onChange={(e) => {
                            const newData = { ...bluePrint }
                            newData.listE[index].payment.method = e
                            newData.listE[index].payment.budget = null
                            newData.listE[index].payment.currentbudget = null
                            if (e == 'Period') {
                              newData.listE[index].payment.period = [
                                {
                                  date: null,
                                  budget: null,
                                },
                              ]
                            }
                            setBlueprint(newData)
                          }}
                        >
                          <Select.Option key="1 Time" value="1 Time">
                            1 Time
                          </Select.Option>
                          <Select.Option key="Period" value="Period">
                            Period
                          </Select.Option>
                        </Select>
                      </Form.Item>
                      {bluePrint.listE[index].payment.method === '1 Time' && (
                        <>
                          <Form.Item
                            name={['blueprint', 'listE', index, 'payment', 'budget']}
                            label="Budget ($)"
                            // value={fields.payment.budget}
                            // max={100}
                            rules={[
                              { required: true, message: 'Please input budget' },
                              // ({ getFieldValue }) => ({
                              //   validator: (_, value) =>
                              //     value <= maxBudget
                              //       ? Promise.resolve()
                              //       : Promise.reject(
                              //           new Error(`Budget limit exceeded maximum ($${maxBudget})`),
                              //         ),
                              // }),
                            ]}
                          >
                            <InputNumber
                              onChange={(e) => {
                                const newData = { ...bluePrint }
                                newData.listE[index].payment.budget = e
                                newData.listE[index].payment.currentbudget = e
                                setBlueprint(newData)
                              }}
                              step={0.01}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </>
                      )}
                      {bluePrint.listE[index].payment.method === 'Period' && (
                        <>
                          {bluePrint.listE[index].payment.period.map((field1, idx1) => (
                            <>
                              <Card
                                size="small"
                                key={idx1}
                                title={`Period ${idx1 + 1}`}
                                style={{ marginBottom: 15, width: '80%', left: '10%' }}
                                extra={
                                  bluePrint.listE[index].payment.period.length > 1 ? (
                                    <CloseOutlined
                                      onClick={() => {
                                        const newData = { ...bluePrint }
                                        newData.listE[index].payment.budget -=
                                          newData.listE[index].payment.period[idx1].budget
                                        newData.listE[index].payment.period.splice(idx1, 1)
                                        setBlueprint(newData)
                                        const newForm = form.getFieldsValue()
                                        newForm.blueprint = newData
                                        form.setFieldsValue(newForm)
                                      }}
                                    />
                                  ) : null
                                }
                              >
                                <Form.Item
                                  name={[
                                    'blueprint',
                                    'listE',
                                    index,
                                    'payment',
                                    'period',
                                    idx1,
                                    'date',
                                  ]}
                                  label={`Pay after`}
                                  style={{ marginBottom: '5px' }}
                                  rules={[
                                    { required: true, message: 'Please input payment date' },
                                    // ({ getFieldValue }) => ({
                                    //   validator: (_, value) =>
                                    //     value
                                    //       ? Promise.resolve()
                                    //       : Promise.reject(new Error(`Please choose date`)),
                                    // }),
                                  ]}
                                  // initialValue={
                                  //   bluePrint.listE[index].payment.period[idx1].date
                                  //     ? dayjs(
                                  //         bluePrint.listE[index].payment.period[idx1].date,
                                  //         dateFormat,
                                  //       )
                                  //     : null
                                  // }
                                >
                                  <InputNumber
                                    // format={dateFormat}
                                    placeholder="Day"
                                    style={{ width: '100%' }}
                                    // value={
                                    //   bluePrint.listE[index].payment.period[idx1].date
                                    //     ? dayjs(
                                    //         bluePrint.listE[index].payment.period[idx1].date,
                                    //         dateFormat,
                                    //       )
                                    //     : null
                                    // }
                                    onChange={(e) => {
                                      const newData = { ...bluePrint }
                                      newData.listE[index].payment.period[idx1].date = e
                                      // ? e.format(dateFormat)
                                      // : null
                                      setBlueprint(newData)
                                      const newForm = form.getFieldsValue()
                                      newForm.blueprint = newData
                                      form.setFieldsValue(newForm)
                                    }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  // wrapperCol={{ span: 30 }}
                                  name={[
                                    'blueprint',
                                    'listE',
                                    index,
                                    'payment',
                                    'period',
                                    idx1,
                                    'budget',
                                  ]}
                                  // value={fields.payment.period[index].budget}
                                  style={{ marginBottom: '5px' }}
                                  label={'Budget ($)'}
                                  rules={[
                                    { required: true, message: 'Please input budget' },
                                    // ({ getFieldValue }) => ({
                                    //   validator: (_, value) =>
                                    //     value <= maxBudget
                                    //       ? Promise.resolve()
                                    //       : Promise.reject(
                                    //           new Error(`budget limit exceeded maximum ($${maxBudget})`),
                                    //         ),
                                    // }),
                                  ]}
                                >
                                  <InputNumber
                                    onChange={(e) => {
                                      const newData = { ...bluePrint }
                                      newData.listE[index].payment.budget +=
                                        e - newData.listE[index].payment.period[idx1].budget
                                      newData.listE[index].payment.currentbudget =
                                        newData.listE[index].payment.budget
                                      newData.listE[index].payment.period[idx1].budget = e
                                      setBlueprint(newData)
                                    }}
                                    placeholder="Budget"
                                    step={0.01}
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Card>
                            </>
                          ))}
                          <Button
                            color="primary"
                            variant="dashed"
                            style={{ width: '80%', left: '10%', marginBottom: '15px' }}
                            onClick={(e) => {
                              const newData = { ...bluePrint }
                              newData.listE[index].payment.period.push({
                                budget: null,
                                date: null,
                              })
                              setBlueprint(newData)
                            }}
                          >
                            + Add Period
                          </Button>
                        </>
                      )}
                    </Card>
                  ))}
                  <Button
                    color="primary"
                    variant="dashed"
                    onClick={(e) => {
                      const newData = { ...bluePrint }
                      newData.listE.push({
                        eid: null,
                        expire: null,
                        reassignment: false,
                        status: 'Waiting',
                        payment: {
                          method: '1 Time',
                          budget: null,
                          currentbudget: null,
                        },
                      })
                      setBlueprint(newData)
                      const newForm = form.getFieldsValue()
                      newForm.blueprint = newData
                      form.setFieldsValue(newForm)
                    }}
                    style={{ width: '80%', left: '10%' }}
                  >
                    + Add Employee
                  </Button>
                </>
              )}
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
                  style={{ marginBottom: 15 }}
                  extra={
                    formDataArray.length > 1 ? (
                      <CloseOutlined
                        onClick={() => {
                          handleRemoveField(index)
                        }}
                      />
                    ) : null
                  }
                >
                  <Form.Item
                    label="Type"
                    name={['formData', index, 'type']}
                    style={{ marginBottom: 5 }}
                    // labelCol={{ span: 6 }}
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
                  <Form.Item
                    label="Name"
                    name={['formData', index, 'fieldname']}
                    style={{ marginBottom: 5 }}
                    initialValue={`field_${index + 1}`}
                    rules={[
                      { required: true, message: 'Please input field name' },
                      {
                        validator: async (_, fieldname) => {
                          if (formDataArray.filter((r) => r.fieldname == fieldname).length >= 2) {
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
                  <Form.Item
                    label="Required"
                    style={{ marginBottom: 5 }}
                    name={['formData', index, 'required']}
                  >
                    <Checkbox
                      checked={field.required}
                      onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                    ></Checkbox>
                  </Form.Item>

                  {/* <Col span={2}>
                      <Button type="primary" onClick={() => handleRemoveField(index)} danger>
                        Delete
                      </Button>
                    </Col> */}

                  <Form.Item
                    label="Label"
                    name={['formData', index, 'label']}
                    style={{ marginBottom: 5 }}
                    initialValue={''}
                    rules={[{ required: true, message: 'Please input field label' }]}
                  >
                    <TextArea onChange={(e) => handleFieldChange(index, 'label', e.target.value)} />
                  </Form.Item>
                  {(field.type === 'select' ||
                    field.type === 'radio' ||
                    field.type === 'checkbox') && (
                    <>
                      {field.option.map((Option, indexOption) => (
                        <>
                          <Row>
                            <Form.Item
                              label={`Option ${indexOption + 1}`}
                              style={{
                                marginBottom: 5,
                                width: '100%',
                                zIndex: 10,
                              }}
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
                            {field.option.length > 1 && (
                              <>
                                <div
                                  style={{
                                    position: 'absolute',
                                    width: 'calc(100% - 30px)',
                                    textAlign: 'end',
                                  }}
                                >
                                  <Button
                                    color="danger"
                                    variant="dashed"
                                    style={{ zIndex: 20 }}
                                    onClick={(e) =>
                                      handleDeleteOption(index, 'option', indexOption)
                                    }
                                  >
                                    X
                                  </Button>
                                </div>
                              </>
                            )}
                          </Row>
                        </>
                      ))}
                      <Form.Item
                        label={' '}
                        colon={false}
                        layout="horizontal"
                        style={{
                          marginBottom: 5,
                        }}
                      >
                        <Button
                          color="primary"
                          variant="dashed"
                          onClick={(e) => handleAddOption(index, 'option')}
                          style={{ width: '100%' }}
                        >
                          + Add Option
                        </Button>
                      </Form.Item>
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

          {currentStep === 2 && (
            <>
              <Form.Item
                label="Payment period"
                // style={{
                //   marginBottom: 5,
                //   // width: '100%',
                //   zIndex: 10,
                // }}
                name={['maintain', 'period']}
                rules={[{ required: true, message: 'Please select period' }]}
              >
                <Select
                  onChange={(e) => {
                    const newData = { ...maintain }
                    newData.period = e
                    setMaintain(newData)
                  }}
                >
                  <Select.Option key={1} value={1}>
                    1 Month
                  </Select.Option>
                  <Select.Option key={3} value={3}>
                    3 Months
                  </Select.Option>
                  <Select.Option key={6} value={6}>
                    6 Months
                  </Select.Option>
                  <Select.Option key={12} value={12}>
                    12 Months
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                placeholder="$"
                name={['maintain', 'price']}
                label="Price ($)"
                rules={[
                  { required: true, message: 'Please input service maintain price!' },
                  ({ getFieldValue }) => ({
                    validator: (_, value) =>
                      totalBudgetMaintain() <= value || value == undefined
                        ? Promise.resolve()
                        : Promise.reject(new Error(`Total budget limit exceeded maximum`)),
                  }),
                ]}
              >
                <InputNumber
                  onChange={(e) => {
                    const newData = { ...maintain }
                    newData.price = e
                    setMaintain(newData)
                  }}
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="Maturity date"
                // style={{
                //   marginBottom: 5,
                //   // width: '100%',
                //   zIndex: 10,
                // }}
                name={['maintain', 'date']}
              >
                <InputNumber
                  onChange={(e) => {
                    const newData = { ...maintain }
                    newData.date = e
                    setMaintain(newData)
                  }}
                  placeholder="Date"
                  style={{ width: '100%' }}
                ></InputNumber>
              </Form.Item>
              <Form.Item
                label="Remind before"
                // style={{
                //   marginBottom: 5,
                //   // width: '100%',
                //   zIndex: 10,
                // }}
                name={['maintain', 'remind']}
                rules={[{ required: true, message: 'Please input reminder date' }]}
              >
                <InputNumber
                  onChange={(e) => {
                    const newData = { ...maintain }
                    newData.remind = e
                    setMaintain(newData)
                  }}
                  placeholder="Day"
                  style={{ width: '100%' }}
                ></InputNumber>
              </Form.Item>
              {maintain.listE.map((field, index) => (
                <Card
                  size="small"
                  title={`Employee ${index + 1}`}
                  style={{ marginBottom: 15, width: '80%', left: '10%' }}
                  key={index}
                  extra={
                    maintain.listE.length > 1 ? (
                      <CloseOutlined
                        onClick={() => {
                          const newData = { ...maintain }
                          newData.listE.splice(index, 1)
                          setMaintain(newData)
                          const newForm = form.getFieldsValue()
                          newForm.maintain = newData
                          form.setFieldsValue(newForm)
                        }}
                      />
                    ) : null
                  }
                >
                  <Form.Item
                    style={{
                      marginBottom: 5,
                      width: '100%',
                      zIndex: 10,
                    }}
                    name={['maintain', 'listE', index, 'eid']}
                    label={`Employee`}
                    rules={[{ required: true, message: 'Please select employee!' }]}
                  >
                    <Select
                      onChange={(e) => {
                        const newData = { ...maintain }
                        newData.listE[index].eid = e
                        setMaintain(newData)
                      }}
                    >
                      {employeeData
                        .filter(
                          (r) =>
                            maintain.listE[index].eid == r.value ||
                            !maintain.listE.find((re) => re.eid == r.value),
                        )
                        .map((option, idx) => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    style={{
                      marginBottom: 5,
                      width: '100%',
                      zIndex: 10,
                    }}
                    name={['maintain', 'listE', index, 'expire']}
                    label={`Expire Date`}
                    rules={[{ required: true, message: 'Please enter expire date!' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      onChange={(e) => {
                        const newData = { ...maintain }
                        newData.listE[index].expire = e
                        setMaintain(newData)
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{
                      marginBottom: 5,
                      width: '100%',
                      zIndex: 10,
                    }}
                    name={['maintain', 'listE', index, 'reassignment']}
                    label={`Reassignment`}
                    initialValue={false}
                    value={
                      maintain.listE[index].reassignment
                        ? maintain.listE[index].reassignment
                        : false
                    }
                  >
                    <Radio.Group
                      onChange={(e) => {
                        const newData = { ...maintain }
                        newData.listE[index].reassignment = e.target.value
                        setMaintain(newData)
                      }}
                    >
                      <Radio value={false}>False</Radio>
                      <Radio value={true}>True</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label="Payment method"
                    style={{
                      marginBottom: 5,
                      width: '100%',
                      zIndex: 10,
                    }}
                    name={['maintain', 'listE', index, 'payment', 'method']}
                    initialValue="1 Time"
                    //value={fields.payment.method}
                    // rules={[
                    //   { required: true, message: 'Please choose payment method' },
                    //   ({ getFieldValue }) => ({
                    //     validator: (_, value) =>
                    //       totalBudget() <= form.getFieldsValue().price
                    //         ? Promise.resolve()
                    //         : Promise.reject(
                    //             new Error(
                    //               `Total budget limit exceeded maximum ($${form.getFieldsValue().price})`,
                    //             ),
                    //           ),
                    //   }),
                    // ]}
                  >
                    <Select
                      onChange={(e) => {
                        const newData = { ...maintain }
                        newData.listE[index].payment.method = e
                        newData.listE[index].payment.budget = null
                        newData.listE[index].payment.currentbudget = null
                        if (e == 'Period') {
                          newData.listE[index].payment.period = [
                            {
                              date: null,
                              budget: null,
                            },
                          ]
                        }
                        setMaintain(newData)
                      }}
                    >
                      <Select.Option key="1 Time" value="1 Time">
                        1 Time
                      </Select.Option>
                      <Select.Option key="Period" value="Period">
                        Period
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  {maintain.listE[index].payment.method === '1 Time' && (
                    <>
                      <Form.Item
                        name={['maintain', 'listE', index, 'payment', 'budget']}
                        label="Budget ($)"
                        // value={fields.payment.budget}
                        // max={100}
                        rules={[
                          { required: true, message: 'Please input budget' },
                          // ({ getFieldValue }) => ({
                          //   validator: (_, value) =>
                          //     value <= maxBudget
                          //       ? Promise.resolve()
                          //       : Promise.reject(
                          //           new Error(`Budget limit exceeded maximum ($${maxBudget})`),
                          //         ),
                          // }),
                        ]}
                      >
                        <InputNumber
                          onChange={(e) => {
                            const newData = { ...maintain }
                            newData.listE[index].payment.budget = e
                            newData.listE[index].payment.currentbudget = e
                            setMaintain(newData)
                          }}
                          step={0.01}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </>
                  )}
                  {maintain.listE[index].payment.method === 'Period' && (
                    <>
                      {maintain.listE[index].payment.period.map((field1, idx1) => (
                        <>
                          <Card
                            size="small"
                            key={idx1}
                            title={`Period ${idx1 + 1}`}
                            style={{ marginBottom: 15, width: '80%', left: '10%' }}
                            extra={
                              maintain.listE[index].payment.period.length > 1 ? (
                                <CloseOutlined
                                  onClick={() => {
                                    const newData = { ...maintain }
                                    newData.listE[index].payment.budget -=
                                      newData.listE[index].payment.period[idx1].budget
                                    newData.listE[index].payment.period.splice(idx1, 1)
                                    setMaintain(newData)
                                    const newForm = form.getFieldsValue()
                                    newForm.maintain = newData
                                    form.setFieldsValue(newForm)
                                  }}
                                />
                              ) : null
                            }
                          >
                            <Form.Item
                              name={['maintain', 'listE', index, 'payment', 'period', idx1, 'date']}
                              label={`Pay after`}
                              style={{ marginBottom: '5px' }}
                              rules={[
                                { required: true, message: 'Please input payment date' },
                                // ({ getFieldValue }) => ({
                                //   validator: (_, value) =>
                                //     value
                                //       ? Promise.resolve()
                                //       : Promise.reject(new Error(`Please choose date`)),
                                // }),
                              ]}
                              // initialValue={
                              //   bluePrint.listE[index].payment.period[idx1].date
                              //     ? dayjs(
                              //         bluePrint.listE[index].payment.period[idx1].date,
                              //         dateFormat,
                              //       )
                              //     : null
                              // }
                            >
                              <InputNumber
                                // format={dateFormat}
                                placeholder="Day"
                                style={{ width: '100%' }}
                                // value={
                                //   bluePrint.listE[index].payment.period[idx1].date
                                //     ? dayjs(
                                //         bluePrint.listE[index].payment.period[idx1].date,
                                //         dateFormat,
                                //       )
                                //     : null
                                // }
                                onChange={(e) => {
                                  const newData = { ...maintain }
                                  newData.listE[index].payment.period[idx1].date = e
                                  // ? e.format(dateFormat)
                                  // : null
                                  setMaintain(newData)
                                  const newForm = form.getFieldsValue()
                                  newForm.maintain = newData
                                  form.setFieldsValue(newForm)
                                }}
                              />
                            </Form.Item>
                            <Form.Item
                              // wrapperCol={{ span: 30 }}
                              name={[
                                'maintain',
                                'listE',
                                index,
                                'payment',
                                'period',
                                idx1,
                                'budget',
                              ]}
                              // value={fields.payment.period[index].budget}
                              style={{ marginBottom: '5px' }}
                              label={'Budget ($)'}
                              rules={[
                                { required: true, message: 'Please input budget' },
                                // ({ getFieldValue }) => ({
                                //   validator: (_, value) =>
                                //     value <= maxBudget
                                //       ? Promise.resolve()
                                //       : Promise.reject(
                                //           new Error(`budget limit exceeded maximum ($${maxBudget})`),
                                //         ),
                                // }),
                              ]}
                            >
                              <InputNumber
                                onChange={(e) => {
                                  const newData = { ...maintain }
                                  newData.listE[index].payment.budget +=
                                    e - newData.listE[index].payment.period[idx1].budget
                                  newData.listE[index].payment.currentbudget =
                                    newData.listE[index].payment.budget
                                  newData.listE[index].payment.period[idx1].budget = e
                                  setMaintain(newData)
                                }}
                                placeholder="Budget"
                                step={0.01}
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Card>
                        </>
                      ))}
                      <Button
                        color="primary"
                        variant="dashed"
                        style={{ width: '80%', left: '10%', marginBottom: '15px' }}
                        onClick={(e) => {
                          const newData = { ...maintain }
                          newData.listE[index].payment.period.push({
                            budget: null,
                            date: null,
                          })
                          setMaintain(newData)
                        }}
                      >
                        + Add Period
                      </Button>
                    </>
                  )}
                </Card>
              ))}
              <Button
                color="primary"
                variant="dashed"
                onClick={(e) => {
                  const newData = { ...maintain }
                  newData.listE.push({
                    eid: null,
                    expire: null,
                    reassignment: false,
                    status: 'Waiting',
                    payment: {
                      method: '1 Time',
                      budget: null,
                      currentbudget: null,
                    },
                  })
                  setMaintain(newData)
                  const newForm = form.getFieldsValue()
                  newForm.maintain = newData
                  form.setFieldsValue(newForm)
                }}
                style={{ width: '80%', left: '10%' }}
              >
                + Add Employee
              </Button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: 30 }} onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
            {(currentStep === 0 || (currentStep === 1 && maintain.checked)) && (
              <Button style={{ marginRight: 30 }} type="primary" onClick={handleNextStep}>
                Next
              </Button>
            )}
            {((currentStep === 1 && !maintain.checked) || currentStep === 2) && (
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
