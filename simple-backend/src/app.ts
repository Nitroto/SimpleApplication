import server from './server';
import dotenv from "dotenv";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '4000', 10);

const starter = new server().start(PORT)
    .then(port => console.log(`Running on port ${port}`))
    .catch(error => {
        console.log(error)
    });

export default starter;
