const db = require('./db')
const bcrypt = require('bcrypt')
var crypto = require("crypto");

const serializedUsers = new Map()

module.exports = class User {

    constructor(attrs){
        this.attrs = attrs

        this.attrs.email_hash = null

        if( attrs.email ){
            this.attrs.email_hash = crypto.createHash('md5').update(attrs.email).digest("hex");
        }
    }

    get id(){ return this.attrs.id }
    get email(){ return this.attrs.email }
    get name(){ return this.attrs.name }

    toJSON(){
        let data = Object.assign({}, this.attrs)
        delete data.password
        return data
    }

    toString(){
        return JSON.stringify(this.toJSON())
    }

    async verifyPassword(pw){
        return bcrypt.compare(pw, this.attrs.password)
    }

    static async encryptPassword(pw){
        return bcrypt.hash(pw, 10)
    }

    static async findByID(id){
        let resp = await db.q('SELECT * FROM users WHERE id = ?', id)
        return resp && new User(resp[0])
    }

    static async findByEmail(email){

        let resp = await db.q('SELECT * FROM users WHERE email = ?', email)
        
        if( !resp || resp.length == 0 )
            throw Error('email not found')

        return new User(resp[0])
    }

    static async login(email, password){
        let user = await User.findByEmail(email)

        if( !await user.verifyPassword(password) ){
            throw Error('password does not match')
        }
        
        return user
    }

    static deserializeUser(id){
        if( !serializedUsers.get(id) ){
            let user = User.findByID(id)
            if( user )
                serializedUsers.set(id, user)
        }

        return serializedUsers.get(id)
    }

    static hashPassword(pw){
        return pw ? bcrypt.hash(pw, 10) : null;
    }

}