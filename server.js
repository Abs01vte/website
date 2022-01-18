const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;
var exphbs = require('express-handlebars');
function getTextLines(path){
  let lines = [];
  const contents = fs.readFileSync(path,"utf8");
  contents.split(/\r?\n/).forEach((data, i) => {
    lines.push({line:data});
  });

  return lines;
}
// App config

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', "./views");

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// index.html should be before 404 and after everything else


app.get('/', (req, res, next) => {
  res.status(200).render('index');
});
app.get('/:writing', (req, res, next) => {
  let writing = req.params.writing.toLowerCase();
  console.log(writing);
  res.status(200).render('writings',{text:getTextLines(writing)});
}
);
// 404 is last.
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log('== Server is listening on port', port);
});
