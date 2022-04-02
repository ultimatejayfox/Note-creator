const app =  express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//getting request
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', function(err, contents) {
    var words = JSON.parse(contents);
    res.send(words);
  });
});


//posting request
app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json',(err, data) => {
    // Check for error
    if (err) throw err;
    // Handle data gathering for json update
    let json = JSON.parse(data);
    let note = {
      title: req.body.title,
      text: req.body.text,
      id: uuidv1()
    }
    json.push(note);

    fs.writeFile('db/db.json', JSON.stringify(json, null, 2), (err) => {
      // Check for error
      if (err) throw err;
      res.send('200');
    });
  });
});



app.delete('/api/notes/:id', (req, res) => {

  fs.readFile('db/db.json',(err, data) => {
    if (err) throw err;
    let deleteId = req.params.id;
    let json = JSON.parse(data);
    json.forEach((item, i) =>{
      if (item.id.includes(deleteId)){ 
        json.splice(i, 1);       
      }
    });

    fs.writeFile('db/db.json', JSON.stringify(json, null, 2), (err) => {
      // Check for error
      if (err) throw err;
      res.send('200');
    });
  });

})


//routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


//static folder
app.use(express.static(path.join(__dirname, 'public')));


const PORT = process.env.PORT || 8000;
app.listen(PORT);