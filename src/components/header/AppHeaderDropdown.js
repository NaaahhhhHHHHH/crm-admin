import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAlbum,
  cilImage,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { updateData, createData, deleteData, getData } from '../../api'
import { Avatar, Button, message, Upload } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { auth } from '../../authApi'
import axios from 'axios'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [countJob, setCountJob] = useState(0)
  const [countTask, setCountTask] = useState(0)

  useEffect(() => {
    authenToken()
  }, [])

  const user = useSelector((state) => state.user)
  const name = user && user.name ? user.name.split(' ')[0] : ''
  const role = user && user.role ? user.role : ''
  const id = user && user.id ? user.id : 0

  useEffect(() => {
    loadPreData()
  }, [user])

  const loadPreData = async () => {
    const response0 = await getData('job')
    const countJ = response0 && response0.data && response0.data.length ? response0.data.length : 0
    setCountJob(countJ)
    const response5 = await getData('assignment')
    let countT = 0
    if (response5 && response5.data && response5.data.length && role && id) {
      if (role == 'owner') countT = response5.data.length
      if (role == 'employee') countT = response5.data.filter((r) => r.eid == id).length
    }
    setCountTask(countT)
  }

  const handleError = (error) => {
    message.error(
      (error.response && error.response.data ? error.response.data.message : '') || error.message,
    )
    if (error.status == 401) {
      navigate('/login')
    } else if (error.status == 404) {
      navigate('/404')
    } else if (error.status == 500) {
      navigate('/500')
    }
  }

  const authenToken = async () => {
    try {
      await auth().then((res) => {
        dispatch({ type: 'set', user: res.data.user })
        localStorage.setItem('CRM-token', res.data.token)
        // name = res.user && res.user.name
        //   ? res.user.name.split(' ')[0]
        //   : ''
      })
    } catch (error) {
      handleError(error)
    }
  }
  const [avatar, setAvatar] = useState('None')

  useEffect(() => {
    if (role && id) {
      const avatarPath = `./../../assets/images/avatars/${role}/${id}.jpg`
      import(`./../../assets/images/avatars/${role}/${id}.jpg`)
        .then((avatarModule) => {
          setAvatar(avatarModule.default)
        })
        .catch((error) => {
          setAvatar('None')
        })
    }
  }, [user])

  const Logout = async (e) => {
    e.preventDefault()
    //setErrorMessage(null) // Clear previous errors
    try {
      dispatch({ type: 'set', user: null })
      localStorage.removeItem('CRM-token')
      // if (!res.user.verification) {
      //   navigate('/verification')
      // }
      //toast.success('Login successful')
      navigate('/login')
    } catch (error) {
      // Handle error (e.g., wrong credentials or server error)
      // setErrorMessage(error.message)
      // navigate('/500')
      toast.error(error.message)
    }
  }

  const handleFileChange = async ({ file, fileList: newFileList }) => {
    try {
      let fileI = newFileList.find(f => f.uid == file.uid)
      if (fileI) {
      const formFile = new FormData();
      formFile.append('file', file); 
      const response = await axios.post( BASE_URL + '/uploadLogo', formFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('CRM-token')
        },
      });
      if (response.status === 200) {
        message.success(`${file.name} uploaded successfully.`);
        location.reload();
      }
      }
    } catch (error) {
      message.error(`${file.name} upload failed.`);
    }
  }

  // const Avatar = () => {
  //   if (avatar == 'None') {
  //     return (
  //       <Avatar
  //         style={{
  //           backgroundColor: '#f56a00',
  //           verticalAlign: 'middle',
  //         }}
  //         size="large"
  //         gap={0}
  //       >
  //         {userName}
  //       </Avatar>
  //     )
  //   } else {
  //     return <Avatar src={avatar} size={55} gap={0} />
  //   }
  // }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        {avatar === 'None' && (
          <>
            <Avatar
              style={{
                backgroundColor: '#f56a00',
                verticalAlign: 'middle',
              }}
              size={50}
              gap={0}
            >
              {name}
            </Avatar>
          </>
        )}
        {avatar !== 'None' && (
          <>
            <Avatar src={avatar} size={50} gap={0} />
          </>
        )}
        {/* {Avatar()} */}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Logo</CDropdownHeader>
        <CDropdownItem onClick={() => {
          document.getElementsByClassName('uploadLogo')[0].click();
        }}>
          <CIcon icon={cilImage} className="me-2" />
          Upload Logo
          <Upload
            beforeUpload={() => false}
            onChange={(info) => handleFileChange(info)}
            showUploadList={false}
            // onPreview={(file) => handleDownloadFile(file)}
            // disabled
          >
            <Button className='uploadLogo' hidden>Upload File</Button>
          </Upload>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#/Job/Job">
          <CIcon icon={cilBell} className="me-2" />
          Jobs
          <CBadge color="info" className="ms-2">
            {countJob}
          </CBadge>
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownItem href="#/Job/Assign">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            {countTask}
          </CBadge>
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#/People/Profile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#/People/ChangePassword">
          <CIcon icon={cilSettings} className="me-2" />
          Change Password
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={Logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
