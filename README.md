Node App
================

A starting point for node.js based apps. Uses Docker to setup a node, mysql, and redis server. Webpack is used to bundle the client JS.

![preview](./preview.png)

## Getting Started on Development

#### Check the settings in `.env`
Change the `SESSION_SECRET` and update the app and mysql ports if they are going to conflict with existing services

#### Start the app containers 
A node server, mysql database, and redis service will be started. The node server will auto restart after crashing or when changes are made to `/app/server`

```bash
$ cd /this/dir
$ docker-compose up
```

#### Start the developing
[Webpack](https://webpack.js.org/) will be used to watch the files in `/app/client` and rebuild them.

```bash
$ cd app
$ npm run dev
```

> The webpack bundler should be run from within the docker container.
> The `dev` script is setup to do that

## Commands
Some commands for developing

- `npm run cd-server` - "change directory" to the node server
- `npm run install` - install missing/new JS dependencies
- `npm run dev` - watch for client changes and rebuild

## Dependency notes
`jQuery` is imported by Backbone.js even though its not a hard dependency. Because of this, 
webpack complains if we dont have jQuery. To get around this, `client/jquery.js` was created
that only includes the absolute minimum

## Code Report
Keeping the client code slim and fast is important. An analyzer has been setup as part
of the initial webpack build so we can analyze what code oversized.

It can be accessed from the root: `localhost:8080/bundle-report.html`

