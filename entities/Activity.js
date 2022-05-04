var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Activity", // Will use table name `category` as default behaviour.
    tableName: "activities", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },        
        user_id: {
            type: "int",
            nullable:false
        },        
        action: {
            type: "enum",
            nullable:false
        },                
        created_at: {
            type: "datetime",            
        },        
    }
});