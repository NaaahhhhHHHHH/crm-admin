import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CLink,
} from '@coreui/react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass } from '@coreui/icons'

import axios from 'axios'
// import logoImange from 'src/assets/brand/logo.png'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`
const VerifyMail = () => {
  const navigate = useNavigate()
  let token = new URLSearchParams(location.href.split('?')[1]).get('id')
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    verifyEmail()
  }, [])

  const handleError = (error) => {
    message.error('Your link is not valid or expired')
    if (error.status == 401 || error.status == 400) {
      navigate('/404')
    } else if (error.status == 500) {
      navigate('/500')
    }
  }

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        BASE_URL + '/verifyEmail',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      if (response.status === 200) {
        message.success(`Verify email successful`)
        setVerified(true)
      }
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      {verified && (
        <>
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={6}>
                <div className="clearfix">
                  <h1 className="float-start display-3 me-4">Hello</h1>
                  <h4 className="pt-3">Welcome to our page.</h4>
                  <p className="text-body-secondary float-start">
                    You have successfully verified your email.
                  </p>
                </div>
                {/* <CInputGroup className="input-prepend">
              <CInputGroupText>
                <CIcon icon={cilMagnifyingGlass} />
              </CInputGroupText>
              <CFormInput type="text" placeholder="What are you looking for?" />
              <CButton color="info">Search</CButton>
            </CInputGroup> */}
                <h6 className="text-body-secondary float-start">
                  Return to <a href="#">Home Page</a>{' '}
                </h6>
              </CCol>
            </CRow>
          </CContainer>
        </>
      )}
    </div>
  )
}

export default VerifyMail
