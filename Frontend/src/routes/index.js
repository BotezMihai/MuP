const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    console.log('Request for first page');
    res.render('firstpage');
});
router.get('/homepage',(req,res)=>{
    console.log("Homepage requested");
    res.render('homepage');
});
router.get('/myparties',(req,res)=>{
    console.log("My parties");
    res.render('myparties');
});

module.exports=router;