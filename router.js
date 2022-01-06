const express = require('express');
const router =  express.Router();


router.get('/', (req, res)=>{
    res.render('miprimer.ejs');
})




module.exports = router;