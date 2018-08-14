import bxAjax from 'common/js/request.js'

export function getAccountInfo (url, params) {
  return new Promise((resolve, reject) => {
    bxAjax({
      url: url,
      type: 'POST',
      data: params,
      dataType: 'json',
      success: function (response, xml) {
        resolve(JSON.parse(response))
      },
      fail: function (status) {
        reject(status)
      }
    })
  })
}

export function getBankList (url, params) {
  return new Promise((resolve, reject) => {
    bxAjax({
      url: url,
      type: 'POST',
      data: params,
      dataType: 'json',
      success: function (response, xml) {
        resolve(JSON.parse(response))
      },
      fail: function (status) {
        reject(status)
      }
    })
  })
}

export function bankCardWithdraw (url, params) {
  return new Promise((resolve, reject) => {
    bxAjax({
      url: url,
      type: 'POST',
      data: params,
      dataType: 'json',
      success: function (response, xml) {
        resolve(JSON.parse(response))
      },
      fail: function (status) {
        reject(status)
      }
    })
  })
}
