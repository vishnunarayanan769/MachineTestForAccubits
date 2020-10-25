const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}
/*Connecting to MONGO DB */
module.exports.connect=(done)=>{
    const url='mongodb://localhost:27017'
    const dbname='bucket'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
    })

    done()
}
/* Returning the status, DB Connected or NOT */
module.exports.get=()=>{
    return state.db
}