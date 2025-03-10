//---------------------------------------Requiring Express-------------------------------------------------
const express = require('express');
const app = express();
require('dotenv').config();
//---------------------------------------Requiring Multer to save image in MongoDB---------------------------------------------------
const multer = require('multer');
//---------------------------------------Requiring Models---------------------------------------------------
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
}

main().then(()=>{console.log('Connection Successfull.........')}).catch(err=>console.log(err));
const contactForm = require('./models/contactForm.js')
const eventRegForm = require('./models/eventRegForm.js')
const createEvent = require("./models/createevent.js")
//---------------------------------------Requiring cors---------------------------------------------------
const cors = require("cors");
//---------------------------------------Middleware--------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded images
//---------------------------------------Routers--------------------------------------------------------------
const eventRoutes = require('./routes/eventRoutes.js');
//---------------------------------------Routers use--------------------------------------------------------------
app.use('/api/events', eventRoutes);
//--------------------------------------Routes----------------------------------------------------------------
//-------------------------------------Contact Form Route----------------------------------------------
app.post("/form",async(req,res)=>{
    try{
        let {name, email, phone, message} = req.body;
        let form = new contactForm({
            name,
            email,
            phone,
            message
        })
        await form.save()
        res.json({ success: true, message: "Form submitted successfully!" });
    }
    catch(err){
        console.error("Error saving form:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
})

app.get("/form",async(req,res)=>{
    try {
        let userQuerry = await contactForm.find();
        res.json(userQuerry);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
})
//-------------------------------------Event Registration Form Route----------------------------------------------
app.post("/eventregistration",async(req,res)=>{
    try {
        let {name, email, phone, age, eventName} = req.body;
        let eventReg = new eventRegForm({
            name,
            eventName,
            email,
            phone,
            age,
        })
        await eventReg.save();
        res.json({success: true, message: "Registered for the event successfully...!!!"})
    } catch (err) {
        console.error("Error in registration:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
})

app.get("/eventregistration", async (req, res) => {
    try {
        let registrationDetails = await eventRegForm.find();
        res.json(registrationDetails);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//--------------------------------------Event Details Route----------------------------------------------------------------
app.get("/eventdetails", async (req, res) => {
    try {
        const eventData = await createEvent.find();

        if (!eventData || eventData.length === 0) {
            return res.status(404).json({ success: false, message: "No events found." });
        }

        res.status(200).json({ success: true, data: eventData });
    } catch (error) {
        console.error("Error fetching event details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
});
//--------------------------------------Event Details Show Route----------------------------------------------------------------
app.get("/eventdetails/:id", async (req, res) => {
    try {
      const event = await createEvent.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      // Ensure 'upcoming' exists
      res.json({
        ...event._doc,
        upcoming: event.upcoming || { cta: "Register Now", date: "TBA", location: "Online" },
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });
  



//--------------------------------------listening port----------------------------------------------------------------

app.listen(process.env.PORT,()=>{
    console.log(`App is listenning on PORT 5000.....`);
})