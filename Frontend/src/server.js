const express = require('express');
const app = express();
const port = 3000;
var multer  =   require('multer');
var idUser="10Ab";
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, idUser+"-"+file.originalname );
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

 app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
}); 
app.use(express.static('code'));
app.use(express.static('images'))
app.use(express.static('uploads'))
app.listen(port, () => console.log(`listening on port ${port}!`));