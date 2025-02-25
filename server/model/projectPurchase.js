import mongoose from "mongoose"

const projectPurchaseSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    paymentId:{
        type:String,
        required:true
    },
    
},{timestamps:true})

 const ProjectPurchase=mongoose.model("ProjectPurchase",projectPurchaseSchema)

 export default ProjectPurchase