const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: 'root',
    password: "",
    database: 'nftmarket_db',
    synchronize: true,
    entities: [
        require("../entities/User"),
        require("../entities/Item"),
        require("../entities/Currency"),
    ]
});

module.exports = AppDataSource;