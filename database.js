const sqlite3 = require('sqlite3').verbose()

try {
    
     const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error(err.message);
        console.log("connection successful")
    })
    const name = 'jeffrey'
        
    module.exports =  db 
} catch (error) {
    console.log(error)
}

    //db.run("CREATE TABLE users(first_name, last_name, username, password, email, id)")
    
