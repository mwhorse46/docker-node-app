module.exports = {
    apps : [{
        name: "server",
        script: "./server/index.js",
        instances: 1,
        exec_mode: 'fork',
        watch: [
            './server'
        ],
        ignore_watch: [
            "./**/*.git",
            "./**/*.md"
        ],
        autorestart: true,
        restart_delay: 1000,
        node_args: '--inspect=0.0.0.0',
        env: {
            "NODE_ENV": "development",
        },
        env_production : {
            "NODE_ENV": "production"
        }
    }]
}