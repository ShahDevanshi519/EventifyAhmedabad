require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require('uuid');
const port = process.env.PORT;

// Import Module
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fileupload 
app.use(fileupload());

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
const BookingTb = require('./models/BookingSchema');
const verifyToken = require('./verifyToken');

const MONGO_URL = process.env.MONGO_URL

// Open Connection
mongoose.connect(MONGO_URL)
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
                res.json({flag:1,msg:"Login Successfully",adminId:data._id})
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
    const ACCESS_SECRET_KEY = process.env.JWT_SECRET;
    const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

    UserTb.findOne({email:email})
    .then(data => {
        if(data){
            if(data.password == password){
                const access_token = jwt.sign({
                    id:data._id,email:data.email},
                    ACCESS_SECRET_KEY,
                    { expiresIn:"1h" }
                )

                const refresh_token = jwt.sign({
                    id:data._id,email:data.email},
                    REFRESH_SECRET_KEY,
                    { expiresIn:"7d"}
                )
                res.json({flag:1,msg:'Login success',fullName:data.fullName,userId:data._id,access_token,refresh_token});
            }else{
                res.json({flag:0,msg:'Login faild'});
            }
        }else{
            res.json({flag:0,msg:'No Account Is Found,SignUp First'});
        }
    })
    .catch((err) => console.log(err))
})

// Dashboard API
app.get('/dashboard',verifyToken,(req,res) => {
    res.json({msg:"Welcome To Dashboard",user:req.user})
})

// Refresh Token
app.post('/refreshToken',(req,res) => {
    const refreshToken = req.body.refreshToken;
    const ACCESS_SECRET_KEY = process.env.JWT_SECRET;
    const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

    if(!refreshToken){
        return res.status(401).json({msg:"Token Not Found"});
    }

    jwt.verify(refreshToken,REFRESH_SECRET_KEY,(err,user) => {
        if(err){
            return res.status(401).json({msg:"Token Is Invalid Now"});
        }

        const newToken = jwt.sign({
            id:user.id,email:user.email},
            ACCESS_SECRET_KEY,
            { expiresIn:"1h"}   
        )

        res.json({access_token:newToken})
    })
})

// ChangePassword
app.post('/changepassword',verifyToken,(req,res) => {
    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;

    UserTb.findById(req.user.id)
    .then((user) => {
        if(!user){
            return res.status(401).json({msg:"User Not Found"})
        }

        if(user.password !== oldpassword){
            return res.status(401).json({msg:"Password Not Matched"});
        }

        user.password = newpassword;

        user.save()
        .then(() => res.json({flag:1,msg:"Password Update Successfully"}))
        .catch(() => res.json({flag:0,msg:"Password Not Updated"}))
    }).catch((err) => console.log(err))
})

// Edit Profile Fetch Data
app.get('/editprofile/fetchdata',verifyToken,(req,res) => {
    UserTb.findById(req.user.id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Edit Profile
app.post('/editprofile',verifyToken,(req,res) => {
    const {fullName,lastName,email,phone,address,city,zip} = req.body;
    const updateData = {fullName,lastName,email,phone,address,city,zip};

    if(req.files && req.files.profileImage){
        const image = req.files.profileImage;
        const imageName = image.name;
        const uploadPath = "public/images/Uploads/" + imageName;
        image.mv(uploadPath,(err) => {
            if(err)
                return res.status(500).json({msg:"Profile Image Is Not Uploaded"});
        })

        updateData.profileImage =  imageName;
    }

    UserTb.findByIdAndUpdate(req.user.id,updateData,{new:true})
    .then(() => res.json({flag:1,msg:"Your Profile Updated Successfully"}))
    .catch((err) => res.json({flag:0,msg:"Your Profile Not Updated Successfully",error:err}))
})

// ForgotPassword
app.post('/forgotpassword',(req,res) => {
    const email = req.body.email;

    UserTb.findOne({email:email})
    .then((user) => {
        if(!user){
            return res.json({flag:0,msg:"User Not Found,Please SignUp!"})
        }

        const token = uuidv4();

        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

        return user.save();
    }).then((saveUser) => {
        if(!saveUser){
            return 
        }

        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const frontend = process.env.FRONTEND_URL
        const resetLink = `${frontend}/resetpassword/${saveUser.resetToken}`;

        return transporter.sendMail({
            from:`"Eventify" <${process.env.EMAIL_USER}>`,
            to:saveUser.email,
            subject:"Reset Password",
            html:
            `
                <h2>Reset Token Link </h2>
                <p>click the link below to reset your password.</p>
                <a href="${resetLink}">Reset Password</a><br>
                <p>this link will be expire in 15 minutes.</p>
            `
        });
    }).then((info) => {
        if(!info)
            return;
        console.log("Information Id",info);
        res.json({flag:1,msg:"Email Send Successfully"})
    }).catch((err) => {
        console.log(err);
        res.json({flag:0,msg:"Something Went Wrong",error:err})
    })
})

// ResetPassword
app.post('/resetpassword/:token',(req,res) => {
    const newpassword = req.body.newPassword;
    const token = req.params.token;

    UserTb.findOne({
        resetToken:token,
        resetTokenExpire:{$gt:Date.now()}
    }).then((user) => {
        if(!user)
            return res.json({msg:"Your Token Is Expired!Again Do ForgotPassword"})

        user.password = newpassword;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;

        user.save()
        .then(() => res.json({flag:1,msg:"Your Password Reset Successfully"}))
        .catch(() => res.json({flag:0,msg:"Your Password Not Reset..."}))
    }).catch((err) => console.log(err))
})

// Event Page Render
app.get('/event',(req,res) => {
    res.render('event')
})

// Event Post API
app.post('/event-api', (req, res) => {

    const image = req.files.eventImage;

    const category = req.body.mycategory;

    const imageName = image.name;
    
    image.mv("public/Images/" + category + "/" + imageName);

    const whatToExpectArray = req.body.whatToExpect
        ? req.body.whatToExpect.split(/,|\r?\n/)
        : [];

    const myobj = {
        title: req.body.title,
        category: category,
        eventImage: "/Images/" + category + "/" + imageName,
        date: req.body.date,
        time: req.body.time,
        venue: req.body.venue,
        area: req.body.area,
        price: req.body.price,
        totalseats: req.body.totalseats,
        seats: req.body.seats,
        description: req.body.description,
        rating: req.body.rating,
        reviews: req.body.reviews,
        isTrending: req.body.isTrending === "true",
        isLive: req.body.isLive === "true",
        isLoved: req.body.isLoved === "true",
        whatToExpect: whatToExpectArray,
        note: req.body.note
    };

    EventTb.create(myobj)
        .then(() => res.json({ flag: 1, msg: "Event Added Successfully" }))
        .catch(() => res.json({ flag: 0, msg: "Error" }));
});

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
    EventTb.find().limit(5)
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
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  ContactTb.create(req.body)
  .then(() => {
      transporter.sendMail({
        from: `"Eventify" <${process.env.EMAIL_USER}>`,
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

        from: `"Eventify" <${process.env.EMAIL_USER}>`,
        to: email,

        subject: "Thank You for Contacting Eventify",

        html: `
          <h2>Hello ${name},</h2>

          <p>Thank you for contacting <strong>Eventify</strong>.</p>

          <p>We have received your inquiry regarding "<strong>${subject}</strong>".</p>

          <p>Our team will review your message and get reveal you shortly.</p>

          <br>

          <p>Best Regards,</p>
          <p><strong>Eventify Team</strong></p>
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

// Booking API
app.post('/booking',verifyToken,(req,res) => {
    
    const bookingData = {
        userId:req.user.id,
        eventId : req.body.eventId,
        numberOfTickets : req.body.numberOfTickets,
        totalAmount : req.body.totalAmount
    }

    BookingTb.create(bookingData)
    .then((data) => res.json({flag:1,msg:"Booking Done Successfully",booking:data}))
    .catch((err) => res.json({flag:0,msg:"Booking Is Not Done",error:err.message}))
})

app.get('/booking/display',verifyToken,(req,res) => {
    UserTb.findById(req.user.id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Admin Booking Display
app.get('/display-booking', (req, res) => {
    BookingTb.find()
    .populate("userId","fullName") 
    .populate("eventId","title") 
    .then((data) => {
         console.log(data)
        res.json(data)})
    .catch((err) => res.json(err))
})

// Particular User Booking Display
app.get('/pariticularbooking',verifyToken,(req,res) => {
    BookingTb.find({userId:req.user.id})
    .populate("eventId","title")
    .then((data) => {
        res.json(data)
    })
    .catch((err) => res.json(err))
})

// Count Particular User Booking Data
app.get('/countbooking',verifyToken,(req,res) => {
    BookingTb.countDocuments({userId:req.user.id})
    .then((count) => res.json(count))
    .catch((err) => res.json(err))
})

// Recent Booking
app.get('/recentuserbooking',verifyToken,(req,res) => {
    BookingTb.find({userId:req.user.id})
    .populate("eventId","title")
    .sort({bookingDate:-1})
    .limit(3)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Admin Dashboard Count Total User,Events,Bookings
app.get('/countuser',(req,res) => {
    UserTb.countDocuments()
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

app.get('/countevent',(req,res) => {
    EventTb.countDocuments()
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

app.get('/countbookingadmin',(req,res) => {
    BookingTb.countDocuments()
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Admin Delete The User
app.delete('/admin/deleteuser/:id',(req,res) => {
    UserTb.findByIdAndDelete(req.params.id)
    .then(() => res.json({flag:1,msg:"User Deleted Successfully!"}))
    .catch(() => res.json({flag:0,msg:"User Not Deleted Successfully"}))
})

// Admin Delete The Event
app.delete('/admin/deleteEvent/:id',(req,res) => {
    EventTb.findByIdAndDelete(req.params.id)
    .then(() => res.json({flag:1,msg:"Event Deleted Successfully!"}))
    .catch(() => res.json({flag:0,msg:"Event Not Deleted Successfully"}))
})

// Contact Status Update
app.put('/admin/contact/status/:id',(req,res) => {
    const newstatus = req.body.status;

    ContactTb.findByIdAndUpdate(req.params.id,{
        status:newstatus
    }).then(() => res.json({flag:1,msg:"Status Updated Successfully"}))
    .catch((err) => console.log(err))
})

// Admin ChangePassword
app.post('/admin/changepassword/:id',(req,res) => {
    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;

    AdminTb.findById(req.params.id)
    .then((user) => {
        if(!user){
            return res.json({msg:"User Not Found"})
        }

        if(user.password !== oldpassword){
            return res.json({msg:"passsword doesn't match! enter valid password."})
        }

        user.password = newpassword;
        user.save()
        .then(() => res.json({flag:1,msg:"password updated successfully!"}))
        .catch(() => res.json({flag:0,msg:"password not updated successfully"}))
    }).catch((err) => console.log(err))
})

// Admin Edit Profile
app.get("/admin/display/:id",(req,res) => {
    AdminTb.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

app.post('/admin/editprofile/:id',(req,res) => {

    const {adminName,lastName,email,mobile,address,city,zip} = req.body;

    const allData = {adminName,lastName,email,mobile,address,city,zip};

    if(req.files && req.files.profileImage){

        const image = req.files.profileImage;
        const imagename = image.name;
        const uploadpath = 'public/Images/Admin/' + imagename;

        image.mv(uploadpath,(err)=>{
            if(err){
                return res.json({flag:0,msg:"File Is Not Uploaded Successfully"})
            }

            allData.profileImage = imagename;

            AdminTb.findByIdAndUpdate(req.params.id,allData,{returnDocument:"after"})
            .then(()=>res.json({flag:1,msg:"Your Profile Updated Successfully!"}))
            .catch(()=>res.json({flag:0,msg:"Your Profile Is Not Updated Successfully!"}))

        })

    }else{

        AdminTb.findByIdAndUpdate(req.params.id,allData,{returnDocument:"after"})
        .then(()=>res.json({flag:1,msg:"Your Profile Updated Successfully!"}))
        .catch(()=>res.json({flag:0,msg:"Your Profile Is Not Updated Successfully!"}))

    }

})

// Forgot Password
app.post('/admin/forgotpassword',(req,res) => {

    const email = req.body.email;

    AdminTb.findOne({email:email})
    .then((user) => {

        if(!user){
            return res.json({msg:"User Not Exist"});
        }

        const token = uuidv4();
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

        return user.save();

    }).then((saveUser) => {

        if(!saveUser){
            return res.json({msg:"User save failed"});
        }

        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });

        const frontend = process.env.ADMIN_URL;
        const resetLink = `${frontend}/adminresetpassword/${saveUser.resetToken}`;

        return transporter.sendMail({
            from:`"eventify" <${process.env.EMAIL_USER}>`,
            to: saveUser.email,
            subject:"Reset Password Link",
            html:`
                <h2>Reset Token Link</h2>
                <p>Click the link below to reset password</p>
                <a href="${resetLink}">Reset Password</a>
                <p>this link will be expired in 15 minutes.</p>
            `
        });

    }).then(() => {

        res.json({flag:1,msg:"Email Send Successfully"});

    }).catch((err) => {

        console.log(err);
        res.json({flag:0,msg:"Something Went Wrong!"});

    });

});

app.post('/adminresetpassword/:token',(req,res) => {
    const newpassword = req.body.newpassword;
    const token = req.params.token;

    AdminTb.findOne({
        resetToken:token,
        resetTokenExpire:{$gt:Date.now()}
    }).then((user) => {
        if(!user)
            return res.json({msg:"Your Token Is Expired!Again Do ForgotPassword"})

        user.password = newpassword;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;

        user.save()
        .then(() => res.json({flag:1,msg:"Your Password Reset Successfully"}))
        .catch(() => res.json({flag:0,msg:"Your Password Not Reset..."}))
    }).catch((err) => console.log(err))
})

app.get('/',(req,res) => {
    res.send("Hello World");
});

app.listen(port,() => {
    console.log(`Server Listning On ${port}`);
})