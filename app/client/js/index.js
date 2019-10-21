import '../styles/style.less'

import user from './user'
import router from 'bui/router'
import 'bui/helpers/backbone'
import 'bui/helpers/lit-element'
import 'form/backbone-ext'
import 'bui/elements/btn'
import './account'

globalThis.goTo = (path,props)=>{
    router.goTo(path, props)
}

globalThis.logout = ()=>{
    user.logout()
}

router.start()

window.addEventListener('DOMContentLoaded', e=>{
    document.body.classList.add('show')
})