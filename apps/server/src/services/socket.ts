import { Server } from "socket.io"
import { Redis } from "ioredis";



const pub=new Redis({
    host:"redis-14245523-harshitkaundalece-62a8.a.aivencloud.com",
    port:12365,
    username:"default",
    password:"AVNS_Rf-ZK5BggynZ6JXVjr2",
})
const sub=new Redis({
    host:"redis-14245523-harshitkaundalece-62a8.a.aivencloud.com",
    port:12365,
    username:"default",
    password:"AVNS_Rf-ZK5BggynZ6JXVjr2",
});




class Socketservice{
    private _io : Server;

    constructor(){
        console.log("init Socket service");
        this._io = new Server({
            cors:{
                allowedHeaders:["*"],
                origin:"*",
            }
        });
        sub.subscribe("MESSAGES");
    }

    public initListeners() {
        const io=this.io;
        console.log("initialize listeners ...");
        io.on("connect", (socket) =>{
            console.log("new socket connected", socket.id);

            socket.on("event:message", async({message}:{message:String}) =>{
                console.log("new message recived",message);

                //publish message to redis
                await pub.publish("MESSAGES", JSON.stringify({message}));
            });
        });

        sub.on('message',(channel,message) =>{
            if(channel=="MESSAGES"){
                io.emit("message" ,{message})
            }
        });
    }
    get io(){
        return this._io;
    }
}

export default Socketservice;