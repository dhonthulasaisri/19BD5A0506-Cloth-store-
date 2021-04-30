const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;
 MongoClient.connect('mongodb://localhost:27017/ClothStore', (err,database) =>{
 if (err) return console.log(err)
 db = database.db('ClothStore')
 app.listen(5000, () => {
     console.log('Listening at port number 5000')
 }) 
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home page

app.get('/' , (req, res) => {
    db.collection('fashion').find().toArray((err,result) => {
        if(err) return console.log(err)
        res.render('index',{data: result})
    })

})
app.get('/addproduct', (req, res)=>{
    res.render('addproduct.ejs')
})

app.get('/updateproduct', (req, res)=>{
    res.render('updateproduct.ejs')
})

app.get('/deleteproduct', (req, res)=>{
    res.render('deleteproduct.ejs')
})

app.post("/AddData", (req, res) => {
    console.log(req.body);
    db.collection("fashion").save(req.body, (err, result) => {
       if (err) return console.log(err)
       console.log(req.body)
       res.redirect("/");
    });
 });
 
 app.post('/update',(req,res)=>{
    db.collection('fashion').find().toArray((err,result)=>{
    if(err) return console.log(err)
    for(var i=0;i<result.length;i++)
    {
        if(result[i].pid==req.body.pid)
        {
            s=result[i].stock
            //s1=result[i].sp
            break
        }
    }
    db.collection('fashion').findOneAndUpdate({pid:req.body.pid},{
        $set:{stock: parseInt(s) + parseInt(req.body.stock)}},{sort:{_id:-1}},
        (err,result)=>{
            if(err) return res.send(err)
            console.log(req.body.pid+ ' stock updated')
            res.redirect('/')
        })

    })
})





 app.post("/delete", (req, res) => {
    console.log("Deleting: ");
    var myquery = { pid: req.body.pid };
    db.collection("fashion").deleteOne(myquery, function (err, obj) {
       if (err) throw err;
       console.log("1 document deleted");
       res.redirect("/");
 
    });
 
 });
