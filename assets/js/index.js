import '../scss/index.scss'
import 'tippy.js/dist/tippy.css'
import 'izitoast/dist/css/iziToast.css'

import tippy from 'tippy.js'

import delegate from 'delegate'

import { each } from './system/each.js'

import { extend } from './system/extend.js'

import { ajax } from './system/fetch.js'

import Form from './form/index.js'

import message from './system/message.js'

import { data, attr } from './system/attribute.js'

import { formatBytes } from './core/gb.js'

import Dialog from './modal/index.js'

const _$ = {
  tippy: tippy,
  extend: extend,
  each: each,
  ajax: ajax,
  delegate: delegate,
  Form: Form,
  message: message,
  data: data,
  attr: attr,
  gb: formatBytes,
  Dialog: Dialog,
}

window._$ = _$
