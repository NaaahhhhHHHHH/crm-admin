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
  CImage,
} from '@coreui/react'
import { Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`

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

  const loginWithGoogle = () => {
    const popup = window.open(
      `${BASE_URL}/auth/google`,
      'google-login',
      'width=500,height=600'
    );
  
    const handleMessage = (event) => {
      if (event.origin !== apiUrl) return;
  
      const { token, user, error } = event.data;
  
      window.removeEventListener('message', handleMessage);
  
      if (error) {
        toast.error(error);
        return;
      }
  
      if (token && user && user.role !== 'customer') {
        localStorage.setItem('CRM-token', token);
        toast.success('Login successful');
        dispatch({ type: 'set', user });
        navigate('/');
      } else {
        toast.error('Login failed');
      }
    };
  
    window.addEventListener('message', handleMessage);
  };
  

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
    <>
    <div style={{position: "absolute"}}>
      <CImage src={BASE_URL + '/downloadLogo'} alt="Logo" height={50}></CImage>
    </div>
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
                    <CRow className="mt-3">
                      <CCol xs={12}>
                        <CButton
                          color="light"
                          className="w-100 d-flex align-items-center justify-content-center"
                          onClick={loginWithGoogle}
                          style={{ border: '1px solid #ddd' }}
                        >
                          <img
                            src="https://toppng.com/uploads/preview/google-logo-transparent-png-11659866441wanynck5pd.png"
                            alt="Google logo"
                            style={{ width: '20px', height: '20px', marginRight: '10px' }}
                          />
                          Sign in with Google
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Login
