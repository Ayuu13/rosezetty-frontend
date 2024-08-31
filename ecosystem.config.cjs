module.exports = {
    apps: [{
        name: "client",
        script: "npm run preview",
        error_file: "./pm2-error.log",
        out_file: "./pm2-out.log",
    }]
}
