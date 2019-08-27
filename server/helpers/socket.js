
const socketio = require('socket.io');




var socketUtility = (app) => {
    const socketSession = socketio.listen(app)
    socketSession.on('connection', (socket) => {
        console.log("A new user just connected");
      
        socket.on('join', (session) => {
          console.log(session)
          socket.join(session);
          socket['session-identity'] = session;
    
          socketSession.to(session).emit('updateClients', socketSession.sockets.adapter.rooms[session].sockets);
        })
        
        socket.on('newFile', function(event) {
            console.log('NEW FILES', event.data)
            socket.to(event.session).emit('updateFiles', event.data);
            
        })
    
        socket.on('newText', function(event) {
            console.log('NEW TEXT', event)
            socket.to(event.session).emit('updateText', event.data);
            
        })
    
    
        socket.on('disconnect', () => {
            const socketFrom = socket['session-identity'];
            // console.log(socketSession.sockets.adapter.rooms[socketFrom])
            if(socketSession.sockets.adapter.rooms[socketFrom] === undefined){
                console.log('no sockets to broadcast')
                return;
            }
    
            socketSession.to(socketFrom).emit('updateClients', socketSession.sockets.adapter.rooms[socketFrom].sockets);
            delete socket['session-identity'];
            console.log('done')
        });
    });

}


module.exports = {
    socketUtility: socketUtility
}