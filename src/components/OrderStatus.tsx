import React from 'react'

import type { CornerStatus } from '../store/types'

const translateStatus = (status: CornerStatus): string =>
  status === 'waiting'
    ? 'Новый'
    : status === 'confirmed'
    ? 'Принят'
    : status === 'cooking'
    ? 'Готовится'
    : status === 'ready'
    ? 'Готов'
    : status === 'waiting_on_counter'
    ? 'Готов'
    : status === 'refused'
    ? 'Отклонён'
    : status === 'received'
    ? 'Выдан клиенту'
    : status === 'issued_courier'
    ? 'У раннера'
    : status

const statusToClass = (status: CornerStatus): string =>
  status === 'waiting'
    ? 'new'
    : status === 'confirmed'
    ? 'timer'
    : status === 'cooking'
    ? 'processing'
    : status === 'ready'
    ? 'complete'
    : status === 'waiting_on_counter'
    ? 'finished'
    : status === 'refused'
    ? 'cancelled'
    : status === 'received'
    ? 'received'
    : status === 'issued_courier'
    ? 'issued_courier'
    : ''

const OrderStatus: React.FC<{ status: CornerStatus }> = ({ status }) => (
  <span className={`order__status order__status--${statusToClass(status)}`}>{translateStatus(status)}</span>
)

export default OrderStatus
