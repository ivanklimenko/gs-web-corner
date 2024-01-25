import Decoder from 'jsonous'
import { err, ok } from 'resulty'

import type { CornerStatus, EatPlace, Order, OrderStatus } from './store/types'

export const parseEatPlace = (order: Order): string =>
  order.eat_place === 'car'
    ? `к машине (${order.car_number})`
    : order.eat_place === 'market_table'
    ? `На рынке к столу ${order.table}`
    : order.eat_place === 'market_corner'
    ? 'на подносе'
    : order.eat_place === 'togo_corner'
    ? 'С собой (на рынке)'
    : order.eat_place === 'togo_courier'
    ? 'С собой(у раннера)'
    : order.eat_place === 'togo_market'
    ? 'со стойки HN'
    : order.eat_place === 'togo_delivery'
    ? 'доставка'
    : order.eat_place === 'togo_yandex'
    ? 'ЯНДЕКС'
    : ''

export const monthList = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]

export const getDateString = (time: number) => {
  const orderDay = new Date(time * 1000)

  const day = orderDay.getDate()
  const month = orderDay.getMonth()
  const year = orderDay.getFullYear()

  return `${day} ${monthList[month]} ${year}`
}

export const getTimeString = (time: number) => {
  const date = new Date(time * 1000)

  const hours = date.getHours()
  const minutes = `0${date.getMinutes()}`

  return `${hours}:${minutes.substr(-2)}`
}

export const translateToStyleCorner = (status: CornerStatus) =>
  status === 'waiting'
    ? 'НОВЫЙ'
    : status === 'confirmed'
    ? 'ПРИНЯТ'
    : status === 'refused'
    ? 'ОТКЛОНЁН'
    : status === 'expects'
    ? 'ОЖИДАЕТ ПРИГОТОВЛЕНИЯ'
    : status === 'cooking'
    ? 'ГОТОВИТСЯ'
    : status === 'ready'
    ? 'ГОТОВ'
    : status === 'waiting_on_counter'
    ? 'ГОТОВ'
    : status === 'issued_courier'
    ? 'У РАННЕРА'
    : status === 'received'
    ? 'ВЫДАН КЛИЕНТУ'
    : ''

export const translateToStyleOrder = (status: OrderStatus) =>
  status === 'waiting'
    ? 'не принят'
    : status === 'confirmed'
    ? 'принят'
    : status === 'refused'
    ? 'отклонён'
    : status === 'expects'
    ? 'в процессе'
    : status === 'cooking'
    ? 'в процессе'
    : status === 'ready'
    ? 'готов'
    : status === 'issued_courier'
    ? 'у раннера'
    : status === 'waiting_on_counter'
    ? 'ожидает клиента'
    : status === 'received'
    ? 'заказ выдан клиенту'
    : ''

export const translateToTextCorner = (status: CornerStatus) => {
  return status === 'waiting'
    ? 'ПРИНЯТЬ'
    : status === 'confirmed'
    ? 'ГОТОВИТЬ'
    : status === 'refused'
    ? 'ОТКЛОНЁН'
    : status === 'expects'
    ? 'НАЧАТЬ'
    : status === 'cooking'
    ? 'ГОТОВ'
    : status === 'ready'
    ? 'ВЫДАТЬ'
    : status === 'waiting_on_counter'
    ? 'ВЫДАТЬ'
    : status === 'issued_courier'
    ? 'У РАННЕРА'
    : status === 'received'
    ? 'ВЫДАН КЛИЕНТУ'
    : ''
}

export const playSound = (audioFile: { play: () => any }) => {
  return audioFile.play()
}

export const statusToShowButtons = (status: CornerStatus, eatPlace: EatPlace) => {
  console.log(status, eatPlace)
  if (
    status === 'refused' ||
    status === 'issued_courier' ||
    status === 'received' ||
    (status === 'ready' &&
      (eatPlace === 'car' ||
        eatPlace === 'togo_courier' ||
        eatPlace === 'togo_delivery' ||
        eatPlace === 'togo_yandex' ||
        eatPlace === 'market_table'))
  ) {
    return false
  } else {
    return true
  }
}

export const nullOr = <T>(decoder: Decoder<T>): Decoder<T | null> =>
  new Decoder<T | null>((val: unknown) => (val === null ? ok(val) : decoder.decodeAny(val)))

export const numToBool = new Decoder<boolean>((val: unknown) =>
  val === null || val === 0 ? ok(false) : typeof val === 'number' ? ok(true) : err('Should be number or NULL'),
)

export const decodeAndGet = <T>(decoder: Decoder<T>, payload: unknown): [T | undefined, string] =>
  decoder.decodeAny(payload).cata<[T | undefined, string]>({
    Ok: (val) => [val, ''],
    Err: (msg) => [undefined, msg],
  })

export const translateEnabledToStatus = (enabled: boolean | undefined) => (enabled ? 'Работаем' : 'Общий стоп')

export const bagOrTray = (place: EatPlace): string =>
  place === 'market_table' || place === 'market_corner'
    ? 'На подносе'
    : place === 'togo_delivery'
    ? 'доставка'
    : 'С собой'

export const bagOrTrayUsach = (place: EatPlace): string =>
  place === 'market_table' || place === 'market_corner' ? 'На подносе' : 'В пакете'

export const isRecord = (obj: unknown): obj is Record<PropertyKey, unknown> => obj !== null && typeof obj === 'object'

export const optionalField = <T>(fieldName: string, decoder: Decoder<T>, defaultValue: T): Decoder<T> =>
  new Decoder((val: unknown) =>
    isRecord(val) && fieldName in val ? decoder.decodeAny(val[fieldName]) : ok(defaultValue),
  )

export const unitsTranslate = (units: string) => (units === 'g' ? 'гр' : units === 'ml' ? 'мл' : '')
