
const express = require('express')
const app = express()

const port = process.env.PORT || 5000
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyparser = require('body-parser');
const jsonparser = bodyparser.json();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const imageDataURI= require('image-data-uri')

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://abdi:abdi@cluster0.7q4c9.mongodb.net/db_project?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  collection = client.db("db_project").collection("images");
  // perform actions on the collection object
});

app.use(express.static('public'))

const insert_paint = async (name, date,img_url) => {
  const data = {
    name: name,
    date: date,
    img_url: img_url
  };
  const result = await collection.insertOne(data);
  console.log(`id: ${result.insertedId}`);
}

app.post('/save', jsonparser, (req, res) => {
  insert_paint(req.body.name, req.body.date, req.body.img_url)
  const filename = (req.body.date+" "+req.body.name )
  filePath="./uploads/"+filename+".jpeg"
  imageDataURI.outputFile(req.body.img_url, filePath).then(res => console.log(res))

})
app.get('/imagesaved', jsonparser, async (req, res) => {

  const lines = await collection.find({}).toArray()
  let alldata = [];
  for (let i=0; i<lines.length; i++) {
    data = {
      img_url: lines[i].img_url,
      name: lines[i].name,
      date: lines[i].date,
      id: lines[i]._id
    }
    
    alldata.push(data)
  }
  res.send(
    alldata.map((data, i )=>
      `<div class='cont'>
        <div class='cont'>
          <p> owner: ${data.name} </p>
          <p> date of realisation: ${data.date}</p>
          <button onclick="display${i}()">display the image</button>
        </div>
        <img id='${data.id}' src='${data.img_url}'/><br>
      </div>
      <script>
        function display${i}(){
          windows = window.open("about:blank")
          const draw = document.getElementById('${data.id}').src
          windows.document.write('<img src="'+draw+'"/>')
        }
      </script>
      <style>
        .cont{
          margin: 0 auto;
          border: solid black 4px;
        }
        *{
        text-align: center;
        font-family: "Arial", "arial", "cursive";
        }
      </style>
    `).join('')
  )
})

//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  console.log('New connection')
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs)
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs)
  })
})



http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})