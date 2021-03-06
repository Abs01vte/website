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

    if(data == ""){
      lines.push({line:"<br>"});
    } else{
      lines.push({line:data});
    }
  });

  return lines;
}
// App config

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', "./views");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/writing/:writing', (req, res, next) => {
  let writing = req.params.writing.toLowerCase();
  res.status(200).render('writing',{text:getTextLines("writing/"+writing)});
});
app.get('/writing', (req,res,next)=>{
  res.status(200).render('indexWriting');
});
app.get('/sales', (req,res,next)=>{
  res.status(200).render('bookSales');
});
app.get('/art/:art', (req,res,next)=>{
  let art = req.params.art.toLowerCase();
  let artPath = path.join("art/", art)
  if(fs.existsSync(artPath)){
    res.status(200).render(
      'art',
      {art:fs.readFileSync(artPath, "utf8")}
    );
  } else{
    res.status(404).render('404');
  }

});
app.get('/art', (req,res,next)=>{
  res.status(200).render('indexArt');
});

// index.html should be before 404 and after everything else


app.get('/', (req, res, next) => {
  res.status(200).render('index',{
    writtenword:fs.readFileSync('writing/writtenword.html')
  });
});

// 404 is last.
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log('== Server is listening on port', port);
});
