import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const year = new Date().getFullYear();
  return (
    <CFooter className="px-4">
      <div className="ms-auto">
        <h href="https://" target="_blank" rel="noopener noreferrer">
          CRM App
        </h>
        <span className="ms-1">&copy; {year} .</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
