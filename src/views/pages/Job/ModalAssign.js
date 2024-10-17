import React, { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Checkbox,
  Radio,
  Row,
  Col,
  message,
  DatePicker,
} from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useSelector, useDispatch } from 'react-redux'
const AssignFormModal = ({
  title,
  visible,
  onClose,
  formDataArray,
  employeeOptions,
  maxBudget,
  onSubmit,
}) => {
  const [form] = Form.useForm()
  const [fields, setFields] = useState({
    eid: null,
    status: 'Waiting',
    expire: 1,
    reassignment: false,
    payment: {
      method: '1 Time',
      budget: null,
    },
  })

  const user = useSelector((state) => state.user)
  const role = user ? user.role : ''
  const userId = user ? user.id : 0

  useEffect(() => {
    if (formDataArray) {
      // Set the fields from formDataArray to the form
      // const initialFields = formDataArray.map((item, index) => ({
      //   name: item.fieldname,
      //   label: item.label,
      //   // initialValue: item.initvalue,
      //   rules: item.required ? [{ required: true, message: `${item.fieldname} is required` }] : [],
      //   type: item.type,
      //   options: item.option || [],
      //   value: item.value,
      // }))
      setFields(formDataArray)
      if (formDataArray.payment.period) {
        formDataArray.payment.period.forEach(r => {
            r.date = dayjs(r.date, dateFormat)
        })
      }
      form.setFieldsValue(formDataArray)
      // form.resetFields() // Clear the form on modal open
    } else {
      setFields({
        eid: null,
        status: 'Waiting',
        expire: 1,
        reassignment: false,
        payment: {
          method: '1 Time',
          budget: null,
        },
      })
      form.setFieldsValue({
        eid: null,
        status: 'Waiting',
        expire: 1,
        reassignment: false,
        payment: {
          method: '1 Time',
          budget: null,
        },
      })
    }
  }, [formDataArray, form, visible])

  const handleFinish = async (values) => {
    // Submit the values
    const formattedValues = form.getFieldsValue()
    if (formattedValues.payment.method == 'Period') {
      formattedValues.payment.period.forEach((r) => (r.date = r.date.format(dateFormat)))
      formattedValues.payment.budget = totalBudget()
    }
    onSubmit(formattedValues)
    form.resetFields()
    setFields(null)
    onClose()
  }

  const handleMethodChange = async (value) => {
    let formData = form.getFieldsValue()
    formData.payment.method = value
    if (value == 'Period') {
      formData.payment.period = [
        {
          date: null,
          budget: null,
        },
      ]
    }
    setFields(formData)
    form.setFieldsValue(formData)
  }

  const handleAddPeriod = async () => {
    let formData = form.getFieldsValue()
    formData.payment.period.push({
      date: null,
      budget: null,
    })
    setFields(formData)
    form.setFieldsValue(formData)
  }

  const totalBudget = () => {
    let formData = form.getFieldsValue()
    let totalBudget = 0
    if (formData.payment.method == 'Period') {
      formData.payment.period.forEach((r) => {
        let budget = r.budget ? r.budget : 0
        totalBudget += budget
      })
    }
    return totalBudget
  }

  const handleDeletePeriod = async (index) => {
    let formData = form.getFieldsValue()
    formData.payment.period.splice(index, 1)
    setFields(formData)
    form.setFieldsValue(formData)
  }

  const handleCancel = async () => {
    form.resetFields()
    setFields(null)
    onClose()
  }

  const modalTitle = <div style={{ textAlign: 'center', width: '100%' }}>{`${title} Form`}</div>

  const formItemLabelStyle = {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxWidth: '95%',
  }

  const dateFormat = 'YYYY/MM/DD'

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      style={{ top: 120, maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden' }}
    >
      <Form
        form={form}
        /*layout="vertical"*/
        onFinish={handleFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 15 }}
      >
        {fields && (
          <>
            <Form.Item
              label="Employee"
              name="eid"
              rules={[{ required: true, message: 'Please choose employee' }]}
              value={fields.eid}
            >
              <Select placeholder={`Select employee`}>
                {employeeOptions.map((option, idx) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Status" name="status" initialValue="Waiting" value={fields.status}>
              <Select>
                <Select.Option key="Waiting" value="Waiting">
                  Waiting
                </Select.Option>
                <Select.Option key="Accepted" value="Accepted">
                  Accepted
                </Select.Option>
                {/* <Select.Option key="Decline" value="Decline">
                  Decline
                </Select.Option> */}
              </Select>
            </Form.Item>

            <Form.Item
              name="expire"
              label="Expire Date"
              initialValue={1}
              value={fields.expire}
              rules={[{ required: true, message: 'Please input expire date' }]}
            >
              <InputNumber min={1} step={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Reassignment"
              name="reassignment"
              initialValue={false}
              value={fields.reassignment ? fields.reassignment : false}
            >
              <Radio.Group disabled={fields.assignby || role != 'owner'}>
                <Radio value={false}>False</Radio>
                <Radio value={true}>True</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Payment method"
              name={['payment', 'method']}
              initialValue="1 Time"
              value={fields.payment.method}
              rules={[
                { required: true, message: 'Please choose payment method' },
                ({ getFieldValue }) => ({
                  validator: (_, value) =>
                    totalBudget() <= maxBudget
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(`Total budget limit exceeded maximum ($${maxBudget})`),
                        ),
                }),
              ]}
            >
              <Select onChange={(value) => handleMethodChange(value)}>
                <Select.Option key="1 Time" value="1 Time">
                  1 Time
                </Select.Option>
                <Select.Option key="Period" value="Period">
                  Period
                </Select.Option>
              </Select>
            </Form.Item>

            {fields.payment.method === '1 Time' && (
              <>
                <Form.Item
                  name={['payment', 'budget']}
                  label="Budget"
                  value={fields.payment.budget}
                  max={100}
                  rules={[
                    { required: true, message: 'Please input budget' },
                    ({ getFieldValue }) => ({
                      validator: (_, value) =>
                        value <= maxBudget
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(`Budget limit exceeded maximum ($${maxBudget})`),
                            ),
                    }),
                  ]}
                >
                  <InputNumber step={0.01} style={{ width: '100%'}} />
                </Form.Item>
              </>
            )}
            {fields.payment.method === 'Period' && (
              <>
                {fields.payment.period.map((field, index) => (
                  <Row key={index} gutter={10} style={{ position: 'relative', left: 88 }}>
                    <Col span={8}>
                      <Form.Item
                        name={['payment', 'period', index, 'date']}
                        label={`Period ${index + 1}`}
                        labelCol={{ span: 30 }}
                        wrapperCol={{ span: 30 }}
                        rules={[{ required: true, message: 'Please choose date' }]}
                        value={field.date ? dayjs(field.date, dateFormat) : null}
                      >
                        <DatePicker format={dateFormat} placeholder="Date" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        wrapperCol={{ span: 30 }}
                        name={['payment', 'period', index, 'budget']}
                        value={fields.payment.period[index].budget}
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
                        // label={`Budget ${index + 1}`}
                        // value={field.budget}
                      >
                        <InputNumber style={{ width: 150 }} placeholder="Budget" />
                      </Form.Item>
                    </Col>
                    {fields.payment.period.length > 1 && (
                      <>
                        <Button
                          color="danger"
                          variant="link"
                          style={{ padding: '1px 13px 1px 1px' }}
                          onClick={(e) => handleDeletePeriod(index)}
                        >
                          x
                        </Button>
                      </>
                    )}
                    {fields.payment.period.length == index + 1 && (
                      <>
                        <Button
                          color="primary"
                          variant="dashed"
                          // style={{ padding: '1px 13px 1px 1px' }}
                          onClick={(e) => handleAddPeriod()}
                        >
                          +
                        </Button>
                      </>
                    )}
                  </Row>
                ))}
              </>
            )}
          </>
        )}
        <Row justify="center">
          <Col>
            <Button type="primary" htmlType="submit">
              {formDataArray ? 'Edit' : 'Add'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AssignFormModal
