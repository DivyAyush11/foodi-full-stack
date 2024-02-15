const verifyToken = require("../middleware/verifyToken");
const router = require("./menuRoutes");


router.get('/',verifyToken,async (req,res)=>{
    const email = req.query.email;
    const query = {email:email}
    try
    {
        const decodedEmail = req.decoded.email;
        if(email !== decodedEmail)
        {
            res.status(403).json({message:"Forbiden Access"})
        }
        const result = await Payment.find(query).sort({createdAt: -1}).exec();
        res.status(200).json(result);
    }
    catch(error)
    {
        res.status(404).json({message:error.message});
    }
});

// Get All payments
router.get('/all',async(req,res)=>{
    try{
        const payments = Payment.find({}).sort({createdAt: -1}).exec();
        res.status(200).json(payments);

    }catch(error){
        res.status(404).json({message: error.message});
    }
})

// confirm payments status

router.patch('/:id',async(req,res)=>{
    const payId = req.params.id;
    const {status} = req.body;

    try{
        const updateStatus = await Payment.findByIdAndUpdate(payId,{status:"Confirmed"},{new:true, runValidators:true})
        if(!updateStatus){
            return res.status(404).json({message:"Payment Not Found"})
        }
        res.status(200).json(updateStatus)

    }catch(error){
        res.status(404).json({message:error.message})
    }
})


module.exports = router;