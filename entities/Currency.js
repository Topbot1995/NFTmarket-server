var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Currency", // Will use table name `category` as default behaviour.
    tableName: "currencies", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        address: {
            type: "varchar",
            nullable:false
        },   
        swapRate: {
            type: "int",
            nullable:false
        },      
        symbol: {
            type: "varchar",
            nullable:false
        },
        name: {
            type: "varchar",            
        },
        status: {
            type: "tinyint" // 0:normal 1:deprecated
        }
    }
});