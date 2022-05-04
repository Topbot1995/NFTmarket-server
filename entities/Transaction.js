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
        item_id: {
            type: "int",
            nullable:false
        },
        seller_id: {
            type: "int",
            nullable:false
        },
        buyer_id: {
            type: "int",
            nullable:false
        },        
        sold_price: {
            type: "float",
            nullable:false
        },                
        created_at: {
            type: "datetime",            
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
    }
});