const auth = ((req,res,next)=>{
    let token = 123
    if(token===123){
        next()
    }else{
        res.status(401).send('poda kalla')
    }
})

module.exports={
    auth
}
