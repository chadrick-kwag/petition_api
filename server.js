var express = require('express'),
  app = express(),
  port = 3001;

var bodyparser = require('body-parser')


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.all('/*', function(req, res, next) {
    console.log(req)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    
    next();
  });

app.listen(port);

var MongoClient = require('mongodb').MongoClient;

var petitiondb;

console.log("debug1")

MongoClient.connect("mongodb://localhost:27017",function(err,db){
    if(!err){
        console.log("we are connected")
        petitiondb = db.db("petition")
    }
    else{
        console.log("mongo client connection error")
        process.exit(1)
    }
})

console.log("debug2")


// app.get('/',(req,res)=>{
//     res.send("what2")
// })

app.post('/petition',(req,res)=>{
    console.log(req.body)
    var jsonbody = req.body
    console.log("========")

    console.log('req jsonbody',jsonbody)

    if(jsonbody.petition_num == null){
        res.json({
            result:0
        })
        return
    }

    var start_dt = jsonbody.start_dt
    var end_dt = jsonbody.end_dt

    if( !start_dt  || !end_dt){
        console.log("start_dt or end_dt is null")
        res.json({
            result:0
        })
        return
    }

    console.log(start_dt, end_dt)

    var query = {petition_num : Number(jsonbody.petition_num), datetime: {
        $gte: new Date(start_dt), 
        $lt: new Date(end_dt)
    }}

    var projection = {
        fields:{
            _id : 0,
            
            datetime: 1,
            petition_count: 1
        }
        
    }
    console.log(query)

    petitiondb.collection('petition_count').find(query,projection).toArray( (err,result)=>{
        if(err){
            res.json({
                result:0
            })
            throw err
            return
        }



        console.log(result)




        res.json({
            result:1,
            data: result

        })
    })
    
})








