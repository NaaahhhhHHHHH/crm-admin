import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../../authApi'
import { toast } from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormCheck,
} from '@coreui/react'
import { Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // State for form inputs
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // const [errorMessage, setErrorMessage] = useState(null)

  // Handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    //setErrorMessage(null) // Clear previous errors
    try {
      // Call the login API function from api.js
      const data = await login(username, password).then((res) => {
        localStorage.setItem('CRM-token', res.token)
        dispatch({ type: 'set', user: res.user })
        // if (!res.user.verification) {
        //   navigate('/verification')
        // }
        toast.success('Login successful')
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
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CButton
                        type="button"
                        onClick={togglePasswordVisibility}
                        // color="white"
                        style={{
                          backgroundColor: "white",
                        }}
                        class="input-group-text"
                      >
                        {showPassword ? <EyeInvisibleOutlined/> : <EyeOutlined/>}
                      </CButton>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={4}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={7}>
                        <Link to="/register">
                          <CButton color="primary" className="px-4" tabIndex={-1}>
                            Register as customer
                          </CButton>
                        </Link>
                      </CCol>
                      <CCol xs={5} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
