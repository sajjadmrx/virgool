const express = require('express');
const mongoose = require('mongoose')
const chalk = require('chalk')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
var methodOverride = require('method-override')
const validator = require('express-validator');
const passport = require('passport')


const config = require('../config');
const Helper = require('./helper');
const userModel = require('./model/users')
require('./model/postes')
const app = express()


module.exports = class Application {

    constructor() {
        this.setupExpress();
        this.setupMongoose();
        this.setConfig();
        this.setRoutes();
    }

    setupExpress() {
        app.listen(process.env.PORT)
    }

    async setupMongoose() {
        try {
            await mongoose.connect(config.database.url, { ...config.database.setting })
            console.log(chalk.bgYellowBright.bgRedBright('Starting Server...', process.env.PORT));
        } catch (error) {
            console.log(error);
        }
    }

    setConfig() {
        require('./passport/passport-local')
        require('./passport/passport-google')
        app.use(express.static(config.layout.public_dir))
        app.set('view engine', config.layout.view_engine)
        app.set('views', config.layout.view_dir)
        app.use(config.layout.ejs.expressLayouts)
        app.set("layout extractScripts", true)
        app.set("layout extractStyles", true)
        app.set('layout', 'home/master');

        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.use(session({ ...config.session }))
        app.use(cookieParser('mysecretkey'));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash())
        app.use(methodOverride('_method'))

        app.use((req, res, next) => {
            res.locals = new Helper(req, res).getObject();
            next()
        })
        app.use(async (req, res, next) => {
            const user = await userModel.findById(req.user?.id, {}, { populate: 'profile' })

            if (!user)
                return next();
            else {
                await user.populate('posts').execPopulate();
                res.locals.user = user

                next()
            }
        })

    }

    setRoutes() {
        app.use('/api', require('./routes/api'))
        app.use(require('./routes/web'))
    }
}