import React from 'react'
import { useHistory, useParams } from 'react-router-dom'

import sprite1 from '../assets/img/svg/svg-sprite.svg'
import { useAppDispatch, useAppSelector } from '../store'
import { slice as orderSlice } from '../store/order'
import { getOutletOrder } from '../store/order'
import type { CornerStatus, EatPlace } from '../store/types'
import { bagOrTray, statusToShowButtons, translateToStyleCorner, translateToTextCorner } from '../utils'

const getTime = (time: number) => {
  const date = new Date(time * 1000)

  const hours = date.getHours()
  const minutes = `0${date.getMinutes()}`

  return `${hours}:${minutes.substr(-2)}`
}

interface StatusMap {
  waiting: CornerStatus
  confirmed: CornerStatus
  cooking: CornerStatus
  ready: CornerStatus
  issued_courier: CornerStatus
  waiting_on_counter: CornerStatus
}

interface OrderStatusMap {
  runner: StatusMap
  corner: StatusMap
}

const orderStatuses: OrderStatusMap = {
  runner: {
    waiting: 'cooking',
    confirmed: 'cooking',
    cooking: 'ready',
    ready: 'issued_courier',
    issued_courier: 'received',
    waiting_on_counter: 'received',
  },

  corner: {
    waiting: 'cooking',
    confirmed: 'cooking',
    cooking: 'waiting_on_counter',
    ready: 'received',
    issued_courier: 'received',
    waiting_on_counter: 'received',
  },
}

type ButtonsState = 'idle' | 'denyActive' | 'acceptActive' | 'denyClicked' | 'acceptClicked'

const runnerOrCorner = (place: EatPlace): 'runner' | 'corner' =>
  place === 'market_corner' || place === 'togo_corner' ? 'corner' : 'runner'

const Order = () => {
  // --- EXTERNAL STATE --- //

  const history = useHistory()

  const dispatch = useAppDispatch()

  const { orderId } = useParams<{ orderId?: string }>()

  const user = useAppSelector((state) => state.auth.user)
  const outlet = useAppSelector((state) => state.outlet.data)
  const order = useAppSelector((state) => state.order.data)
  const isLoading = useAppSelector((state) => state.order.isLoading)
  const status = useAppSelector((state) => state.order.status)

  console.log('outlet-->>', outlet?.id)
  console.log('--->>', order)

  const outletOrder = order && outlet?.id ? getOutletOrder(order, outlet.id) : null

  // --- LOCAL STATE --- //

  const [buttonsState, setButtonsState] = React.useState<ButtonsState>(status === 'waiting' ? 'idle' : 'acceptActive')

  // --- CONSTAINTS --- //

  const acceptBtnClass = buttonsState === 'acceptActive' ? 'order__button_accept--active' : ''
  const denyBtnClass =
    buttonsState === 'denyActive' || buttonsState === 'denyClicked' ? 'order__button_deny--active' : ''

  const isTerminated = order ? statusToShowButtons(outletOrder?.status, outletOrder?.order.eat_place) : true

  // --- CALLSBACKS --- //

  // const goBack = () => {
  //   history.push('/orders')
  // }

  const acceptedClick = React.useCallback(() => {
    if (buttonsState === 'acceptActive') {
      if (outletOrder) {
        const { status } = outletOrder
        if (
          status === 'waiting' ||
          status === 'cooking' ||
          status === 'confirmed' ||
          status === 'waiting_on_counter' ||
          status === 'ready'
        ) {
          const transitionMap = orderStatuses[runnerOrCorner(outletOrder.order.eat_place)]
          console.log('transitionMap >>', runnerOrCorner(outletOrder.order.eat_place))
          const nextStatus = transitionMap[status]
          console.log('Next Status >>>', transitionMap[status])

          dispatch(
            orderSlice.actions.updateCornerStatusStart({
              outletOrderId: outletOrder.id,
              status: nextStatus,
            }),
          )
        }
      }
      setButtonsState('acceptClicked')
    } else {
      setButtonsState('acceptActive')
    }
  }, [buttonsState, order])

  const deniedClick = React.useCallback(() => {
    if (buttonsState === 'denyActive') {
      setButtonsState('denyClicked')
    } else {
      setButtonsState('denyActive')
    }
  }, [buttonsState])

  const close = () => {
    setButtonsState('idle')
  }

  const handleDeny = () => {
    if (outletOrder) {
      dispatch(
        orderSlice.actions.updateCornerStatusStart({
          outletOrderId: outletOrder.id,
          status: 'refused',
        }),
      )
    }

    setButtonsState('idle')
  }

  // --- EFFECTS --- //

  React.useEffect(() => {
    if (!orderId) return

    dispatch(orderSlice.actions.loadStart(parseInt(orderId)))
  }, [orderId])

  React.useEffect(() => {
    if (buttonsState === 'acceptClicked') {
      const timeout = setTimeout(() => {
        setButtonsState('acceptActive')
      }, 1500)

      return () => {
        clearTimeout(timeout)
      }
    }

    return
  }, [buttonsState])

  // --- RENDERING --- //

  return outletOrder ? (
    <>
      <div className="page">
        <div className="page__container">
          {buttonsState === 'denyClicked' ? (
            <>
              <div className="overlay overlay_active" onClick={close}></div>
              <div className="deny__form">
                <div className="deny_text">Вы уверены, что вы хотите отклонить&nbsp;заказ?</div>
                <div className="deny_buttons">
                  <button className="btn_deny" onClick={handleDeny}>
                    Да, отклонить
                  </button>
                  <button className="btn_accept" onClick={close}>
                    Нет
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {buttonsState === 'acceptClicked' && isLoading ? (
            <>
              <div className="overlay overlay_active"></div>
              <div className="success__splash">{translateToTextCorner(outletOrder.status)}</div>
            </>
          ) : null}

          <div className="page__content">
            <div className="order__title">
              <svg width="12" height="14" onClick={history.goBack}>
                <use xlinkHref={sprite1 + '#icon-back'} />
              </svg>
              <span>{`ЗАКАЗ №${outletOrder.order_id} (${getTime(outletOrder.order.created_at ?? 0)})`}</span>
              <div className="order__logo">
                <svg width="24" height="24">
                  <use xlinkHref="../static/img/svg/svg-sprite.svg#icon-login"></use>
                </svg>
              </div>
            </div>
            <div className="order">
              {/* <!-- кусок с данными по заказу --> */}
              <div className="order__table">
                <div className="order__row">
                  {/* <div className="order__col order__col-name">Клиент</div>
                  <div className="order__col order__col-value order__client">
                    {outletOrder.order.name ? <span>{outletOrder.order.name}</span> : null}
                    {outletOrder.order.phone ? (
                      <a href={`tel:${outletOrder.order.phone.replace(/\D/g, '')}`}>{outletOrder.order.phone}</a>
                    ) : null}
                  </div> */}
                </div>
                <div className="order__row">
                  <div className="order__col order__col-name">Способ подачи:</div>
                  <div className="order__col order__col-value">{bagOrTray(outletOrder.order.eat_place)}</div>
                </div>
                <div className="order__row">
                  <div className="order__col order__col-name">Количество приборов</div>
                  <div className="order__col order__col-value">{outletOrder.order.cutlery}</div>
                </div>
                <div className="order__row">
                  <div className="order__col order__col-name">Приготовить к</div>
                  <div className="order__col order__col-value">
                    {outletOrder.order.ready_quickly === 1
                      ? 'как можно скорее'
                      : `к ${getTime(Number(outletOrder.order.ready_time))}`}
                  </div>
                </div>
                <div className="order__row">
                  <div className="order__col order__col-name">Комментарий</div>
                  <div className="order__col order__col-value order__comment">{outletOrder.order.note}</div>
                </div>
              </div>

              {/* <!-- стоимость заказа --> */}
              <div className={`status order__status--${outletOrder.status}`}>
                {order ? translateToStyleCorner(outletOrder.status) : ''}
              </div>
              {/* <!-- состав заказа --> */}
              <div className="order__item order__item_active">
                <div className="order__body">
                  {(outletOrder.order_items ?? []).map((item, index) => (
                    <div className="order__body-item" key={item.id}>
                      <div className="order__body-row">
                        <img className="card__img" src={`${item?.image}`} width="30px" height="30px" />
                        <div className="order__position">
                          <div className="order__dish">{item.title}</div>
                          <div className="order__weight">{item.weight}</div>
                        </div>
                        <div className="order__number order__number_bold">x{item.qty_item}</div>
                        <div className="order__sum order__sum_md">{item.full_price} ₽</div>
                      </div>
                      <div className="order__itemnote">{item.note}</div>
                      {item.options.map((option) => (
                        <div className="order__body-row" key={option.id}>
                          <div className="order__num"></div>
                          <div className="order__dish-extra">+ {option.title}</div>
                          <div className="order__number">x{item.qty_item}</div>
                          <div className="order__sum">{option.price} ₽</div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="order__footer">
                    <div className="order__body-row">
                      <div className="order__num"></div>
                      <div className="order__dish"></div>
                      {/* <div className="order__number">
                        x{(outletOrder.order_items ?? []).reduce((count, item) => count + item.qty_item, 0)}
                      </div> */}
                      <div className="order__sum">{outletOrder.order_items_full_sum} ₽</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Блок кнопок> --> */}
          {isTerminated ? (
            <div className={`order__button-wrap`}>
              <div className="buttons_block">
                <button
                  className={`order__button order__button_deny ${denyBtnClass}`}
                  type="button"
                  onClick={deniedClick}
                  disabled={isLoading}
                >
                  Отклонить
                </button>
                <button
                  className={`order__button order__button_accept ${acceptBtnClass} btn--${outletOrder.status}`}
                  type="button"
                  onClick={acceptedClick}
                  disabled={isLoading}
                >
                  {order ? translateToTextCorner(outletOrder.status) : ''}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  ) : null
}

export default Order
