var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User", // Will use table name `category` as default behaviour.
    tableName: "users", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        email: {
            type: "varchar",
            nullable:false
        },
        fullname: {
            type: "varchar",
            nullable:false
        },
        nickname: {
            type: "varchar",
            nullable:false
        },
        password: {
            type: "varchar",
            nullable:false
        },
        wallet_addr: {
            type: "varchar",
            nullable:false
        },
        refresh_token: {
            type: "varchar",            
        },
        updated_at: {
            type: "datetime",
        },
        created_at: {
            type: "datetime",            
        },
        status: {
            type: "tinyint"
        }
    }
});