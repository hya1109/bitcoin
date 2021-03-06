import { ajax, $, timer, BASE_URL, redirect, openTab } from '../js/util'
import pop from '../js/pop'
import './index.less'

// localStorage.removeItem('token')

const codeBtn = $('.js-code-btn')
const startTimer = timer(60, (time) => {
  codeBtn.textContent = `${time}秒后重发`
}, () => {
  codeBtn.disabled = false
  codeBtn.textContent = '发送验证码'
})
codeBtn.addEventListener('click', () => {
  const phone = $('.js-phone').value
  if (!phone) return
  if (codeBtn.disabled) return
  codeBtn.disabled = true
  startTimer()
  ajax({
    url: `${BASE_URL}/api/user/send_code`,
    method: 'POST',
    needToken: false,
    data: { phone, type: 1 },
    success(data) {
      if (data.code === 0) {
        pop.success('发送成功')
      } else {
        pop.error(data.msg)
      }
    }
  })
}, false)
// 登录
$('.js-login').addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  const phone = $('.js-phone').value
  const code = $('.js-code').value
  if (!phone || !code) return
  ajax({
    method: 'POST',
    url: `${BASE_URL}/api/user/login`,
    needToken: false,
    data: {
      phone,
      verifyCode: code
    },
    success(data) {
      if (data.code !== 0) {
        pop.error(data.msg)
      } else {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.data))
        if (!data.data.hasFundPwd) {
          // 未设置密码跳转到设置密码页
          redirect('./password.html?set=1', '设置资金密码')
        } else {
          openTab(1)
        }
      }
    },
    error() {
      pop.error('登录失败')
    }
  })
}, false)

