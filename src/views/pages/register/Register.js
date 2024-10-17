import React from 'react'
import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { cilLockLocked, cilUser, cilPhone, cilMedicalCross } from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate()
  // State for form inputs
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [ssn, setSsn] = useState('')

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    //setErrorMessage(null) // Clear previous errors
    try {
      if (password != repeatPassword) {
        toast.error('Re-enter password is incorrect')
      }

      // Call the register API function from api.js
      let requestData = {
        username: username,
        email: email,
        password: password,
        phone: phone,
        ssn: ssn,
      }
      const data = await register(requestData, '/api/customer').then((res) => {
        // localStorage.setItem('CRM-id', res.user.id)
        // localStorage.setItem('CRM-name', res.user.name)
        // localStorage.setItem('CRM-email', res.user.email)
        // localStorage.setItem('CRM-username', res.user.username)
        // localStorage.setItem('CRM-role', res.user.role)
        // localStorage.setItem('CRM-verification', res.user.verification)
        // localStorage.setItem('CRM-token', res.token)
        // if (!res.user.verification) {
        //   navigate('/verification')
        // }
        toast.success('Registration successful, please verify your email')
        navigate('/')
      })
    } catch (error) {
      // Handle error (e.g., wrong credentials or server error)
      // setErrorMessage(error.message)
      // navigate('/500')
      toast.error(error.message)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={6} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="username"
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      autoComplete="username"
                      minLength={6}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      required
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      required
                      placeholder="PhoneNumber"
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="^(\\(?[2-9]{1}[0-9]{2}\\)?[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4})$"
                      title="Three letter country code"
                      autoComplete="phonenumber"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      autoComplete="new-password"
                      minLength={9}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      required
                      placeholder="Repeat password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={5}>
                      <CButton type="submit" color="primary">
                        Create Account
                      </CButton>
                    </CCol>
                    <CCol xs={6}>
                      <Link to="/login">
                        <CButton color="link" className="px-0">
                          Already have account, Sign in
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
