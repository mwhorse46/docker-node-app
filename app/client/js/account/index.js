import { LitElement, html, css } from 'lit-element'
import Panel from 'panel'
import user from '../user'
import PasswordChange from './pw-change'

Panel.register('account', 'a-user-account', {
    title: 'Account',
    width: '500px',
})

customElements.define('a-user-account', class extends LitElement{

    static get styles(){return css`
        :host {
            display: grid;
            grid-template-rows: auto 1fr;
            overflow: hidden;
            position:relative;
        }

        main {
            overflow: auto;
            padding: 1em;
        }
    `}

    constructor(){
        super()
        this.model = user
    }

    render(){return html`
        <b-panel-toolbar></b-panel-toolbar>
        <main>

            <h1>${this.model.get('email')}</h1>

            <b-btn @click=${this.changePassword}>Change Password</b-btn>
        </main>
    `}

    changePassword(){
        PasswordChange.open(this.model)
    }

})

export default customElements.get('a-user-account')