export type CornerStatus =
  | 'waiting'
  | 'confirmed'
  | 'refused'
  | 'expects'
  | 'cooking'
  | 'ready'
  | 'issued_courier'
  | 'received'
  | 'waiting_on_counter'

type CornerStatusObj = {
  [key in CornerStatus]: true
}

const cornerStatusObj: CornerStatusObj = {
  waiting: true,
  confirmed: true,
  refused: true,
  expects: true,
  cooking: true,
  ready: true,
  issued_courier: true,
  received: true,
  waiting_on_counter: true,
}

export const isCornerStatus = (val: string): val is CornerStatus => Object.keys(cornerStatusObj).includes(val)

export type OrderStatus =
  | 'waiting'
  | 'confirmed'
  | 'refused'
  | 'expects'
  | 'cooking'
  | 'ready'
  | 'issued_courier'
  | 'waiting_on_counter'
  | 'received'

export interface OutletDescription {
  id: number
  title: string
  work_hours_start: string
  work_hours_end: string
  support_phone: string
  image: string | null
  market_title: string | null
  is_available_for_orders: boolean
}
export interface OutletShortDescription {
  id: number
  title: string
  image: string | null
}

export interface Option {
  id: number
  //target: number
  //group_id: number
  title: string
  price: number
  is_available_for_orders: boolean
  group_title: string
  is_active: number
  //sort: number
  //status: boolean
  //enabled: boolean
}
export interface ShortOption {
  id: number
  //target: number
  //group_id: number
  title: string
  price: number
  //sort: number
  //status: boolean
  //enabled: boolean
}

export interface OrderItem {
  id: number
  order_id: number
  //product_id: number
  outlet_id: number
  qty_item: number
  price_item: number
  //discount_percent: number
  full_price: number
  title: string
  image: string
  weight: string
  is_weight: number
  measure: string
  units: string
  note: string
  options: ShortOption[]
}

export interface OutletOrder {
  id: number
  order_id: number // order numbera
  outlet_id: number
  status: CornerStatus
  order_items_full_sum: number
  order_items: OrderItem[]
  outlet: OutletShortDescription
  //isLoading: boolean
  // refund_amount: number | null
  //order_items_sum: number
}

export type EatPlace =
  | 'car'
  | 'market_table'
  | 'market_corner'
  | 'togo_corner'
  | 'togo_courier'
  | 'togo_market'
  | 'togo_delivery'
  | 'togo_yandex'
  | 'consumer'

type EatPlaceObj = {
  [key in EatPlace]: true
}

const eatPlaceObj: EatPlaceObj = {
  car: true,
  market_table: true,
  market_corner: true,
  togo_corner: true,
  togo_courier: true,
  togo_market: true,
  togo_delivery: true,
  togo_yandex: true,
  consumer: true,
}

export const isEatPlace = (val: string): val is EatPlace => Object.keys(eatPlaceObj).includes(val)

export interface Order {
  id: number
  created_at: number
  full_cost: number
  delivery_cost: number
  name: string
  phone: string
  address: string
  discriminator: string | null
  eat_place: EatPlace
  eats_id: string | null
  ready_time: number // timestamp
  ready_quickly: number // 0 or 1
  cutlery: number // '2'
  note: string
  table: string | null // table number
  ready_status: OrderStatus
  car_number: string | null
  market_street_title: string | null
  delivery_street: string | null
  delivery_building: string | null
  delivery_apartment: string | null
  order_outlets: OutletOrder[]
  // quantity: number
  // discount_cost: number
}

export interface OutletOrderExt extends OutletOrder {
  order: Order
}

export interface Menu {
  id: number
  title: string
  // image_name: string
  //  alt: string
  //  scalar_image_name: string
  //  slug: string
  sort: number
  status: number
  image: string
  //  scalarImage: string
}

export interface Position {
  id: number
  category_id: number | null
  title: string
  price: number
  weight: string
  description: string
  is_active: boolean
  //enabled: boolean
  image: string
  measure: string
  units: string
  is_available_for_orders: boolean
  options: Option[]
}
