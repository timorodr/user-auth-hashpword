const express = require("express")
const path = require("path")
const bcrypt = require("bcrypt")
const collection = require("./config")
require("dotenv").config()


const app = express()
// Convert data into JSON format
app.use(express.json())

app.use(express.urlencoded({extended: false}))

// use EJS as the views engine
app.set('view engine', 'ejs')
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // check if user already exists
    const existingUser = await collection.findOne({name: data.name})
    if(existingUser) {
        res.send("User already exists. Please enter another username")
    } else {
        // has the password using bcyrpt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)

        data.password = hashedPassword // Replace the hash password with original password

        const userdata = await collection.insertMany(data)
        console.log(userdata)
    }
    res.redirect("/")
})

// Login user
app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username})
        if(!check) {
            res.send("Username cannot be found")
        }

        //compare the hash password from the database with the plain text
        const passwordMatch = await bcrypt.compare(req.body.password, check.password)
        if(passwordMatch) {
            res.render("home")
        } else {
            res.send("Password incorrect")
        }
    } catch {
        res.send("Wrong login information")
    }
})


const port = 3000
app.listen(port, () => {
    console.log(`Is this thing on at Port: ${port}`)
})