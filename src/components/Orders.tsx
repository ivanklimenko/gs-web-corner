import React from 'react'

import ActiveOrders from './ActiveOrders'
import CompleteOrders from './CompleteOrders'
import Header from './Header'

const Orders: React.FC = () => {
  // --- EFFECTS --- //

  React.useEffect(() => {
    window.scroll(0, 0)
  }, [])

  // --- RENDERING --- //

  return (
    <>
      <Header />
      <ActiveOrders />
      <CompleteOrders />
    </>
  )
}

export default Orders
