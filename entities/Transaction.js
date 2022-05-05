const User = require("./User");
const Item = require("./Item");
var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Transaction", // Will use table name `category` as default behaviour.
    tableName: "transactions", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        sold_price: {
            type: "float",
            nullable: false
        },
        created_at: {
            type: "datetime",
        },
    },
    relations: {
        item: {
            type: 'many-to-one',
            target: 'Item',
            joinColumn: true,
        },
        seller: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
        },
        buyer: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
        },
    },

});