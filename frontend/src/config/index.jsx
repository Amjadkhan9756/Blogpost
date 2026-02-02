const {default:axios}=require("axios");



const clintServer=axios.create({

    baseURL:"http://localhost:8080"
    
})