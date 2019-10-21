import '../styles/login.less'

import { LitElement, html, css } from 'lit-element'
import 'bui/elements/paper'
import 'bui/elements/btn'
import 'form/form-control'
import user from './user'

customElements.define('a-login', class extends LitElement{

    static get styles(){return css`
        :host {
            background: var(--dark-black);
            display: block;
            position:relative;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        b-paper {
            width: 400px;
            max-width: 96%;
            display: grid;
            position:relative;
            gap: 1em;
        }

        b-paper > img {
            height: 140px;
            margin: 0 auto -.5em;
            right: -20px;
            position: relative;
        }

        form-control {
            display: block;
        }

        h1 {
            text-align: center;
            margin: 0;
        }

        .error:empty {
            display: none;
        }

        .error {
            margin: 0;
            color: var(--red);
        }
    `}

    firstUpdated(){
        document.body.classList.add('show')
    }

    render(){return html`
        <b-paper>

            <form-control material="outline" label="Email" key="email">
                <input slot="control" type="email" id="email" pattern="email" autocomplete="email" value="test@example.com">
            </form-control>

            <form-control material="outline" label="Password" key="password">
                <input slot="control" type="password" id="password" @keydown=${this.onKeydown} autocomplete="current-password" value="password">
                <b-icon name="eye-off" @click=${this.toggleSeePW} slot="suffix"></b-icon>
            </form-control>

            <b-btn block lg color="primary" @click=${this.login}>Sign In</b-btn>
            <p class="error"></p>

        </b-paper>
    `}

    toggleSeePW(e){
        let input = e.currentTarget.previousElementSibling
        input.type = input.type == 'text' ? 'password' : 'text'
        e.currentTarget.name = input.type == 'text' ? 'eye-1' : 'eye-off'
    }

    onKeydown(e){
        if( e.key == 'Enter' )
            e.currentTarget.parentElement.nextElementSibling.click()
    }

    login(e){

        let btn = e.currentTarget

        // already logging in
        if( btn.spin ) return

        let email = this.shadowRoot.querySelector('#email')
        let pw = this.shadowRoot.querySelector('#password')

        if( email.isInvalid || !email.value || !pw.value )
            return console.log('missing creds')

        btn.spin = true
        
        user.login(pw.value, email.value).then(resp=>{
            
            btn.spin = false

            if( resp.error ){
                btn.nextElementSibling.innerHTML = resp.error
                return
            }

            window.location = '/'+location.hash

        }, err=>{
            btn.spin = false
            btn.nextElementSibling.innerHTML = 'Problem signing in'
        })
        
    }

})

export default customElements.get('a-login')