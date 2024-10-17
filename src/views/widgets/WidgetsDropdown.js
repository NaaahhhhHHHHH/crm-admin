import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cil3d, cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {props.dashboardData ? props.dashboardData.user.total : 0}{' '}
              <span className="fs-6 fw-normal">
                (
                {props.dashboardData && props.dashboardData.user.percent != 'last0'
                  ? (props.dashboardData.user.percent * 100).toFixed(2)
                  : 0}
                %
                <CIcon
                  icon={
                    props.dashboardData &&
                    (props.dashboardData.user.percent == 'last0' ||
                      props.dashboardData.user.percent > 0)
                      ? cilArrowTop
                      : cilArrowBottom
                  }
                />
                )
              </span>
            </>
          }
          title="Users"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
                datasets: [
                  {
                    label: 'Users',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: props.dashboardData ? props.dashboardData.user.month : [],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              ${props.dashboardData ? props.dashboardData.income.total.toFixed(2) : 0}{' '}
              <span className="fs-6 fw-normal">
                (
                {props.dashboardData && props.dashboardData.income.percent != 'last0'
                  ? (props.dashboardData.income.percent * 100).toFixed(2)
                  : 0}
                %
                <CIcon
                  icon={
                    props.dashboardData &&
                    (props.dashboardData.income.percent == 'last0' ||
                      props.dashboardData.income.percent > 0)
                      ? cilArrowTop
                      : cilArrowBottom
                  }
                />
                )
              </span>
            </>
          }
          title="Income"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
                datasets: [
                  {
                    label: 'Income',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: props.dashboardData ? props.dashboardData.income.month : [],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              ${props.dashboardData ? props.dashboardData.salary.total.toFixed(2) : 0}{' '}
              <span className="fs-6 fw-normal">
                (
                {props.dashboardData && props.dashboardData.salary.percent != 'last0'
                  ? (props.dashboardData.salary.percent * 100).toFixed(2)
                  : 0}
                %
                <CIcon
                  icon={
                    props.dashboardData &&
                    (props.dashboardData.salary.percent == 'last0' ||
                      props.dashboardData.salary.percent > 0)
                      ? cilArrowTop
                      : cilArrowBottom
                  }
                />
                )
              </span>
            </>
          }
          title="Salary"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
                datasets: [
                  {
                    label: 'Salary',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: props.dashboardData ? props.dashboardData.salary.month : [],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              ${props.dashboardData ? props.dashboardData.profit.total.toFixed(2) : 0}{' '}
              <span className="fs-6 fw-normal">
                (
                {props.dashboardData && props.dashboardData.profit.percent != 'last0'
                  ? (props.dashboardData.profit.percent * 100).toFixed(2)
                  : 0}
                %
                <CIcon
                  icon={
                    props.dashboardData &&
                    (props.dashboardData.profit.percent == 'last0' ||
                      props.dashboardData.profit.percent > 0)
                      ? cilArrowTop
                      : cilArrowBottom
                  }
                />
                )
              </span>
            </>
          }
          title="Profit"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
          //       <CIcon icon={cilOptions} />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ],
                datasets: [
                  {
                    label: 'Profit',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: props.dashboardData ? props.dashboardData.profit.month : [],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
