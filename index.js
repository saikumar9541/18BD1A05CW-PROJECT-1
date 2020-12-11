const express= require('express');
const app=express();
let server=require('./server');
let middleware=require('./middleware');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
const url='mongodb://localhost:27017/';
const dbname='hospitalmanagementsystem';
let db;
MongoClient.connect(url,{ useUnifiedTopology: true },(err,client)=>{
    assert.equal(null,err);
    db=client.db(dbname);
    console.log(`connected to database: ${url}`);
    console.log(`Database : ${dbname}`);
});
app.get('/hospitaldetails',middleware.checkToken,(req,res)=>
{
    console.log("fetching data from database");
    var data=db.collection('hospital').find().toArray().then(result =>res.json(result));
});
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("fetching ventilator details");
    var ventilatordetails=db.collection('ventilator1').find().toArray().then(result=>res.json(result));
});
app.post('/searcheventbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var data=db.collection('ventilator1').find({'status':status}).toArray().then(result=>res.json(result));
});
app.post('/searcheventbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('ventilator1').find({"name":new RegExp(name,'i')}).toArray().then(result =>res.json(result));
});
app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorid;
    console.log(myquery);
    var myquery1={ventilatorid:myquery};
    db.collection('ventilator1').deleteOne(myquery1,function(err,obj){
        if(err) throw err;
        res.json("1 document deleted");
    });
});
app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
        var hid=req.body.hid;
        var ventilatorid=req.body.ventilatorid;
        var status=req.body.status;
        var name=req.body.name;
        var item={
            hid:hid,ventilatorid:ventilatorid,status:status,name:name
        };
        db.collection('ventilator1').insertOne(item,function(err,result){
            res.json('item is inserted');
        });

});
app.put('/updateventilatordetails',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorid:req.body.ventilatorid};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection('ventilator1').updateOne(ventid,newvalues,function(err,result){
        res.json("1 document updated");
        if(err) throw err;
    });
});
app.listen(4000,(err,result)=>{
    console.log(`server is listening`);
});