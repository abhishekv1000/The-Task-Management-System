const mongoose = require("mongoose");

const conn = async () => {
    try {
        const response = await mongoose.connect
          ("mongodb+srv://abhishekv1000:1221@cluster0.jple0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        if (response) {
            console.log("Connected to DB");
        }
    } catch (error) {
        console.log(error);
    }
};
conn();