import Decoder, * as _ from 'jsonous'
import { err, ok } from 'resulty'

import { nullOr, numToBool, optionalField } from '../utils'

import {
  CornerStatus,
  EatPlace,
  isCornerStatus,
  isEatPlace,
  Menu,
  Option,
  Order,
  OrderItem,
  OutletDescription,
  OutletOrder,
  OutletShortDescription,
  Position,
  ShortOption,
} from './types'

export const outletDecoder: Decoder<OutletDescription> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('title', _.field('title', _.string))
  .assign('work_hours_start', _.field('work_hours_start', _.string))
  .assign('work_hours_end', _.field('work_hours_end', _.string))
  .assign('support_phone', _.field('support_phone', _.string))
  .assign('image', _.field('image', nullOr(_.string)))
  .assign('market_title', _.field('market_title', nullOr(_.string)))
  .assign('is_available_for_orders', _.field('is_available_for_orders', _.boolean))

export const outletShortDecoder: Decoder<OutletShortDescription> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('title', _.field('title', _.string))
  .assign('image', _.field('image', nullOr(_.string)))
//.assign('market_title', _.field('market_title', nullOr(_.string)))

export const optionDecoder: Decoder<Option> = _.succeed({})
  .assign('id', _.field('id', _.number))
  //.assign('target', _.field('target', _.number))
  //.assign('group_id', _.field('group_id', _.number))
  .assign('title', _.field('title', _.string))
  .assign('price', _.field('price', _.number))
  .assign('is_available_for_orders', optionalField('is_available_for_orders', numToBool, false))
  .assign('group_title', _.field('group_title', _.string))
  .assign('is_active', _.field('is_active', _.number))
//.assign('sort', _.field('sort', _.number))
//.assign('status', _.field('status', numToBool))
//.assign('enabled', _.field('enabled', numToBool))

export const shortOptionDecoder: Decoder<ShortOption> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('title', _.field('title', _.string))
  .assign('price', _.field('price', _.number))

export const orderItemDecoder: Decoder<OrderItem> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('order_id', _.field('order_id', _.number))
  //.assign('product_id', _.field('product_id', _.number))
  .assign('outlet_id', _.field('outlet_id', _.number))
  .assign('qty_item', _.field('qty_item', _.number))
  .assign('price_item', _.field('price_item', _.number))
  .assign('full_price', _.field('full_price', _.number))
  .assign('title', _.field('title', _.string))
  .assign('weight', _.field('weight', _.string))
  .assign('image', _.field('image', _.string))
  .assign('note', _.field('note', _.string))
  .assign('options', _.field('options', _.array(shortOptionDecoder)))

export const outletOrderDecoder: Decoder<OutletOrder> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('order_id', _.field('order_id', _.number))
  .assign('outlet_id', _.field('outlet_id', _.number))
  .assign(
    'status',
    _.field(
      'status',
      new Decoder<CornerStatus>((val: unknown) =>
        typeof val === 'string' && isCornerStatus(val) ? ok(val) : err('expect corner status'),
      ),
    ),
  )
  //.assign('order_items_sum', _.field('order_items_sum', _.number))
  .assign('order_items_full_sum', _.field('order_items_full_sum', _.number))
  .assign('order_items', _.field('order_items', _.array(orderItemDecoder)))
  .assign('outlet', _.field('outlet', outletShortDecoder))

export const orderDecoder: Decoder<Order> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('created_at', _.field('created_at', _.number))
  .assign('delivery_cost', _.field('created_at', _.number))
  .assign('name', _.field('name', _.string))
  .assign('phone', _.field('phone', _.string))
  .assign(
    'eat_place',
    _.field(
      'eat_place',
      new Decoder<EatPlace>((val: unknown) =>
        typeof val === 'string' && isEatPlace(val) ? ok(val) : err('expect eat place'),
      ),
    ),
  )
  .assign('ready_time', _.field('ready_time', _.number))
  .assign('ready_quickly', _.field('ready_quickly', _.number))
  .assign('delivery_cost', _.field('delivery_cost', _.number))
  .assign('cutlery', _.field('cutlery', _.number))
  .assign('note', _.field('note', _.string))
  .assign('table', _.field('table', nullOr(_.string)))
  .assign('car_number', _.field('car_number', nullOr(_.string)))
  .assign('order_outlets', _.field('order_outlets', _.array(outletOrderDecoder)))
  .assign('full_cost', _.field('full_cost', _.number))

export const menuDecoder: Decoder<Menu> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('title', _.field('title', _.string))
  //.assign('sort', _.field('sort', _.number))
  //.assign('status', _.field('status', _.number))
  .assign('image', _.field('image', nullOr(_.string)))

export const positionDecoder: Decoder<Position> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('category_id', _.field('category_id', nullOr(_.number)))
  .assign('title', _.field('title', _.string))
  .assign('price', _.field('price', _.number))
  .assign('weight', _.field('weight', _.string))
  .assign('description', _.field('description', _.string))
  .assign('is_active', _.field('is_active', numToBool))
  //.assign('enabled', _.field('enabled', numToBool))
  .assign('image', _.field('image', nullOr(_.string)))
  .assign('measure', _.field('measure', nullOr(_.string)))
  .assign('units', _.field('units', _.string))
  .assign('is_available_for_orders', _.field('is_available_for_orders', numToBool))
  .assign('options', _.field('options', _.array(optionDecoder)))

export const outletOrderLazyDecoder: Decoder<OutletOrder> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('order_id', _.field('order_id', _.number))
  .assign('outlet_id', _.field('outlet_id', _.number))
  .assign(
    'status',
    _.field(
      'status',
      new Decoder<CornerStatus>((val: unknown) =>
        typeof val === 'string' && isCornerStatus(val) ? ok(val) : err('expect corner status'),
      ),
    ),
  )
//.assign('order_items_sum', _.field('order_items_sum', _.number))
//.assign('order_items_full_sum', _.field('order_items_full_sum', _.number))
//.assign('order_items', _.field('order_items', _.array(orderItemDecoder)))
//.assign('outlet', _.field('outlet', outletDecoder))

export const orderLazyDecoder: Decoder<Order> = _.succeed({})
  .assign('id', _.field('id', _.number))
  .assign('created_at', _.field('created_at', _.number))
  .assign('delivery_cost', _.field('delivery_cost', _.number))
  .assign('name', _.field('name', _.string))
  .assign('phone', _.field('phone', _.string))
  .assign(
    'eat_place',
    _.field(
      'eat_place',
      new Decoder<EatPlace>((val: unknown) =>
        typeof val === 'string' && isEatPlace(val) ? ok(val) : err('expect eat place'),
      ),
    ),
  )
  .assign('ready_time', _.field('ready_time', _.number))
  .assign('ready_quickly', _.field('ready_quickly', _.number))
  .assign('cutlery', _.field('cutlery', _.number))
  .assign('note', _.field('note', _.string))
  .assign('table', _.field('table', nullOr(_.string)))
  .assign('car_number', _.field('car_number', nullOr(_.string)))
  .assign('order_outlets', _.field('order_outlets', _.array(outletOrderLazyDecoder)))
  .assign('full_cost', _.field('full_cost', _.number))
