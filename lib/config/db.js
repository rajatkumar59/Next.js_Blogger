import mongoose from "mongoose";

export const ConnectDB = async ()=>{
    await mongoose.connect('mongodb+srv://NextBlog:JcOaUqrKj3afGSaF@cluster0.wawxleq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

    console.log("DB Connecnted");
}