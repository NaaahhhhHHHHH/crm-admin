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
  Card,
  Tooltip,
  Tag,
  Upload,
  Popconfirm,
} from 'antd'
import '../index.css'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'YYYY/MM/DD hh:mm:ss'
import {
  SearchOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderViewOutlined,
  FileAddOutlined,
  UploadOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { updateData, createData, deleteData, getData } from '../../../api'
import Highlighter from 'react-highlight-words'
import DynamicFormModal from './ModalForm'
import AssignFormModal from './ModalAssign'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { left, right } from '@popperjs/core'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`

const { Step } = Steps
const { TextArea } = Input

const ServiceTable = () => {
  const [data, setData] = useState([])
  const [tableData, setTableData] = useState([])
  // const [customerData, setCustomerData] = useState([])
  const [employeeData, setEmployeeData] = useState([])
  const [serviceData, setServiceData] = useState([])
  const [jobData, setJobData] = useState([])
  const [formData, setformData] = useState([])
  const [maxBudget, setMaxBudget] = useState(0)
  const [formDataAssign, setformDataAssign] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(null)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false)
  // const [currentService, setCurrentService] = useState(null)
  const [currentForm, setCurrentForm] = useState(null)
  const [currentJob, setCurrentJob] = useState(null)
  const [form] = Form.useForm()
  const [formAssign] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  // const [step1Values, setStep1Values] = useState({})
  const [formDataArray, setFormDataArray] = useState([]) // Default one field
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const role = user ? user.role : ''
  const userId = user ? user.id : 0

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const statusList = [
    {
      value: 'Pending',
      label: 'Pending',
      color: 'yellow',
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      color: 'geekblue',
    },
    {
      value: 'Complete',
      label: 'Complete',
      color: 'green',
    },
    {
      value: 'Closed',
      label: 'Closed',
      color: 'gray',
    },
  ]

  // const handleOpenViewModal = () => {
  //   setIsViewModalVisible(true)
  // }

  const showViewModal = (CTicket) => {
    // setCurrentForm(Cform)
    // setServiceName(service.name)
    // if (Cform) {
    //   setFormDataArray(form.data) // Load existing formData
    // }
    let CJob = jobData.find((r) => r.id == CTicket.jid)
    setformData(CTicket.data)
    // setServiceName(findService.label)
    setIsViewModalVisible(true)
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
    loadTicket()
  }, [user])

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

  const loadTicket = async () => {
    try {
      const [response0, response1, response2, response3, response4] = await Promise.all([
        getData('job'),
        getData('service'),
        getData('form'),
        getData('customer'),
        getData('ticket'),
      ])

      let jobList = response0.data
      let formList = response2.data
      let serviceList = response1.data
      let customerList = response3.data
      let ticketList = response4.data

      ticketList.forEach((a) => {
        a.key = a.id
        a.cname = customerList.find((e) => a.cid == e.id).name
        a.sname = serviceList.find((s) => a.sid == s.id).name
      })

      setTableData(ticketList)
      setData(ticketList)
      setFormDataArray(formList)
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

  const showModal = (CTicket) => {
    setCurrentTicket(CTicket)
    form.setFieldsValue(CTicket)
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('ticket', id)
      loadTicket()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdate = async (values) => {
    try {
      // let valid = await form.validateFields()
      // let formValue = form.getFieldsValue()
      // formValue.data.forEach((r, index) => {
      //   formValue.data[index] = { ...formDataArray[index], ...r }
      // })
      // let formData = { ...step1Values, data: formValue.data } // Add formDataArray to form values
      let formValue = form.getFieldsValue()
      let formSubmit = currentTicket
      formSubmit.data.push({
        user: user.name,
        comment: formValue.comment,
        attachment: formValue.attachment ? formValue.attachment : null,
      })
      formSubmit.status = formValue.status
      // let formData = { ...currentJob }
      // formData.status = formValue.status ? formValue.status : formData.status
      // formData.budget = formValue.budget ? formValue.budget : formData.budget
      let res = await updateData('ticket', currentTicket.id, formSubmit)
      loadTicket()
      handleCloseModal()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setCurrentTicket(null)
    form.resetFields()
  }

  const handleFileChange = async ({ file, fileList: newFileList }) => {
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
          // setFileList((prev) => ({
          //   ...prev,
          //   [index]: newFileList, // Store file list under the form item index
          // }))
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

  // const handleNextStep = () => {
  //   form
  //     .validateFields()
  //     .then(() => {
  //       setCurrentStep(currentStep + 1)
  //       const values = form.getFieldsValue()
  //       setStep1Values(values)
  //       console.log('Step 1 Values:', values)
  //     })
  //     .catch((info) => {
  //       console.log('Validation Failed:', info)
  //     })
  // }

  // const handlePreviousStep = () => {
  //   setCurrentStep(currentStep - 1)
  // }

  // const handleChangeService = (value) => {
  //   if (!currentForm || value != currentForm.sid) {
  //     let findForm = serviceData.find((r) => r.value == value)
  //     let formD = findForm.data ? findForm.data : []
  //     setFormDataArray(formD)
  //     // let fData = { ...currentForm }
  //     // fData.data = formD
  //     form.setFieldValue('data', formD)
  //     console.log(formD)
  //   } else {
  //     setFormDataArray(currentForm.data)
  //     form.setFieldValue('data', currentForm.data)
  //   }
  // }

  const columns = [
    {
      title: 'Job ID',
      dataIndex: 'jid',
      key: 'jid',
      align: 'center',
      width: 140,
      ...getColumnSearchProps('jid'),
      //render: (price) => price.toLocaleString("en-US", {style:"currency", currency:"USD"}),
      sorter: (a, b) => a.jid - b.jid,
      // fixed: left,
      //ellipsis: true,
    },
    {
      title: 'Service Name',
      dataIndex: 'sname',
      key: 'sname',
      width: 250,
      ...getColumnSearchProps('sname'),
      //render: (price) => price.toLocaleString("en-US", {style:"currency", currency:"USD"}),
      sorter: (a, b) => a.sname.localeCompare(b.sname),
      className: 'custom-width',
      textWrap: 'word-break',
    },
    {
      title: 'Customer Name',
      dataIndex: 'cname',
      key: 'cname',
      ...getColumnSearchProps('cname'),
      width: 250,
      sorter: (a, b) => a.cname.localeCompare(b.cname),
      className: 'custom-width',
      textWrap: 'word-break',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <>
          <Tag
            color={
              statusList.find((r) => r.value == status)
                ? statusList.find((r) => r.value == status).color
                : ''
            }
            key={status}
          >
            {status}
          </Tag>
        </>
      ),
      filters: statusList.map((r) => ({
        text: <Tag color={r.color}>{r.value}</Tag>,
        value: r.value,
      })),

      // [
      //   {
      //     text: <Tag style={{ color: 'yellow' }}>Pending</Text>,
      //     value: 'Pending',
      //   },
      //   {
      //     text: <Tag style={{ color: 'blue' }}>Running</Text>,
      //     value: 'Running',
      //   },
      // ],
      onFilter: (value, record) => record.status === value,
      // sorter: (a, b) => a.sname.localeCompare(b.sname),
      // ellipsis: true,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 190,
      render: (date) => dayjs(date).format(timeFormat),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
      fixed: right,
      render: (text, record) => (
        <>
          <Button color="primary" size="large" variant="text" onClick={() => showModal(record)}>
            <EditOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Popconfirm
            placement="bottom"
            title={'Delete ticket'}
            description={'Are you sure to delete this ticket ?'}
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

  const modalTitle = <div style={{ textAlign: 'center', width: '100%' }}>Ticket</div>

  const formItemLabelStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxWidth: '95%',
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'No tickets found' }}
        tableLayout="auto"
        scroll={{
          x: '100%',
        }}
      />
      <Modal
        title={modalTitle}
        open={isModalVisible}
        style={{ top: 120, overflowY: 'auto', overflowX: 'hidden' }}
        width={900}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrUpdate}
          style={{
            marginTop: 20,
            maxWidth: 'none',
          }}
          scrollToFirstError={true}
        >
          <Form.Item label="Subject">
            <Input
              style={{ width: '100%' }}
              value={currentTicket ? currentTicket.data[0].subject : null}
            ></Input>
          </Form.Item>
          <Form.Item label="Subject" name="status">
            <Select style={{ width: '100%' }} options={statusList}></Select>
          </Form.Item>
          {currentTicket && (
            <>
              {currentTicket.data.map((field, index) => (
                <>
                  <Card
                    title={field.user}
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <Row>
                      <div
                        style={{
                          whiteSpace: 'pre',
                        }}
                      >
                        {field.comment}
                      </div>
                    </Row>
                    <Row>
                      <Upload
                        defaultFileList={field.attachment ? field.attachment.fileList : []}
                        beforeUpload={() => false}
                        onPreview={(file) => handleDownloadFile(file)}
                        disabled
                      ></Upload>
                    </Row>
                  </Card>
                </>
              ))}
            </>
          )}
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: 'Please input comment' }]}
          >
            <Input.TextArea rows={5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="attachment" label="Attachment">
            <Upload
              beforeUpload={() => false}
              onChange={(info) => handleFileChange(info)}
              onPreview={(file) => handleDownloadFile(file)}
            >
              <Button icon={<UploadOutlined />}>Attach File</Button>
            </Upload>
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" htmlType="submit">
              {'Submit'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ServiceTable
