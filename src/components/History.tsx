import React from 'react'
import { useHistory } from 'react-router-dom'

import imgLogo from '../assets/img/logo1.png'
import yandexLogo from '../assets/img/yandexLogo.svg'
import { useAppDispatch, useAppSelector } from '../store'
import { getOutletOrders } from '../store/orders'
import { slice as ordersSlice } from '../store/orders'
import type { CornerStatus, EatPlace } from '../store/types'
import { bagOrTray, bagOrTrayUsach, getDateString, getTimeString } from '../utils'

import Header from './Header'
import Loader from './Loader'
import OrderStatus from './OrderStatus'

const isComplete = (status: CornerStatus): boolean => status === 'received' || status === 'refused'

const History: React.FC = () => {
  // --- EXTERNAL STATE --- //

  const history = useHistory()

  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const activeOrders = useAppSelector((state) => state.orders.today)
  const outletTitle = useAppSelector((state) => state.outlet.data?.market_title)

  // --- CONSTANTS --- //

  const orders = user?.outlet
    ? getOutletOrders(activeOrders.list, user.outlet).filter(({ status }) => isComplete(status))
    : []

  // --- LOCAL STATE ---//

  const goToOrder = (orderId: number) => () => {
    history.push(`/order/${orderId}`)
  }

  // --- EFFECTS --- //

  React.useEffect(() => {
    dispatch(ordersSlice.actions.todayRequestStart())
  }, [])

  // --- RENDERING --- //

  return (
    <>
      <Header />
      {activeOrders.status === 'fetching' ? (
        <Loader />
      ) : activeOrders.status === 'error' ? (
        <div>Что-то пошло не так</div>
      ) : activeOrders.status === 'success' ? (
        <section className="orders">
          <div className="orders__list">
            <div className="orders__container container">
              {activeOrders.list.map((outletOrder) => (
                <div className="orders__card" key={outletOrder.id} onClick={goToOrder(outletOrder.id)}>
                  <div className="orders__card-left">
                    <div className="card__icon">
                      {outletOrder.eat_place === 'togo_yandex' ? (
                        <img className="ninja-logo" src={yandexLogo} width="47px" height="40px" alt="логотип Яндекс" />
                      ) : (
                        <img className="ninja-logo" src={imgLogo} width="47px" height="40px" alt="логотип Ниндзя" />
                      )}
                    </div>
                    <div className="card__info">
                      <span className="info__number">{outletOrder.id}</span>
                      <span className="info__price"> {Math.round(outletOrder.full_cost * 10) / 10}₽</span>
                    </div>
                  </div>
                  <div className="order__date">
                    <span>{getDateString(outletOrder.created_at)}</span>
                    <span>{getTimeString(outletOrder.created_at)}</span>
                  </div>
                  <div className="orders__card-right">
                    <div className="order__properties">
                      <OrderStatus status={outletOrder.order_outlets[0].status} />
                    </div>
                  </div>
                  <span className="order__pack">
                    {outletTitle === 'Усачёвский рынок'
                      ? bagOrTrayUsach(outletOrder.eat_place)
                      : bagOrTray(outletOrder.eat_place)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default History
