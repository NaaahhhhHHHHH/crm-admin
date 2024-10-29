import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'
import axios from 'axios'
// import logoImange from 'src/assets/brand/logo.png'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL
const BASE_URL = `${apiUrl}/api`

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const user = useSelector((state) => state.user)
  const role = user ? user.role : ''
  const userId = user ? user.id : 0
  if (role == 'employee' && navigation[1] && navigation[1].items && navigation[1].items[1]) {
    navigation[1].items.splice(1, 1)
  }

  // useEffect(() => {
  //   handleDownloadLogo()
  // }, [])

  // const handleDownloadLogo = async (file) => {
  //   try {
  //   await axios.get(BASE_URL + '/downloadLogo', {
  //     responseType: 'blob',
  //   }).then((response) => {
  //   let contentType = 'image/png';
  //   // const blob = new Blob([response.data], {type: contentType})
  //   const url = URL.createObjectURL(response.data);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', file.name); // Specify the file name to download
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  //   })
  //   } catch (error) {
  //     message.error(`${file.name} download failed.`);
  //   }
  // }

  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader>
        <CSidebarBrand to="/">
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={60} />
          <CIcon customClassName="sidebar-brand" icon={sygnet} height={60} /> */}
          <CImage
            src={BASE_URL + '/downloadLogo'}
            alt="Logo"
            height={60}
          ></CImage>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          lightdark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
