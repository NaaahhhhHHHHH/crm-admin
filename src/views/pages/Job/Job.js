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
  Tree,
  Tag,
  Popconfirm,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import html2pdf from 'html2pdf.js';
import {
  SearchOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
  FolderViewOutlined,
  FileAddOutlined,
  UserAddOutlined,
  DownOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import '../index.css'
import { updateData, createData, deleteData, getData } from '../../../api'
import Highlighter from 'react-highlight-words'
import DynamicFormModal from './ModalForm'
import AssignFormModal from './ModalAssign'
import dayjs from 'dayjs'
import { useSelector, useDispatch } from 'react-redux'
import { left, right } from '@popperjs/core'
const dateFormat = 'YYYY/MM/DD'
const timeFormat = 'YYYY/MM/DD hh:mm:ss'

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { pdf, PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ReactDOM from 'react-dom';

const { Step } = Steps
const { TextArea } = Input
import axios from 'axios'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`

const ServiceTable = () => {
  const [data, setData] = useState([])
  const [selfData, setSelfData] = useState(null)
  const [currentData, setCurrentData] = useState([])
  const [customerData, setCustomerData] = useState([])
  const [employeeData, setEmployeeData] = useState([])
  const [serviceData, setServiceData] = useState([])
  const [assignmentData, setAssignmentData] = useState([])
  const [formData, setformData] = useState([])
  const [maxBudget, setMaxBudget] = useState(0)
  const [formDataAssign, setformDataAssign] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalExportVisible, setIsModalExportVisible] = useState(false)
  const [serviceName, setServiceName] = useState('')
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false)
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isAssignListModalVisible, setIsAssignListModalVisible] = useState(false)
  // const [currentService, setCurrentService] = useState(null)
  const [currentForm, setCurrentForm] = useState(null)
  const [currentJob, setCurrentJob] = useState(null)
  const [form] = Form.useForm()
  const [formExport] = Form.useForm()
  const [assignList, setAssignList] = useState(null)
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
  const [viewMode, setViewMode] = useState('table') // 'table' | 'calendar'
  const searchInput = useRef(null)
  const statusList = [
    {
      value: 'Pending',
      label: 'Pending',
      color: 'yellow',
    },
    {
      value: 'Preparing',
      label: 'Preparing',
      color: 'yellow',
    },
    {
      value: 'Running',
      label: 'Running',
      color: 'geekblue',
    },
    {
      value: 'Complete',
      label: 'Complete',
      color: 'green',
    },
    {
      value: 'Maintain',
      label: 'Maintain',
      color: 'green',
    },
  ]

  // const handleOpenViewModal = () => {
  //   setIsViewModalVisible(true)
  // }

  const showViewModal = (CJob) => {
    // setCurrentForm(Cform)
    // setServiceName(service.name)
    // if (Cform) {
    //   setFormDataArray(form.data) // Load existing formData
    // }
    let findService = serviceData.find((r) => r.value == CJob.sid)
    let formValue = formDataArray.find((r) => r.id == CJob.formid)
    setformData(formValue.data)
    setServiceName(findService.label)
    setIsViewModalVisible(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false)
  }

  const handleSubmitViewModal = (values) => {
    console.log('Submitted Values:', values)
    handleCloseViewModal()
  }

  const showAssignModal = (CJob) => {
    // setCurrentForm(Cform)
    // setServiceName(service.name)
    // if (Cform) {
    //   setFormDataArray(form.data) // Load existing formData
    // }
    let maxBudget = CJob.currentbudget ? CJob.currentbudget : 0
    if (role == 'employee') {
      let eid = userId
      let selfAssign = assignmentData.find((r) => r.eid == eid && r.jid == CJob.id)
      maxBudget = selfAssign ? selfAssign.payment.currentbudget : 0
    }
    setMaxBudget(parseFloat(maxBudget.toFixed(2)))
    // let formValue = formDataArray.find(r => r.id == CJob.formid)
    setformDataAssign(null)
    setCurrentJob(CJob)
    // setServiceName(findService.label)
    setIsAssignModalVisible(true)
  }

  const handleCloseAssignModal = () => {
    setCurrentJob(null)
    setIsAssignModalVisible(false)
  }

  const handleSubmitAssignModal = async (values) => {
    try {
      console.log('Submitted Values:', values)
      let res = await createData('assignment', {
        ...values,
        sid: currentJob.sid,
        jid: currentJob.id,
      })
      loadJobs()
      handleCloseModal()
      message.success(res.data.message)
      handleCloseAssignModal()
    } catch (error) {
      handleError(error)
    }
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
    loadJobs()
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

  const handleCloseAssignListModal = async () => {
    setIsAssignListModalVisible(false)
  }

  const showAssignListModal = async (record) => {
    let assignParent = assignmentData.filter((r) => r.jid == record.id && !r.assignby)
    let assignChild = assignmentData.filter((r) => r.jid == record.id && r.assignby)
    let treeData = []
    assignParent.forEach((r) => {
      let assignData = {
        title: `Employee : ${employeeData.find((e) => e.value == r.eid).label}
                Budget : ${r.payment.budget}$
                Status : ${r.status}
        `,
        key: r.id,
      }
      let childList = assignChild.filter((a) => a.assignby == r.eid)
      if (childList.length) {
        assignData.children = []
        childList.forEach((re) => {
          assignData.children.push({
            title: `Employee : ${employeeData.find((e) => e.value == re.eid).label}
                    Budget : ${re.payment.budget}$
                    Status : ${r.status}
            `,
            key: re.id,
          })
        })
      }
      treeData.push(assignData)
    })
    setAssignList(treeData)
    setIsAssignListModalVisible(true)
  }

  const loadJobs = async () => {
    try {
      const [response0, response1, response2, response3, response4, response5, response6] = await Promise.all([
        getData('job'),
        getData('service'),
        getData('form'),
        getData('customer'),
        getData('employee'),
        getData('assignment'),
        getData(`${role}/${userId}`)
      ])

      let jobList = response0.data
      let formList = response2.data
      let serviceList = response1.data
      let customerList = response3.data
      let employeeList = response4.data
      let assignmentList = response5.data
      let personInfo = response6.data
      jobList.forEach((j) => {
        j.cname = customerList.find((c) => j.cid == c.id).name
        j.sname = serviceList.find((s) => j.sid == s.id).name
        if (role == 'owner') {
          j.assignable = true
          j.assigned = true
        }
        if (role == 'employee') {
          let findAssign = assignmentList.find((a) => a.eid == userId && a.jid == j.id)
          j.assignable = findAssign.reassignment && !findAssign.assignby ? true : false
          j.assigned = findAssign.status == 'Accepted' ? true : false
        }
      })
      setData(jobList)
      setSelfData(personInfo)
      setCurrentData(jobList)
      let serviceOption = serviceList.map((r) => ({ label: r.name, value: r.id, data: r.formData }))
      let customerOption = customerList.map((r) => ({ ...r, label: r.name, value: r.id }))
      let employeeOption = employeeList.map((r) => ({ label: r.name, value: r.id }))
      setServiceData(serviceOption)
      setCustomerData(customerOption)
      setEmployeeData(employeeOption)
      setFormDataArray(formList)
      setAssignmentData(assignmentList)
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

  const showModal = (CJob) => {
    setCurrentJob(CJob)
    form.setFieldsValue(CJob)
    setIsModalVisible(true)
    setCurrentStep(0)
  }

  const showModalExport = (CJob) => {
    if (CJob) {
      setCurrentJob(CJob)
    }
    setIsModalExportVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      let res = await deleteData('job', id)
      loadJobs()
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
      let formData = { ...currentJob }
      formData.status = formValue.status ? formValue.status : formData.status
      formData.budget = formValue.budget ? formValue.budget : formData.budget
      formData.note = formValue.note ? formValue.note : formData.note
      let res = currentJob
        ? await updateData('job', currentJob.id, formData)
        : await createData('job', formData)
      loadJobs()
      handleCloseModal()
      message.success(res.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  const handleExport = () => {
    let formValue = formExport.getFieldsValue()
    //console.log(formValue);
    downloadInvoicePDF(currentJob ? currentJob.id : null, formValue)
    handleCloseModalExport();
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setCurrentJob(null)
    form.resetFields()
  }

  const handleCloseModalExport = () => {
    setIsModalExportVisible(false)
    setCurrentJob(null)
    formExport.resetFields()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      ...getColumnSearchProps('id'),
      //render: (price) => price.toLocaleString("en-US", {style:"currency", currency:"USD"}),
      sorter: (a, b) => a.id - b.id,
      fixed: left,
      //ellipsis: true,
    },
    {
      title: 'Service Name',
      dataIndex: 'sname',
      key: 'sname',
      width: 200,
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
      width: 200,
      sorter: (a, b) => a.cname.localeCompare(b.cname),
      className: 'custom-width',
      textWrap: 'word-break',
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      width: 150,
      // ...getColumnSearchProps('budget'),
      render: (budget) => budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      sorter: (a, b) => a.budget - b.budget,
      className: 'custom-width',
      textWrap: 'word-break',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
      onFilter: (value, record) => record.status === value,
      // sorter: (a, b) => a.sname.localeCompare(b.sname),
      // ellipsis: true,
    },
    {
      title: 'Create Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date) => dayjs(date).format(timeFormat),
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      defaultSortOrder: 'descend',
      // ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: right,
      render: (text, record) => (
        <>
          <Button
            color="primary"
            size="large"
            variant="text"
            onClick={() => showViewModal(record)}
          >
            <FolderViewOutlined style={{ fontSize: '20px' }} />
          </Button>
          {assignmentData.find((r) => r.jid == record.id) && (
            <Button
              color="primary"
              size="large"
              variant="text"
              onClick={() => showAssignListModal(record)}
            >
              <TeamOutlined style={{ fontSize: '20px' }} />
            </Button>
          )}
          {record.assigned && (
            <Button color="primary" size="large" variant="text" onClick={() => showModal(record)}>
              <EditOutlined style={{ fontSize: '20px' }} />
            </Button>
          )}
          {record.assignable && record.assigned && (
            <Button
              color="primary"
              size="large"
              variant="text"
              onClick={() => showAssignModal(record)}
            >
              <UserAddOutlined style={{ fontSize: '20px' }} />
            </Button>
          )}
          {record.assigned && (
            <Popconfirm
              placement="bottom"
              title={'Delete job'}
              description={'Are you sure to delete this job ?'}
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                size="large"
                color="danger"
                variant="text"
                // onClick={() => handleDelete(record.id)}
              >
                <DeleteOutlined style={{ fontSize: '20px' }} />
              </Button>
            </Popconfirm>
          )}
          <Button
              color="primary"
              size="large"
              variant="text"
              onClick={() => showModalExport(record)}
              disabled={viewMode === "table" ? false : true}>
            <DownloadOutlined style={{ fontSize: '20px' }} />
          </Button>
        </>
      ),
    },
  ]

  const modalTitle = (
    <div style={{ textAlign: 'center', width: '100%' }}>{currentJob ? 'Edit Job' : 'Add Job'}</div>
  )

  const formItemLabelStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxWidth: '95%',
  }

  const events = data.map((job) => ({
    id: job.id,
    title: `${job.sname}
    ${job.cname}`,
    start: dayjs(job.createdAt).format("YYYY-MM-DD"),
  }));

  // Utility: Split an array into chunks of `size` items
function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    if (i) size += 10;
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

// A wrapper to render a full-page background behind every Page
const PageWithBackground = ({ bgDataURL, styles, children }) => (
  <Page size="A4" style={styles.page}>
    <Image src={bgDataURL} style={styles.background} fixed />
    {children}
  </Page>
);

const downloadInvoicePDF = async (jid, formValue) => {
  let invoiceData = {
    invoiceNumber: 0,
    invoiceDate: '',
    orderNumber: 0,
    orderDate: '',
    paymentMethod: formValue.paymentMethod,
    user: {
      name: selfData.name,
      address: selfData.address,
      email: selfData.email,
      phone: selfData.phone
    },
    customer: {
      name: formValue.name,
      address: formValue.address,
      cityStateZip: formValue.zip,
      email: formValue.email,
      phone: formValue.phone
    },
    products: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
  }
  let dataExport = jid ? data.filter(r => r.id == jid) : currentData;
  if (!dataExport.length) return;
  dataExport.forEach(r => {
    invoiceData.orderNumber = Math.max(invoiceData.orderNumber, r.id)
    invoiceData.invoiceNumber = Math.max(invoiceData.orderNumber, r.id)
    let jobM = data.find(r => r.id == invoiceData.orderNumber)
    invoiceData.invoiceDate = dayjs(jobM.createdAt).format("DD/MM/YYYY")
    invoiceData.orderDate = dayjs(jobM.createdAt).format("DD/MM/YYYY")
    let invoiceS = invoiceData.products.findIndex(j => j.sid == r.sid);
    if (invoiceS >= 0) {
      invoiceData.products[invoiceS].quantity++;
      invoiceData.products[invoiceS].price += r.budget;
    } else {
      invoiceData.products.push({
        name: r.sname,
        quantity: 1,
        sid: r.sid,
        price: r.budget,
      })
    }
  })
  invoiceData.products.forEach(p => {
    invoiceData.subtotal += p.price;
  })
  invoiceData.total = invoiceData.subtotal + invoiceData.shipping;

  // Convert a Blob to a Data URL
  const toDataURL = blob =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  // 1. Fetch logo and background images
  const [logoRes, bgRes] = await Promise.all([
    fetch(`${BASE_URL}/downloadLogo`),
    fetch(`${BASE_URL}/downloadBackground`),
  ]);
  const [logoBlob, bgBlob] = await Promise.all([
    logoRes.blob(),
    bgRes.blob(),
  ]);
  const [logoDataURL, bgDataURL] = await Promise.all([
    toDataURL(logoBlob),
    toDataURL(bgBlob),
  ]);

  // 2. Define styles
  const styles = StyleSheet.create({
    page: {
      position: 'relative',
      paddingTop: 30,
      paddingBottom: 30,
      paddingLeft: 40,
      paddingRight: 40,
      fontSize: 9,
      fontFamily: 'Helvetica',
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 595,
      height: 842,
      zIndex: -1,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20
    },
    logo: { height: 30, marginBottom: 12, position: 'absolute', zIndex: 0, top: 0,left: 0,},
    logoBlock: { flex: 8.5},
    companyBlock: { flex: 3, marginBottom: 20 },
    invoiceTitle: {
      fontSize: 18,
      textAlign: 'left',
      marginBottom: 20,
      textTransform: 'uppercase',
      fontWeight: 'bold'
    },
    section: { marginBottom: 12 },
    tableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#444',
      paddingBottom: 4,
      paddingTop: 4,
      marginBottom: 4,
      alignItems: 'center',
      color: "white",
      backgroundColor: "black",
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#bbb',
      paddingVertical: 3,
      alignItems: 'center',
    },
    colProduct: { flex: 4, textAlign: 'left', paddingRight: "5px" },
    colQty: { flex: 1, textAlign: 'left' },
    colPrice: { flex: 1, textAlign: 'left' },
    totalsContainer: {
      flexDirection: 'column',
      width: '100%',
    },
    totalLine: {
      flexDirection: 'row',
      paddingVertical: 2,
    },
    totalEmpty: {
      flex: 4,
      textAlign: 'left',
    },
    totalLabel: {
      flex: 1,
      textAlign: 'left',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      fontWeight: "bold"
    },
    totalValue: {
      flex: 1, 
      textAlign: 'left',
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
  });

  // 3. Paginate products: assume 25~35 rows per page
  const productPages = chunkArray(invoiceData.products, 25);

  // 4. Build the PDF document
  const InvoiceDoc = (
    <Document>
      {productPages.map((prodChunk, pageIndex) => (
        <PageWithBackground
          key={pageIndex}
          bgDataURL={bgDataURL}
          styles={styles}
        >
          {/* FIRST PAGE: Logo + Company + INVOICE + Billing & Invoice info */}
          {pageIndex === 0 && (
            <>
              <View style={styles.infoRow}>
                <View style={styles.logoBlock}>
                  <Image src={logoDataURL} style={styles.logo} fixed/>
                </View>
                <View style={styles.companyBlock}>
                  <Text style={{fontWeight: "bold"}}>Allinclicks</Text>
                  <Text>800 Walnut Creek Dr NW</Text>
                  <Text>Lilburn, GA 30047</Text>
                  <Text>United States (US)</Text>
                </View>
              </View>

              <Text style={styles.invoiceTitle}>Invoice</Text>
              <View style={styles.infoRow}>
                <View style={styles.section}>
                  <Text>{invoiceData.customer.name}</Text>
                  <Text>{invoiceData.customer.address}</Text>
                  <Text>{invoiceData.customer.cityStateZip}</Text>
                  <Text>{invoiceData.customer.email}</Text>
                  <Text>{invoiceData.customer.phone}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={{fontWeight: "bold"}}>Ship to:</Text>
                  <Text>{invoiceData.customer.name}</Text>
                  <Text>{invoiceData.customer.address}</Text>
                  <Text>{invoiceData.customer.cityStateZip}</Text>
                  <Text>{invoiceData.customer.phone}</Text>
                </View>

                <View style={styles.section}>
                  <Text>Invoice Number: {invoiceData.invoiceNumber}</Text>
                  <Text>Invoice Date: {invoiceData.invoiceDate}</Text>
                  <Text>Order Number: {invoiceData.orderNumber}</Text>
                  <Text>Order Date: {invoiceData.orderDate}</Text>
                  <Text>Payment Method: {invoiceData.paymentMethod}</Text>
                </View>
              </View>
            </>
          )}

          {/* PRODUCT TABLE */}
          <View style={styles.section}>
            <View style={styles.tableHeader}>
              <Text style={{...styles.colProduct, fontWeight: 'bold'}}> Product</Text>
              <Text style={{...styles.colQty, fontWeight: 'bold'}}>Quantity</Text>
              <Text style={{...styles.colPrice, fontWeight: 'bold'}}>Price</Text>
            </View>
            {prodChunk.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colProduct}> {item.name}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* LAST PAGE: Email/Phone + Ship To + Totals */}
          {pageIndex === productPages.length - 1 && (
            <>
              <View style={styles.totalsContainer}>
                <View style={styles.totalLine}>
                  <Text style={styles.totalEmpty}></Text>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>
                    ${invoiceData.subtotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.totalLine}>
                  <Text style={styles.totalEmpty}></Text>
                  <Text style={styles.totalLabel}>Shipping</Text>
                  <Text style={styles.totalValue}>
                    ${invoiceData.shipping.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.totalLine}>
                  <Text style={styles.totalEmpty}></Text>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ${invoiceData.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </>
          )}
        </PageWithBackground>
      ))}
    </Document>
  );

  // 5. Generate the PDF blob and trigger download
  const blob = await pdf(InvoiceDoc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
  }
  
  const renderEventContent = (eventInfo) => {
    const job = data.find((j) => j.id == eventInfo.event.id);
    const status = statusList.find((s) => s.value == job?.status);
  
    return (
      <div
        style={{
          backgroundColor: status?.color == "geekblue" ? "#3788d8" : status?.color,
          color: "black",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 500,
          whiteSpace: "pre",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
        }}
        title={`${job?.sname} - ${job?.cname}`}
      >
        {`${job?.sname} 
${job?.cname}`}
      </div>
    );
  };

  return (
    <>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Space>
          <Button onClick={() => showModalExport()}
              variant="text" disabled={viewMode === "table" ? false : true}>
            <DownloadOutlined style={{ fontSize: '20px' }} />
          </Button>
          <Button type={viewMode === "table" ? "primary" : "default"} onClick={() => setViewMode("table")}>
            Table View
          </Button>
          <Button type={viewMode === "calendar" ? "primary" : "default"} onClick={() => setViewMode("calendar")}>
            Calendar View
          </Button>
        </Space>
      </Row>

      {viewMode === "table" && (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "100%" }}
          locale={{ emptyText: "No jobs found" }}
          tableLayout="auto"
          onChange={(pagination, filters, sorter, extra) => {
            setCurrentData(extra.currentDataSource);
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <>
                  <div style={{ gap: 15, display: 'flex' }}>
                    {record.note}
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
            rowExpandable: (record) => record.note,
          }}
        />
      )}

      {viewMode === "calendar" && (
        <Card>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "today prevYear,prev,next,nextYear",
              center: "title",  
              end: ""
            }}
            eventContent={renderEventContent} 
            events={events}
            eventClick={(info) => {
              const job = data.find((j) => j.id == info.event.id);
              if (job) {
                showModal(job);
                //setShowModal(true);
              }
            }}
            height={600}
          />
        </Card>
      )}
      <DynamicFormModal
        title={serviceName}
        visible={isViewModalVisible}
        onClose={handleCloseViewModal}
        formDataArray={formData}
        onSubmit={handleSubmitViewModal}
      />
      <AssignFormModal
        title={'Assignment'}
        visible={isAssignModalVisible}
        maxBudget={maxBudget}
        onClose={handleCloseAssignModal}
        formDataArray={formDataAssign}
        employeeOptions={employeeData}
        onSubmit={handleSubmitAssignModal}
      />
      <Modal
        title={<div style={{ textAlign: 'center', width: '100%' }}>Assign list</div>}
        open={isAssignListModalVisible}
        style={{ top: 120, overflowY: 'auto', overflowX: 'hidden' }}
        width={600}
        onCancel={handleCloseAssignListModal}
        footer={null}
      >
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0']}
          defaultExpandAll={true}
          treeData={assignList}
          titleRender={(item) => {
            return <div style={{ whiteSpace: 'pre-line' }}>{item.title}</div>
          }}
        />
      </Modal>
      <Modal
        title={modalTitle}
        open={isModalVisible}
        style={{ top: 120, overflowY: 'auto', overflowX: 'hidden' }}
        width={700}
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
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        >
          <Form.Item
            name="budget"
            label="Budget"
            rules={[{ required: true, message: 'Please input budget' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            //placeholder="$"
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please choose service' }]}
          >
            <Select
              showSearch
              placeholder="Select status"
              optionFilterProp="label"
              // onChange={(value) => handleChangeService(value)}
              options={statusList}
            />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note"
          >
            <TextArea style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" htmlType="submit">
              {currentJob ? 'Update' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={"Invoice info"}
        open={isModalExportVisible}
        style={{ top: 120, overflowY: 'auto', overflowX: 'hidden' }}
        width={700}
        onCancel={handleCloseModalExport}
        footer={null}
      >
        <Form
          form={formExport}
          layout="vertical"
          onFinish={handleExport}
          style={{
            marginTop: 20,
            maxWidth: 'none',
          }}
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input name!' }]}
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
            name="zip"
            label="City, State and Zip code"
            rules={[{ required: true, message: 'Please input City, State and Zip code!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone numer"
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
            name="paymentMethod"
            label="Payment Method"
            rules={[{ required: true, message: 'Please choose Payment Method' }]}
          >
            <Select
              showSearch
              placeholder="Select Payment Method"
              optionFilterProp="label"
              options={[
                {value: "Mastercard credit card", label: "Mastercard credit card"}, 
                {value: "Visa credit card", label: "Visa credit card"},
                {value: "Cash", label: "Cash"}
              ]}
            />
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" htmlType="submit">
              {'OK'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ServiceTable
