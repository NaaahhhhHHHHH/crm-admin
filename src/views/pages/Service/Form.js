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
  Radio,
  Space,
  Upload,
  Card,
  Popconfirm,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  SearchOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderViewOutlined,
  UploadOutlined,
  FileAddOutlined,
} from '@ant-design/icons'
import { updateData, createData, deleteData, getData } from '../../../api'
import axios from 'axios'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`
import Highlighter from 'react-highlight-words'
import dayjs from 'dayjs'
const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'YYYY/MM/DD hh:mm:ss'
// import DynamicFormModal from './ModalForm'

const { Step } = Steps
const { TextArea } = Input

const ServiceTable = () => {
  const [data, setData] = useState([])
  const [customerData, setCustomerData] = useState([])
  const [serviceData, setServiceData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [fileList, setFileList] = useState([])
  // const [serviceName, setServiceName] = useState('')
  // const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  // const [currentService, setCurrentService] = useState(null)
  const [currentForm, setCurrentForm] = useState(null)
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [step1Values, setStep1Values] = useState({})
  const [formDataArray, setFormDataArray] = useState([]) // Default one field
  const navigate = useNavigate()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  // const handleOpenViewModal = () => {
  //   setIsViewModalVisible(true)
  // }

  // const handleCloseViewModal = () => {
  //   setIsViewModalVisible(false)
  // }

  // const handleSubmitViewModal = (values) => {
  //   console.log('Submitted Values:', values)
  //   handleCloseViewModal()
  // }

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
    loadForms()
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

  const loadForms = async () => {
    try {
      const [response1, response2, response3] = await Promise.all([
        getData('service'),
        getData('form'),
        getData('customer'),
      ])
      let formList = response2.data
      let serviceList = response1.data
      let customerList = response3.data
      formList.forEach((f) => {
        f.cname = customerList.find((c) => f.cid == c.id).name
        f.sname = serviceList.find((s) => f.sid == s.id).name
      })
      setData(formList)
      let serviceOption = serviceList.map((r) => ({ label: r.name, value: r.id, data: r.formData }))
      let customerOption = customerList.map((r) => ({ label: r.name, value: r.id }))
      setServiceData(serviceOption)
      setCustomerData(customerOption)
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

  const showModal = (CForm) => {
    setCurrentForm(CForm)
    form.setFieldsValue(CForm)
    if (CForm) {
      setFormDataArray(CForm.data)
    }
    // if (service) {
    //   setFormDataArray(
    //     service.formData || [
    //       {
    //         type: 'input',
    //         label: '',
    //         required: false,
    //         fieldname: `field_1`,
    //       },
    //     ],
    //   ) // Load existing formData
    // }
    setIsModalVisible(true)
    setCurrentStep(0)
  }

  // const showViewModal = (Cform) => {
  //   setCurrentForm(Cform)
  //   // setServiceName(service.name)
  //   if (Cform) {
  //     setFormDataArray(form.data) // Load existing formData
  //   }
  //   // setIsViewModalVisible(true)
  // }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('form', id)
      loadForms()
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
      let formValue = form.getFieldsValue()
      formValue.data.forEach((r, index) => {
        formValue.data[index] = { ...formDataArray[index], ...r }
      })
      let formData = { ...step1Values, data: formValue.data } // Add formDataArray to form values
      let res = currentForm
        ? await updateData('form', currentForm.id, formData)
        : await createData('form', formData)
      loadForms()
      handleCloseModal()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setCurrentForm(null)
    setFormDataArray([])
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

  const handleChangeService = (value) => {
    if (!currentForm || value != currentForm.sid) {
      let findForm = serviceData.find((r) => r.value == value)
      let formD = findForm.data ? findForm.data : []
      setFormDataArray(formD)
      // let fData = { ...currentForm }
      // fData.data = formD
      form.setFieldValue('data', formD)
      console.log(formD)
    } else {
      setFormDataArray(currentForm.data)
      form.setFieldValue('data', currentForm.data)
    }
  }

  const handleFileChange = async (index, { file, fileList: newFileList }) => {
    try {
      let fileI = newFileList.find((f) => f.uid == file.uid)
      if (fileI) {
        const formFile = new FormData()
        formFile.append('file', file)
        const response = await axios.post(BASE_URL + '/upload', formFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('CRM-token'),
          },
        })
        if (response.status === 200) {
          message.success(`${file.name} uploaded successfully.`)
          fileI.storagename = response.data.file.filename
          fileI.status = 'done'
          fileI.url = BASE_URL + '/download/' + fileI.storagename
          setFileList((prev) => ({
            ...prev,
            [index]: newFileList, // Store file list under the form item index
          }))
        }
      }
    } catch (error) {
      message.error(`${file.name} upload failed.`)
    }
  }

  const handleDownloadFile = async (file) => {
    try {
      await axios
        .get(file.url, {
          responseType: 'blob',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('CRM-token'),
          },
        })
        .then((response) => {
          const extname = file.name.toLowerCase().split('.')[
            file.name.toLowerCase().split('.').length - 1
          ]
          let contentType = 'application/octet-stream' // Default content type
          if (extname === 'png') {
            contentType = 'image/png'
          } else if (extname === 'jpg' || extname === 'jpeg') {
            contentType = 'image/jpeg'
          }
          // const blob = new Blob([response.data], {type: contentType})
          const url = URL.createObjectURL(response.data)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', file.name) // Specify the file name to download
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
    } catch (error) {
      message.error(`${file.name} download failed.`)
    }
  }

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'cname',
      key: 'cname',
      ...getColumnSearchProps('cname'),
      width: 200,
      sorter: (a, b) => a.cname.localeCompare(b.cname),
      className: 'custom-width',
      textWrap: 'word-break',
    },
    {
      title: 'Service Name',
      dataIndex: 'sname',
      key: 'sname',
      ...getColumnSearchProps('sname'),
      width: 200,
      //render: (price) => price.toLocaleString("en-US", {style:"currency", currency:"USD"}),
      sorter: (a, b) => a.sname.localeCompare(b.sname),
      className: 'custom-width',
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
    // {
    //   title: 'Description',
    //   ...getColumnSearchProps('description'),
    //   width: 400,
    //   dataIndex: 'description',
    //   key: 'description',
    //   ellipsis: true,
    // },
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

          {/* <Button
            color="primary"
            size="large"
            variant="text"
            onClick={() => showViewModal(record)}
            style={{ marginLeft: 5 }}
          >
            <FolderViewOutlined style={{ fontSize: '20px' }} />
          </Button> */}
          <Popconfirm
            placement="bottom"
            title={'Delete form'}
            description={'Are you sure to delete this form ?'}
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
      {currentForm ? 'Edit Form' : 'Add Form'}
    </div>
  )

  // const modalTitle2 = (
  //   <div style={{ textAlign: 'center', width: '100%' }}>
  //     {`${title} Form`}
  //   </div>
  // )

  const formItemLabelStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxWidth: '95%',
  }

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
        locale={{ emptyText: 'No forms found' }}
        scroll={{
          x: '100%',
        }}
        tableLayout="auto"
      />
      {/* <DynamicFormModal
        title={serviceName}
        visible={isViewModalVisible}
        onClose={handleCloseViewModal}
        formDataArray={formDataArray}
        onSubmit={handleSubmitViewModal}
      /> */}
      <Modal
        title={modalTitle}
        open={isModalVisible}
        style={{ top: 120, overflowY: 'auto', overflowX: 'hidden' }}
        width={700}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Steps current={currentStep}>
          <Step title="Set Up Form" />
          <Step title="Form Data" />
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdate}
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
                name="cid"
                label="Customer"
                rules={[{ required: true, message: 'Please choose customer' }]}
              >
                <Select
                  showSearch
                  placeholder="Select Customer"
                  optionFilterProp="label"
                  // onChange={}
                  options={customerData}
                />
              </Form.Item>
              <Form.Item
                //placeholder="$"
                name="sid"
                label="Service"
                rules={[{ required: true, message: 'Please choose service' }]}
              >
                <Select
                  showSearch
                  placeholder="Select Service"
                  optionFilterProp="label"
                  onChange={(value) => handleChangeService(value)}
                  options={serviceData}
                />
              </Form.Item>
              {/* <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please input service description!' }]}
              >
                <TextArea rows={4} />
              </Form.Item> */}
            </>
          )}

          {currentStep === 1 && (
            <>
              {formDataArray
                .map((item, index) => ({
                  name: item.fieldname,
                  label: item.label,
                  // initialValue: item.initvalue,
                  rules: item.required
                    ? [{ required: true, message: `${item.fieldname} is required` }]
                    : [],
                  type: item.type,
                  options: item.option || [],
                }))
                .map((field, index) => {
                  switch (field.type) {
                    case 'input':
                      return (
                        <Form.Item
                          key={index}
                          label={<span style={formItemLabelStyle}>{field.label}</span>}
                          name={['data', index, 'value']}
                          rules={field.rules}
                          //   initialValue={field.initialValue}
                        >
                          <Input placeholder={`Enter ${field.name}`} />
                        </Form.Item>
                      )
                    case 'textarea':
                      return (
                        <Form.Item
                          key={index}
                          label={<span style={formItemLabelStyle}>{field.label}</span>}
                          name={['data', index, 'value']}
                          rules={field.rules}
                          //   initialValue={field.initialValue}
                        >
                          <Input.TextArea placeholder={`Enter ${field.name}`} />
                        </Form.Item>
                      )
                    case 'select':
                      return (
                        <Form.Item
                          key={index}
                          label={<span style={formItemLabelStyle}>{field.label}</span>}
                          name={['data', index, 'value']}
                          rules={field.rules}
                          initialValue={field.initialValue}
                        >
                          <Select placeholder={`Select ${field.name}`}>
                            {field.options.map((option, idx) => (
                              <Select.Option key={idx} value={idx}>
                                {option}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )
                    case 'radio':
                      return (
                        <Form.Item
                          key={index}
                          label={<span style={formItemLabelStyle}>{field.label}</span>}
                          name={['data', index, 'value']}
                          rules={field.rules}
                          //   initialValue={field.initialValue}
                        >
                          <Radio.Group style={{ display: 'inline-grid' }}>
                            {field.options.map((option, idx) => (
                              <Radio key={idx} value={idx} style={formItemLabelStyle}>
                                {option}
                              </Radio>
                            ))}
                          </Radio.Group>
                        </Form.Item>
                      )
                    case 'checkbox':
                      return (
                        <Form.Item
                          key={index}
                          label={<span style={formItemLabelStyle}>{field.label}</span>}
                          name={['data', index, 'value']}
                          rules={field.rules}
                          //   initialValue={field.initialValue}
                        >
                          <Checkbox.Group dir style={{ display: 'inline-grid' }}>
                            {field.options.map((option, idx) => (
                              <Checkbox key={idx} value={idx} style={formItemLabelStyle}>
                                {option}
                              </Checkbox>
                            ))}
                          </Checkbox.Group>
                        </Form.Item>
                      )
                    case 'file':
                      return (
                        <Form.Item
                          key={index}
                          label={<span style={formItemLabelStyle}>{field.label}</span>}
                          name={['data', index, 'value']}
                          rules={field.rules}
                        >
                          <Upload
                            defaultFileList={
                              form.getFieldValue().data[index].value
                                ? form.getFieldValue().data[index].value.fileList
                                : []
                            }
                            click
                            name={field.name}
                            beforeUpload={() => false}
                            onChange={(info) => handleFileChange(index, info)}
                            onPreview={(file) => handleDownloadFile(file)}
                            // disabled
                          >
                            <Button icon={<UploadOutlined />}>Upload File</Button>
                          </Upload>
                        </Form.Item>
                      )
                    default:
                      return null
                  }
                })}
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
                {currentForm ? 'Update' : 'Add'}
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ServiceTable
