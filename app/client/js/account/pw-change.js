import { LitElement, html, css } from 'lit-element'
import Panel from 'panel'
import Dialog from 'dialog'
import 'bui/elements/spinner-overlay'
import 'form/form-handler'
import 'form/form-control'

const MIN_LEN = 8
let View

customElements.define('a-password-change', class extends LitElement{

    static open(model){

        // reuse the same view
        if( !View )
            View = document.createElement('a-password-change')

        if( !model ) return;

        View.model = model

        new Panel(View, {
            title: 'Password',
            width: '360px',
            height: '420px',
            anchor: 'center',
            onClose: View.onClose.bind(View)
        }).open()
    }

    static get styles(){return css`
        :host {
            display: block;
        }

        form-handler {
            display: grid;
            position:relative;
            padding: 1em;
            /* gap: 1em; */
        }
    `}

    render(){return html`
        <b-spinner-overlay lg></b-spinner-overlay>
        <b-panel-toolbar>
            <b-btn outline slot="close-btn" @click=${this.close}>Cancel</b-btn>
        </b-panel-toolbar>

        <form-handler no-grid-area>

            <form-control material="filled" label="Current Password" key="pw_current">
                <input slot="control" type="password">
            </form-control>

            <b-hr short></b-hr>

            <form-control material="filled" label="New Password" key="pw_new">
                <input slot="control" type="password" .validate=${this.validateConfirm.bind(this)}>
                <span slot="help">Use at least ${MIN_LEN} characters</span>
            </form-control>

            <form-control material="filled" label="Confirm New Password" key="pw_new_confirm">
                <input slot="control" type="password" .validate=${this.validateConfirm.bind(this)}>
            </form-control>

            <br>
            <b-btn lg block color="primary" @click=${this.changePassword}>Change Password</b-btn>

        </form-handler>
    `}

    changePassword(){
        let currentPW = this.formHandler.get('pw_current').value
        let newPW = this.formHandler.get('pw_new').value
        let confirmPW = this.formHandler.get('pw_new_confirm').value

        if( currentPW != newPW
        && newPW.length >= MIN_LEN 
        && newPW === confirmPW ){
            this.spinner.show = true
            console.log('update pw', currentPW, newPW);
            
            fetch(this.model.url()+'/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({currentPW, newPW})
            }).then(r=>r.json())
            .then(resp=>{

                this.spinner.show = false

                if( resp.error ){
                    Dialog.error({title: 'Error', msg: resp.error}).modal()
                    return
                }
                
                this.close()

                Dialog.success({msg: 'Password Changed'}).modal()
            })
        }
    }

    validateConfirm(val, el){
        if( !val )return true;
        let key = el.parentElement.key

        el.popover&&el.popover.close()

        let currentPW = this.formHandler.get('pw_current')
        let newPW = this.formHandler.get('pw_new')
        let confirmPW = this.formHandler.get('pw_new_confirm')

        if( key == 'pw_new' && val.length < MIN_LEN ){
            // Dialog.error({msg: 'Too short', btns: false}).popover(el)
            return false
        }

        if( key == 'pw_new' && currentPW.value == newPW.value ){
            // Dialog.error({msg: 'Same password as your current', btns: false}).popover(el)
            return false
        }

        if( key == 'pw_new_confirm' && newPW.value != confirmPW.value ){
            // Dialog.error({msg: 'Not the same', btns: false}).popover(el)
            return false
        }
    }

    onClose(){
        this.formHandler.editors.forEach(el=>el.value='')
    }

    close(){
        this.model = null
        this.panel&&this.panel.close()
    }

})

export default customElements.get('a-password-change')