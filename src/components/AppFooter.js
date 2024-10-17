import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      {/* <div>
        <h href="https://" target="_blank" rel="noopener noreferrer">
          CRM App
        </h>
        <span className="ms-1">&copy; 2024 .</span>
      </div> */}
      <div className="ms-auto">
        <h href="https://" target="_blank" rel="noopener noreferrer">
          CRM App
        </h>
        <span className="ms-1">&copy; 2024 .</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
