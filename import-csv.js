const fs = require("fs");
const csv = require("csv-parser");
// const { MongoClient } = require("mongodb");
const bd = require("./utils/dbclient");
const sendEmail = require("./utils/mail");

// require("dotenv").config({ path: "./config.env" });
// // MongoDB connection settings
// const uri = process.env.DATABASE.replace("<password>", process.env.PASSWORD); // Replace with your MongoDB connection string

// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// CSV file path
const csvFilePath = "./data/data.csv"; // Replace with your CSV file path

async function importCSV() {
    try {
        await bd.client.connect();
        console.log("Connected to MongoDB");

        const db = bd.client.db("PIB"); // Use your database name here
        const collection = db.collection("news"); // Replace with your collection name

        const csvStream = fs.createReadStream(csvFilePath).pipe(csv());

        csvStream.on("data", async (row) => {
            // Insert each row from the CSV file into the MongoDB collection
            await collection.insertOne({
                title: row.title,
                content: row.content,
                sentiment: row.sentiment,
                department: row.department,
                website_link: row.website_link,
                // Add more fields and mappings as needed
            });
            console.log(`Inserted: ${row.title}`);
            if (row.sentiment == -1) {
                //sendinng email
                const userCollection = db.collection("users");
                const officer = await userCollection.findOne({
                    department: row.department,
                });

                sendEmail({
                    email: officer.email,
                    subject: `Negative-News:${row.title}`,
                    message: `Hello ${officer.name}{PIB officer} 
                    Here you have a mail redgarding a neagtive news of your departmnet ${officer.department}:

                    ${row.content}
                    
                    This is a system genrated mail hence no need to reply ... unless you want to talk to robot`,
                }).then(console.log("Email sent succesfully"));
            }
        });

        csvStream.on("end", () => {
            console.log("CSV import complete.");
            // client.close(); // Close the MongoDB connection
        });
    } catch (error) {
        console.error("Error:", error);
    }
    // finally {
    //     if (client.topology.isConnected()) {
    //         client.close(); // Close the MongoDB connection in the finally block
    //     }
    // }
}

// Run the CSV import script
importCSV();
