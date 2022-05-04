const User = require("../entities/User");
var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Item", // Will use table name `category` as default behaviour.
    tableName: "items", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        collecton: {
            type: "varchar",
            nullable: false
        },
        nft_id: {
            type: "int",
            nullable: false
        },
        price: {
            type: "float",
            nullable: false
        },
        updated_at: {
            type: "datetime",
        },
        created_at: {
            type: "datetime",
        },
        status: {
            type: "tinyint" // 0:unsold 1:sold
        }
    },
    relations: {
        creator: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
        },
        currency: {
            type: 'many-to-one',
            target: 'Currency',
            joinColumn: true,
        },
        owner: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
        },
    },
});