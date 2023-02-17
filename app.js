const express = require("express");
const consolidate = require("consolidate");
const path = require("path");
const { Server } = require("http");
const app = express();
const port = process.env.PORT || 5100;
app.engine("html", consolidate.swig);
app.set("view engine", "html")
app.set("views", __dirname + "/views");


// middleware to read JSON request body
app.use(express.json());

// middleware to formdata/urlencoded request body
app.use(
    express.urlencoded({
    extended: true,
    })
);

let database = [
    {  id: 1,
       body: "My small content", 
       author: "nelson", 
       country: "Nigeria", 
       date: Date.now() },
];


// app get index routes
app.get("/", (req, res) => {
    try {
        return res.status(200).json({
            message: "welcome to blog api",
        });
    } catch(err) {
        console.log("error", err.message);
    }
    
});

// app.get("/user", (req, res) => {
//     return res.json({
//             author: "Macnelson D",
//             date: 'today',
//     });
// });

// Get all blog posts
app.get("/blog", (req, res) => {
    return res.status(200).json({
            message: "blog posts",
            data: database,
    });
});

// CREATE BLOG POST
app.post("/blog", (req, res) => {
    // console.log(req.body);
    // console.log(req.file, req.files);
    const dataWithId = { id: database.length + 1, ...req.body };
    database.push(dataWithId);
    return res.status(200).json({
        message: "blog created",
        data: req.body,
    });
});

// Get Single blog post by Id
app.get("/blog/:id", (req, res) => {
    console.log(req.params);
    let blog = database.find((data) => data.id === Number(req.params.id));
    if (blog) {
        return res.status(200).json({
            message: "blog post found",
            data:blog,
        });
    }
    return res.status(404).json({message: "no blog post with that id"});
});

//update single blog post by id
app.put("/blog/:id", (req, res) => {
    let oldDataIndex = database.findIndex(
      (data) => data.id === Number(req.params.id)
    );
  
    console.log(oldDataIndex);
  
    if (oldDataIndex >= 0) {
      let oldData = database[oldDataIndex];
      let newData = { id: oldData.id, ...req.body };
      database[oldDataIndex] = newData;
      return res.status(200).json({
        message: "post updated",
        data: oldData,
      });
    }
    return res.status(400).json({
      message: "post not found",
    });
  });

  // Delete blog posts
  app.delete("/blog/:id", (req, res) => {
    let index = database.findIndex((data) => data.id === Number(req.params.id));
  
    if (index >= 0) {
      database = database.slice(0, index);
      return res.status(204).json({
        message: " post deleted",
      });
    }
    return res.status(404).json({
      message: "post not found",
    });
  });


// start the server
app.listen(port, () => { 
    console.log(`server running on port ${port}`);
});
