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

const DynamicFormModal = ({ title, visible, onClose, formDataArray, onSubmit }) => {
  const [form] = Form.useForm()
  const [fields, setFields] = useState([])
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
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

  const handleFileChange = (info) => {
    // You can customize how the file is handled here
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed`)
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
                  name={field.name}
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
                  name={field.name}
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
                  name={field.name}
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
                  name={field.name}
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
                  name={field.name}
                  rules={field.rules}
                >
                  <Upload
                    name={field.name}
                    beforeUpload={(file) => {
                      setFileList([...fileList, file])
                      return false
                    }}
                    onRemove={(file) => {
                      const ind = fileList.indexOf(file)
                      const newFileList = fileList.slice()
                      newFileList.splice(ind, 1)
                      setFileList(newFileList)
                    }}
                    onChange={handleFileChange}
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
        <Row justify="center">
          <Col>
            <Button type="primary" htmlType="submit">
              OK
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default DynamicFormModal
