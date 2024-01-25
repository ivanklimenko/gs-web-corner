import React from 'react'

import { useAppDispatch, useAppSelector } from '../store'
import { slice as ordersSlice } from '../store/orders'

const NewOrder: React.FC = () => {
  // --- EXTERNAL STATE --- //

  const dispatch = useAppDispatch()

  const newOrders = useAppSelector((state) => state.orders.newOrders)

  // --- CALLBACKS --- //

  const resetNewOrders = () => {
    dispatch(ordersSlice.actions.resetNewOrders())
  }

  // --- RENDERING --- //

  return newOrders.length > 0 ? (
    <>
      <div className="overlay overlay_active" onClick={resetNewOrders}></div>
      <div className="new_order" onClick={resetNewOrders}>
        <div className="new_order_text">Новых заказов</div>
        <div className="new_order_num">{newOrders.length}</div>
      </div>
    </>
  ) : null
}

export default NewOrder
