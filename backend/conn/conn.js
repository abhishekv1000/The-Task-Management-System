const mongoose = require("mongoose");

const conn = async () => {
    try {
        const response = await mongoose.connect
          (" mongodb+srv://abhishekv1000:1221@taskmanager.jple0.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=taskmanager");
        if (response) {
            console.log("Connected to DB");
        }
    } catch (error) {
        console.log(error);
    }
};
conn();
