const express = require("express");
const { createError } = require("./error");
const morgan = require("morgan");
var cors = require("cors");
require("dotenv").config
const connectDB = require("./DB_Connection/db")
const path = require("path")

const app = express()

//routes
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes");
const Order = require("./models/OrderModel");



//middlewares
app.use(morgan("dev"));
app.use(express.json())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

//routes
app.use("/api/chats", chatRoutes)
app.use("/api/messages", messageRoutes);


//-----------------------deployment---------------//
const __dirname1 = path.resolve()
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
  })
  
} else {
  app.get("/",(req, res)=> {
    res.send("API running successfully")
  })
}


//-----------------------deployment---------------//



const PORT = process.env.PORT || 8081

//unavailable routes
app.use("*", (req, res, next) => {
  return next(createError(400, "route not found"));
});

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status: status,
    message,
  });
});

const server = app.listen(PORT, () => {
    console.log("server running..")
    connectDB();
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin:"http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")
    socket.on('setup',(username) => {
        socket.join(username)
        socket.emit("connected")
    })
    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User joined: " + room)
    })
    socket.on("new message",async (newMessageReceived) => {
        let selectedNumber = newMessageReceived.content;

      let date = new Date().toJSON();
        let content = [];

     
      if (selectedNumber == 1) {
        content = [
          "Here is our menu",
          "Select 2 to choose jollof rice : N2000",
          "Select 3 to choose chicken : N4000",
          "Select 4 to choose fried rice : N2500",
          "Select 5 to choose plantain : N500",
          "Select 8 to choose beef meat : N200",
          "Select 97 to see current order",
          "Select 98 to see order history",
          "Select 99 to checkout order",
          "Select 0 to cancel order",
        ];

        let order = new Order({
          user: newMessageReceived.sender,
          order: [],
          
        })
        await order.save()
        
      } else if (selectedNumber == 2) {
        content = ["Jollof rice added to your tray"];
        await Order.findOneAndUpdate(
          {
            user: newMessageReceived.sender,
            checkedOut: false, 
            status:"pending"
           
          },
          {
            $push: { order: "Jollof rice" },
          }
        );

        
      } else if (selectedNumber == 3) {
        content = ["chicken added to your tray"];
          await Order.findOneAndUpdate(
            {
              user: newMessageReceived.sender,
              checkedOut: false,
              status: "pending",
            },
            {
              $push: { order: "Chicken" },
            }
          );
      
      } else if (selectedNumber == 4) {
        content = ["Fried rice added to your tray"];
          await Order.findOneAndUpdate(
            {
              user: newMessageReceived.sender,
              checkedOut: false,
              status: "pending",
            },
            {
              $push: { order: "Fried rice" },
            }
          );
    
      } else if (selectedNumber == 5) {
        content = ["Plantain added to your tray"];
          await Order.findOneAndUpdate(
            {
              user: newMessageReceived.sender,
              checkedOut: false,
              status: "pending",
            },
            {
              $push: { order: "Plantain" },
            }
          );

     
      } else if (selectedNumber == 8) {
        content = ["Beef meat added to your tray"];
          await Order.findOneAndUpdate(
            {
              user: newMessageReceived.sender,
              checkedOut: false,
              status: "pending",
            },
            {
              $push: { order: "Beef meat" },
            }
          );
   
         
      } else if (selectedNumber == 99) {
        
       
         const order =  await Order.findOneAndUpdate(
             {
               user: newMessageReceived.sender,
               checkedOut: false,
             },
             {
               $set: { checkedOut: true },
             }
        );
        if (order) {
          content = ["order placed"];
        } else {
          content = ["No order to place"];
        }
         
       
      } else if (selectedNumber == 98) {
       
           const orders = await Order.find({
             user: newMessageReceived.sender,
             checkedOut: true,
          
           });
        if (orders.length > 0) {
             let newArray = ["Your orders are:"];
          orders.forEach(eachOrder => {
         
           content= newArray.concat(eachOrder.order)
           
          })
           
          
        } else {
          content = ["No order history"]
        }
      } else if (selectedNumber == 97) {
        const order =   await Order.findOne(
            {
              user: newMessageReceived.sender,
            checkedOut: true,
               status:"pending"
            },
          );
        if (!order) {
          content = ["You haven't made an order yet,please make an order"]
        } 
        else {
          content = order.order
        }
      } else if (selectedNumber == 0) {
      let cancelledOrder =  await Order.findOneAndUpdate(
          {
            user: newMessageReceived.sender,
            checkedOut: true,
            status: "pending",
          },
          {
            $set: { status: "cancelled" },
          }
        );
        if (cancelledOrder) {
          content = ["current Order cancelled"];
        } else {
          content = ["No order to cancel"];
        }
        
        
      } else {
        content = ["please select a valid number"];
      }
      const newServerMessage = {
        sender: "D&G Bot",
        chat: newMessageReceived.chat,
        content: content,
        createdAt: date,


      };
      socket.emit("message received", newServerMessage);
    })
      

  
})