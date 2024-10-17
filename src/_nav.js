import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilPeople,
  cilControl,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const apiUrl =
  import.meta.env.MODE == 'product' ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_LOCAL

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'People',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Employee',
        to: '/People/Employee',
      },
      {
        component: CNavItem,
        name: 'Owner',
        to: '/People/Owner',
      },
      {
        component: CNavItem,
        name: 'Customer',
        to: '/People/Customer',
      },
    ],
  },

  {
    component: CNavItem,
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    name: 'Service',
    to: '/Service/Service',
  },
  {
    component: CNavItem,
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    name: 'Form',
    to: '/Service/Form',
  },

  {
    component: CNavItem,
    name: 'Job',
    to: '/Job/Job',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Assign',
    to: '/Job/Assign',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Docs',
    href: `${apiUrl}/api-docs/`,
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
