const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;
var exphbs = require('express-handlebars');
function getTextLines(path){
  let lines = "";
  const contents = fs.readFileSync(path,"utf8");
  contents.split(/\r?\n/).forEach((data, i) => {

    if(data == ""){
      //lines.push({line:"<br>"});
	lines += "<br><br>";
    } else{
      //lines.push({line:data});
	lines += "<br>" + data;
    }
  });

  return lines;
}
// App config

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', "./views");
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/views/writing')));

app.get('/writing/:writing', (req, res) => {
  let writing = req.params.writing.toLowerCase();
let text = getTextLines("writing/"+writing);
  res.status(200).render('writing',{content:text});
console.log(text);
    //res.sendFile(__dirname+'/writing/'+writing+'.html');
});
app.get('/writing', (req,res)=>{
//let writing = req.params.writing.toLowerCase();
let list = getTextLines("views/indexWriting.html");
  res.status(200).render('writing',{content:list});
//res.sendFile(path.join(__dirname+'/public/indexWriting.html'));

});
app.get('/sales', (req,res)=>{
  let books = getTextLines("views/bookSales.html");
    res.status(200).render('bookSales',{content:books});
});

app.get('/art/:art', (req,res)=>{
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
app.get('/about', (req,res)=>{
	res.status(200).render('about', {
        content: "Hello and welcome! I am a for-fun writer and poet located in Colorado, USA. <br>Everything about me is stored in my writings, leaving little for want of words.<br>Look for me by my pennames: <b>Earven MacDiarmada</b> for poetry, and <b>Mike Hart</b> for my novels."});
});
app.get('/', (req, res, next) => {
  res.status(200).render('index');
});


// index.html should be before 404 and after everything else



// 404 is last.
app.get('*', (req, res) => {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log('== Server is listening on port', port);
});
