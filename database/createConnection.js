const AppDataSource = require("./config");
const createConnection = async () => {
    await AppDataSource.initialize()
        .then((connection) => {           

            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
}

module.exports = createConnection;