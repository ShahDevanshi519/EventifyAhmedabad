const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 3000;

// Import Module
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Frontend and Backend Connection
app.use(cors());
// When you use EJs TemplateEngine in Your Project
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

// It Servers Static Files
app.use(express.static('public'))

const UserTb = require('./models/UserSchema');
const EventTb = require('./models/EventSchema');
const AdminTb = require('./models/MyAdminSchema');
const ContactTb = require('./models/ContactSchema');

// Open Connection
mongoose.connect("mongodb://127.0.0.1:27017/Eventifyamd")
.then(() => console.log("connection open"))
.catch(() => console.log("connection failed"))
// connection close

// Admin Data
app.get('/admin-api',(req,res) => {
    AdminTb.find()
    .then((data) => res.json(data))
    .catch((err) => console.log("Data Not Found"))
})

// Admin Login
app.post('/admin-login',(req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    AdminTb.findOne({email:email})
    .then((data) => {
        if(data){
            if(data.password == password){
                res.json({flag:1,msg:"Login Successfully"})
            }else{
                res.json({flag:0,msg:"Login Failed"})
            }
        }else{
            res.json({flag:0,msg:"Invalid Admin Credential"})
        }
    })
    .catch((err) => res.json(err.message))

})

// Register
app.post('/register-api',(req,res) => {
    UserTb.create(req.body)
    .then(() => res.json({flag:1,msg:"Record Added Successfully"}))
    .catch(() => res.json({flag:0,msg:"Email Already Exists"}))
})

app.get('/display-api',(req,res) => {
    UserTb.find()
    .then(data => res.json(data))
    .catch(err => console.log("Data Not Found"))
})

//Login Api
app.post('/login-api',(req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    UserTb.findOne({email:email})
    .then(data => {
        if(data){
            if(data.password == password){
                res.json({flag:1,msg:'Login success',fullName:data.fullName});
            }else{
                res.json({flag:0,msg:'Login faild'});
            }
        }else{
            res.json({flag:0,msg:'No Account Is Found,SignUp First'});
        }
    })
    .catch((err) => console.log(err))
})

// Event Page Render
app.get('/event',(req,res) => {
    res.render('event')
})

// Event Post API
app.post('/event-api',(req,res) => {

    const whatToExpectArray = req.body.whatToExpect
        ? req.body.whatToExpect
            .split(/,|\r?\n/)         
            .map(item => item.trim())  
            .filter(item => item.length > 0)
        : [];

    const myobj  = {
        title:req.body.title,
        category:req.body.mycategory,
        eventImage:'/Images/' + req.body.mycategory + '/' + req.body.eventImage,
        date:req.body.date,
        time:req.body.time,
        venue:req.body.venue,
        area:req.body.area,
        price:req.body.price,
        totalseats:req.body.totalseats,
        seats:req.body.seats,
        description:req.body.description,
        rating:req.body.rating,
        reviews:req.body.reviews,
        isTrending:req.body.isTrending === "true",
        isLive:req.body.isLive === "true",
        isLoved:req.body.isLoved === "true",
        whatToExpect:whatToExpectArray,
        note:req.body.note,  
    }
    EventTb.create(myobj) 
    .then(() => res.json({flag:1,msg:"Event Addedd Successfully"}))
    .catch((err) => {
        console.log("Err",err);
        res.json({flag:0,msg:err.message})})
})

// Display AllEvents
app.get('/display-event',(req,res) => {
    EventTb.find()
    .then((data) => res.json(data))
    .catch((err) => res.send(err))
})

// Display MostLoved Events
app.get('/display-mostloved',(req,res) => {
    EventTb.find({isLoved:true})
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Display isTrending Events
app.get('/display-isTrending',(req,res) => {
    EventTb.find({isTrending:true})
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Display isLive Events
app.get("/display-isLive",(req,res) => {
    EventTb.find({isLive:true})
    .then((data) => res.json(data))
    .catch((err) => res.json(err)) 
})

// Display Popular Events
app.get("/display-popularEvents",(req,res) => {
    EventTb.find().limit(4)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Display Event Details
app.get('/event/:id',(req,res) => {
    const id = req.params.id;
    EventTb.findById(id)
    .then((data) => {
        if(data){
            res.json(data)
        }else{
            res.json({flag:0,msg:"Event Not Found"})
        }
    })
    .catch((err) => res.json(err))
})

// Related Event
app.get('/related-event/:id', (req, res) => {
  const eventId = req.params.id;
  EventTb.findById(eventId)
    .then((currentEvent) => {
      if (!currentEvent) {
        return res.json([]);
      }

      return EventTb.find({
        category: currentEvent.category,
        _id: { $ne: eventId }
      }).limit(2);

    })
    .then((relatedEvents) => {
      res.json(relatedEvents);

    })
    .catch((err) => res.json({msg:"Not Found"}))
});

// Upcoming Event
app.get('/upcoming-event',(req,res) => {
    const today = new Date();

    EventTb.find({
        date:{ $gt : today}
    }).sort({date : 1}).limit(5)
    .then((upcomingEvent) => res.json(upcomingEvent))
    .catch((err) => res.json(err))
})

// Area wise filter
app.get('/events/area/:area',(req,res) => {
    let area = req.params.area;
    area = area.charAt(0).toUpperCase() + area.slice(1);
    EventTb.find({area})
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Contact Page
app.post('/contact-api', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "shahdevanshi003@gmail.com",
      pass: "pmom kiwl noid lvbp",
    },
  });

  ContactTb.create(req.body)
  .then(() => {
      transporter.sendMail({
        from: '"EventifyAhmedabad" <shahdevanshi003@gmail.com>',
        to: "nac1852sh@gmail.com",
        replyTo: email,
        subject: subject,
        text: "New Inquiry Received",
        html: `
          <h2>New Inquiry Received</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      })
      .then(() => {
        return transporter.sendMail({

        from: '"EventifyAhmedabad" <shahdevanshi003@gmail.com>',
        to: email,

        subject: "Thank You for Contacting Eventify Ahmedabad",

        html: `
          <h2>Hello ${name},</h2>

          <p>Thank you for contacting <strong>Eventify Ahmedabad</strong>.</p>

          <p>We have received your inquiry regarding "<strong>${subject}</strong>".</p>

          <p>Our team will review your message and get reveal you shortly.</p>

          <br>

          <p>Best Regards,</p>
          <p><strong>Eventify Ahmedabad Team</strong></p>
        `
      });
      })
      .then((info) => {
        console.log("Message sent:", info.messageId);
        res.json({flag: 1,msg: "Inquiry Added and Email Sent Successfully"
        });
      })
      .catch((emailError) => {
        console.log(emailError);
        res.json({flag: 0,msg: "Inquiry saved but Email failed"
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({flag: 0,msg: "Inquiry not added"
      });
    });
});

// Display Inquiry
app.get('/contact-display',(req,res) => {
    ContactTb.find()
    .then((data) => res.json(data))
    .catch((err) => res.json({msg:"No Inquiry Found"}))
})



// Category Fetch
app.get("/event/category/:category",(req,res) => {
    const category = req.params.category;
    EventTb.find({category:{ $regex: new RegExp(`^${category}$`, "i") }})
    .then((data) => res.json(data))
    .catch((err) => res.json({msg:err.message}))
})

app.get('/',(req,res) => {
    res.send("Hello World");
});

app.listen(port,() => {
    console.log(`Server Listning On ${port}`);
})