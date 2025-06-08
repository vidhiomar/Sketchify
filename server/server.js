import express from "express"
import {fileURLToPath} from 'url'
import path from 'path'

const app = express()
app.use(cors())
app.use((express.json))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination: "./uploads" , 
    filename : function (req , file , cb ){
        cb(null , Date.now() + "-" + file.originalname);
    },
});

const upload = multer({storage:storage});




app.listen(3000 , ()=>{
    console.log("server runing!")
})