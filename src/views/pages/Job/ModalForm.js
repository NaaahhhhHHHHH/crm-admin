import React, { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Radio,
  Row,
  Col,
  message,
  Upload,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`

const DynamicFormModal = ({ title, visible, onClose, formDataArray, onSubmit }) => {
  const [form] = Form.useForm()
  const [fields, setFields] = useState([])

  useEffect(() => {
    if (formDataArray) {
      // Set the fields from formDataArray to the form
      const initialFields = formDataArray.map((item, index) => ({
        name: item.fieldname,
        label: item.label,
        // initialValue: item.initvalue,
        rules: item.required ? [{ required: true, message: `${item.fieldname} is required` }] : [],
        type: item.type,
        options: item.option || [],
        value: item.value,
      }))
      setFields(initialFields)
      form.resetFields() // Clear the form on modal open
    }
  }, [formDataArray, form, visible])

  const handleFinish = async (values) => {
    // Submit the values
    const formattedValues = formDataArray.map((field, index) => ({
      ...field,
      value: values[field.fieldname],
    }))

    onSubmit(formattedValues)
    form.resetFields()
    setFields([])
    onClose()
  }

  const modalTitle = <div style={{ textAlign: 'center', width: '100%' }}>{`${title} Form`}</div>

  const formItemLabelStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxWidth: '95%',
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

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      style={{ top: 120, overflowY: 'auto', overflowX: 'hidden' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
      >
        {fields.map((field, index) => {
          switch (field.type) {
            case 'input':
              return (
                <Form.Item
                  key={index}
                  label={<span style={formItemLabelStyle}>{field.label}</span>}
                  name={field.name}
                  rules={field.rules}
                  initialValue={field.value}
                >
                  <Input disabled placeholder={`Enter ${field.name}`} />
                </Form.Item>
              )
            case 'textarea':
              return (
                <Form.Item
                  key={index}
                  label={<span style={formItemLabelStyle}>{field.label}</span>}
                  name={field.name}
                  rules={field.rules}
                  initialValue={field.value}
                >
                  <Input.TextArea disabled placeholder={`Enter ${field.name}`} />
                </Form.Item>
              )
            case 'select':
              return (
                <Form.Item
                  key={index}
                  label={<span style={formItemLabelStyle}>{field.label}</span>}
                  name={field.name}
                  rules={field.rules}
                  initialValue={field.value}
                >
                  <Select disabled placeholder={`Select ${field.name}`}>
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
                  name={field.name}
                  rules={field.rules}
                  initialValue={field.value}
                >
                  <Radio.Group disabled style={{ display: 'inline-grid' }}>
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
                  name={field.name}
                  rules={field.rules}
                  initialValue={field.value}
                >
                  <Checkbox.Group disabled style={{ display: 'inline-grid' }}>
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
                  name={field.name}
                  rules={field.rules}
                >
                  <Upload
                    defaultFileList={field.value ? field.value.fileList : []}
                    name={field.name}
                    beforeUpload={() => false} // Prevent immediate upload
                    onChange={(info) => handleFileChange(index, info)}
                    onPreview={(file) => handleDownloadFile(file)}
                    disabled
                  >
                    <Button icon={<UploadOutlined />}>Upload File</Button>
                  </Upload>
                </Form.Item>
              )
            default:
              return null
          }
        })}
        <Row justify="center">
          <Col>
            <Button type="primary" htmlType="submit">
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default DynamicFormModal
