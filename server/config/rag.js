import { r2rClient } from "r2r-js";
import { config } from "dotenv";

config();

const client = new r2rClient("http://localhost:7272", {
    
});

export default client;
