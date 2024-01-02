const mongoose = require("mongoose")
const connect = mongoose.connect(process.env.DATABASE_URL) // copy connection string from database three dot menu

connect.then(() => {
    console.log("Database successfully connected")
})
.catch(() => {
    console.log("Database cannot be connected")
})

// Create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


// Collection - model
const collection = new mongoose.model("Users", LoginSchema)

module.exports = collection