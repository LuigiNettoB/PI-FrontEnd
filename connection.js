//mongodb+srv://pedronoelialamov:YCONLNiEQOOA5a64@cluster0.imjcz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://${dbUser}:${dbPassword}@matematicametro.lf0ks.mongodb.net/matematicametro?retryWrites=true&w=majority&appName=MatematicaMetro
const mongoose = require("mongoose")

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

const connect = () => {
    mongoose.connect(`mongodb+srv://pedronoelialamov:YCONLNiEQOOA5a64@cluster0.imjcz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

    const connection = mongoose.connection

    connection.on("error", () => {
        console.error("Erro ao conectar com o MongoDB")
    })

    connection.on("open", () => {
        console.log("Conectado ao MongoDB com Sucesso!")
    })
}

connect()

module.exports = mongoose