const mongoose = require('mongoose')


const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema


const usersModel = new schema({
    username: { type: String },
    name: { type: String },
    email: { type: String },
    isVrefyed: { type: Boolean, default: false },
    password: { type: String },
    phone: { type: Number },
    isAdmin: { type: Boolean, default: false },

}, { timestamps: true, toJSON: { virtuals: true } })

usersModel.plugin(mongoosePaginate)


usersModel.virtual('profile', {
    ref: 'profile',
    localField: '_id',
    foreignField: 'user',
    justOne:true
})

usersModel.virtual('posts', {
    ref: 'posts',
    localField: '_id',
    foreignField: 'author',
})

module.exports = mongoose.model('users', usersModel)