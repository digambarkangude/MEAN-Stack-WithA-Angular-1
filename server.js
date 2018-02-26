const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const util = require('util');
const mongodb = require('mongodb');
const mongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const { Readable } = require('stream'); 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname+'/'))); 
var user_picture = '';
var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		datetimestamp = Date.now();
		user_picture = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
		cb(null, user_picture);
	}
});
var upload = multer({ //multer settings
	storage: storage
}).single('file');


app.get('/',(req, res)=>{
	res.sendFile(__dirname+'/index.html');
});


var db = '';

mongoClient.connect('mongodb://root:123456@localhost:27017/mean',(err, res)=>{
	if(err){
		console.log(err);
	}
	db = res;
	app.listen('3000',()=>{
		console.log('Server started on port 3000.');
	});

})

app.get('/list',(req, res)=>{
	db.collection("users").find().toArray((err, result)=>{
		if(err){
			console.log(err);
		}
		res.json(result);
	});
});

app.get('/getByID/:id',(req, res)=>{
	var uId = new mongodb.ObjectID(req.params.id);
	db.collection("users").findOne({_id:uId},(err, result)=>{
		if(err){
			console.log(err);
		}
		res.json(result);
		//console.log(util.inspect(result,{depth:1}));
	});
});

app.post('/insert',(req, res)=>{
	upload(req,res,function(err){
		var record = {};
		if(err){
			console.log('Error while uploading file: '+err);
			//console.log(util.inspect(res, {depth: null}));
		}else{
			record = {
				name: req.body.data.name,
				email: req.body.data.email,
				address: req.body.data.address,
				phone: req.body.data.phone,
				picture: req.file.filename,
				dob: req.body.data.dob
			};
			user_picture = '';
			console.log("RECORDS: "+record);
			db.collection("users").save(record,(err, result)=>{
				if(err){
					console.log(err)
				}
				res.redirect('/list');
			});
		}
	});
});

app.put('/edit/:id',(req, res)=>{
	var uId = new mongodb.ObjectID(req.params.id);
	upload(req,res,function(err){
		console.log(util.inspect(req.file,{depth:1}));
		var record = {};
		record = {
			name: req.body.data.name,
			email: req.body.data.email,
			address: req.body.data.address,
			phone: req.body.data.phone,
			picture: req.file.filename,
			dob: req.body.data.dob
		};
		user_picture = '';
		db.collection("users").findOneAndUpdate({_id:uId},{
			$set:record
		},{
			upsert: true,
		},(err, result)=>{
			if(err){
				console.log(err)
			}
			res.send('list');
		});
	});
});

app.delete('/delete/:id',(req, res)=>{
	var uId = new mongodb.ObjectID(req.params.id);
	db.collection("users").findOneAndDelete({_id:uId},(err, result)=>{
		if(err){
			console.log(err);
		}
		res.send('deleted');
	});
})

app.get('/video', function(req, res) {
	const path = 'videos/cars.mp4'
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	console.log(req.headers);

	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1]
		? parseInt(parts[1], 10)
		: fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(206, head)
		file.pipe(res)
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
});

app.get('/rnd', (req, res)=>{
	
const {Transform} = require('stream');
const UpperCaseTra = new Transform({
	transform(chunk, encoding, callback){
		this.push(chunk.toString.toUpperCase());
		callback();
	},
	read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));
    if (this.currentCharCode > 90) {
      this.push(null);
    }
  }
});
UpperCaseTra.currentCharCode = 65;
process.stdin.pipe(UpperCaseTra).pipe(process.stdout);

});