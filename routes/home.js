// Express
const express = require('express');
const config = require("config");

const router = express.Router();

const appName = config.get("name");

router.get('/', (req,res) => {
    res.send(`Welcome to ${appName} server`);
});

module.exports = router;