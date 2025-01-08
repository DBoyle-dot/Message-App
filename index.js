const express = require('express')
const http = require('http')
const app = express();
const port = 25565;
const server = http.createServer(app); 
const { Server } = require('socket.io'); 
const io = new Server(server);
const bodyParser = require('body-parser')
const path = require("path")
const db = require("./database.js");
const crypto = require('crypto');
const id = cookie()


app.use(bodyParser.json())
app.use(express.static(__dirname))

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get("/message", (_req, res) => { 
    res.sendFile(path.join(__dirname, "../message/index.html")); 
});

try {
    
    app.post("/api/signup", async (req, res) => {
        const { input } = req.body;
        const data = await hello(input);
        console.log(data)
        res.json({ data });
        async function hello(input) {
            try {
                
                db.run(`INSERT INTO users (name, id) VALUES ('${input}', '${id}')`)
                
                return { data: 'successfully saved Data', id: `${id}`}
            } catch(error) {
                return {error: `${error}`}
            }
        }
    })
    
    app.post("/message/", async (req, res) => {
        const { cookie } = req.body;
        let id = cookie
        console.log(id)
        id = cookie.substring(cookie.length - 100)
        console.log(id)
        const data = await hiya(id)
        console.log(data)
        res.json(data)
        async function hiya(id) {
            try {

                const name = await new Promise((resolve, reject) => {
                    db.get('SELECT name FROM users WHERE id = ?', [id], (error, row) => { 
                        if (error) { 
                            reject(error); 
                        } else { 
                            resolve(row ? row.name : null);
                         }
                         });
                })
                console.log(name)
                return { name: `${name}` }
            } catch (error) {
                console.log(error) 
            }
        }
    })

    app.post("/api/send/", async (req, res) => {
        const { message, cookie } = req.body;
        const id = cookie.substring(cookie.length - 100);
        const data = await postMsg(message, id)
        console.log(data)
        res.json({ data });

        async function postMsg(message, id) {
            try {
                db.run(`INSERT INTO messages (message, id) VALUES ('${message}', '${id}')`)

                return { data: 'successfully saved Data', id: `${id}`, message: `${message}` };
            } catch (error) {
                
            }
        }
    })

    app.get("/api/getmsgs", async (req, res) => {
        const data = await getMsgs()
        res.json(data)
        async function getMsgs() { 
            try { 
                const messages = await new Promise((resolve, reject) => { 
                    db.all('SELECT * FROM messages', (error, rows) => { 
                        if (error) return reject(error); 
                        resolve(rows); 
                    }); 
                }); 
                return messages; 
            } catch (error) { 
                console.error(error); throw error; 
            }
        }
    })

    app.post("/api/login/", async (req,res) => {
        const { name } =  req.body
        const data = await checkLogin(name)
        console.log(data)
        res.json({ data })

        async function checkLogin(name) {
            const userInfo = await new Promise((resolve, reject) => {
                db.get('SELECT name, id FROM users WHERE name = ?', [name], (error, row) => { 
                    if (error) { 
                        reject(error); 
                    } else { 
                        resolve(row ? [row.name, row.id ]: null
                        );
                     }
                });
            })
            const rowName = userInfo[0];
            const rowId = userInfo[1]
            console.log(rowName);
            console.log(rowId)
            return {name: `${rowName}`, id: `${rowId}`}
            
        }
    })

} catch (error) {
    console.log(error)
}

function cookie() {
    return crypto.randomBytes(50).toString('hex')
}


server.listen(port, () => { 
    console.log(`listening on port ${port}, http://dotgames.online`); 
}); 

io.on('connection', (socket) => { 
    console.log('a user connected'); 
    socket.on('disconnect', () => { 
        console.log('user disconnected'); 
    });
})