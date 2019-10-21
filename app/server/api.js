/*
    API via Express
    Initializes APIs using classes

    const app = require('express')();

    new API(app, [
        MyClass,
        AnotherClass
    ])

    class MyClass {

        // required
        static get api(){return {
            routes: [
                ['get', '/url-path', 'methodName']
            ]
        }}

        methodName(req){
            // do something
            return 'the value'
        }
    }
*/

module.exports = class API {

	constructor(app, classes, opts={}){

        this.opts = Object.assign({
            root: ''
        }, opts)
		
        this.app = app
		this._classes = new Map()

		classes.forEach(Class=>{
            
            if( !Class.name )
                return console.warn('! API: not a valid class')

			if( !Class.api || !Class.api.routes )
                return console.warn('! API: class must specify `api.routes`')

			Class.api.routes.forEach(this.setupRoute.bind(this, Class))
		})		
	}

	setupRoute(Class, route){

		let [method, path, ...args] = route

        args = Array.from(args)

        let fnName = args.pop()

        if( !Class.prototype[fnName] ){
            return console.warn(`! API: ${Class.name}.${fnName} does not exist`)
        }

        args.push(async (req, res)=>{

            if( !req.isAuthenticated() )
                return res.status(401).send({error: 'permission denied'})

			let c = this.init(Class)

			try{
				let resp = await c[fnName].call(c, req)

                res.send(resp)

			}catch(err){
                console.log(err.message)
                res.status(500)
                res.send({
                    error: err.message,
                    type: err.name,
                    stack: err.stack
                })
			}
		})

        if( Class.api.root )
            path = Class.api.root + path

        if( this.opts.root )
            path = this.opts.root + path
        
        args.unshift(path)

		this.app[method](...args)
	}

	init(Class){

        // only init the class once, then reuse
		if( !this._classes.get(Class.name) )
			this._classes.set( Class.name, new Class() )

		return this._classes.get(Class.name)
	}
}