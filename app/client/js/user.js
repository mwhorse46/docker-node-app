import store from 'bui/util/store'
import {Model} from 'backbone'

export class User extends Model {

    urlRoot(){ return '/api/user' }

    constructor(){
        super()
        
        let cached = store('user')
        if( cached )
            this.set(cached, {silent: true})

        window.user = this // TEMP
    }

    get name(){ return this.get('name') }
    get email(){ return this.get('email') }

    get initials(){
        return user.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
    }

    logout(){
        store('user', null)
        window.location = '/logout'
    }

    async login(password, email){

        email = email || this.get('email')

        let formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        return fetch('/login', {
            method: 'post',
            credentials: 'include',
            body: formData
        }).then(r=>r.json()).then(resp=>{

            if( resp && !resp.error ){
                store('user', resp)
            }

            return resp
        })
    }

}

// singleton logged in user
export default new User()