import express from 'express'
import handlebars from 'express-handlebars'
import  __dirname  from './utils.js'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.router.js'

const app = express();

//Setvidor archivos estaticos:
app.use(express.static(`${__dirname}/public`))

//Motot de plantillas:
app.engine('handlebars', handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine', 'handlebars')

//Rpoutes:
app.use('/', viewsRouter)

const server = app.listen(8080, () => console.log('server running'))

//Socket io:
const socketServer = new Server(server)

const messages = []

socketServer.on('connection' , socket => {
    console.log('nuevo cliente conectado')

    socket.on('message', data => {
        messages.push(data)
        socketServer.emit('messageLogs', messages)
    })


    socket.on('authenticated', data => {
        socket.emit('messageLogs' , messages)
        socket.broadcast.emit('newUserConnected', data)
    })
})
