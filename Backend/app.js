require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
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
const FeedbackTb = require('./models/FeedbackSchema');
const WishlistTb = require('./models/WishlistSchema');
const verifyToken = require('./verifyToken');
const TicektTypeTb = require('./models/TicketSchema');

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

// Admin Bcrypt Password
bcrypt.hash("admin@123", 10)
  .then((hash) => {
    console.log(hash);
  })
  .catch((err) => console.log(err));

// Admin Login
app.post('/admin-login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    AdminTb.findOne({ email: email })
    .then((data) => {

        if (!data) {
            return res.json({ flag: 0, msg: "Invalid Admin Credential" });
        }

        bcrypt.compare(password, data.password)
        .then((result) => {

            if (result) {
                res.json({
                    flag: 1,
                    msg: "Login Successfully",
                    adminId: data._id
                });
            } else {
                res.json({ flag: 0, msg: "Login Failed" });
            }

        })
        .catch((err) => {
            console.log(err);
            res.json({ flag: 0, msg: "Error in password compare" });
        });
    })
    .catch((err) => res.json({ flag: 0, msg: err.message }));
});

// Register
app.post('/register-api', (req, res) => {
    const { fullName, email, password, phone } = req.body;

    bcrypt.hash(password, 10)
        .then(hashPassword => {
            const newUser = new UserTb({
                fullName,
                email,
                password: hashPassword,
                phone
            });

            return newUser.save();
        })
        .then((user) => {
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            return transporter.sendMail({
                from: `"Eventify" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Welcome to Eventify!",
                html: `
                    <h2>Hi ${user.fullName},</h2>
                    <p>Thank you so much for registering with <b>Eventify!</b></p>
                    <p>Now you can explore events, book events, provide feedback & ratings, and enjoy all the features!</p>
                    <br>
                    <p>Best Regards,<br>Eventify Team</p>
                `
            });
        })
        .then((info) => {
            console.log("Email Info:", info);
            res.json({ flag: 1, msg: "Record Added Successfully & Email Sent" });
        })
        .catch(err => {
            console.log(err);
            if (err.code === 11000) {
                res.json({ flag: 0, msg: "Email Already Exists" });
            } else {
                res.json({ flag: 1, msg: "Record Added Successfully, but email failed to send" });
            }
        });
});

app.get('/display-api',(req,res) => {
    UserTb.find()
    .then(data => res.json(data))
    .catch(err => console.log("Data Not Found"))
})

//Login Api
app.post('/login-api', (req, res) => {
    const { email, password } = req.body;

    const ACCESS_SECRET_KEY = process.env.JWT_SECRET;
    const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

    UserTb.findOne({ email: email })
        .then((data) => {
            if (!data) {
                return res.json({ flag: 0, msg: 'No Account Found, SignUp First' });
            }

            return bcrypt.compare(password, data.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.json({ flag: 0, msg: 'Invalid Password' });
                    }

                    const access_token = jwt.sign(
                        { id: data._id, email: data.email },
                        ACCESS_SECRET_KEY,
                        { expiresIn: "1h" }
                    );

                    const refresh_token = jwt.sign(
                        { id: data._id, email: data.email },
                        REFRESH_SECRET_KEY,
                        { expiresIn: "7d" }
                    );

                    res.json({flag: 1,msg: 'Login Success',fullName: data.fullName,userId: data._id,access_token,refresh_token
                    });
                });
        })
        .catch((err) => {
            console.log(err);
            res.json({ flag: 0, msg: 'Something went wrong' });
        });
});

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
app.post('/changepassword', verifyToken, (req, res) => {
    const { oldpassword, newpassword } = req.body;

    UserTb.findById(req.user.id)
        .then((user) => {
            if (!user) {
                return res.status(401).json({ msg: "User Not Found" });
            }

            return bcrypt.compare(oldpassword, user.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.status(401).json({ msg: "Old Password Not Matched" });
                    }

                    return bcrypt.hash(newpassword, 10);
                })
                .then((hashedPassword) => {
                    if (!hashedPassword) return;

                    user.password = hashedPassword;

                    return user.save();
                })
                .then(() => {
                    res.json({ flag: 1, msg: "Password Updated Successfully" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ flag: 0, msg: "Something went wrong" });
        });
});

// Edit Profile Fetch Data
app.get('/editprofile/fetchdata',verifyToken,(req,res) => {
    UserTb.findById(req.user.id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Edit Profile
app.post('/editprofile', verifyToken, (req, res) => {
    const { fullName, lastName, email, phone, address, city, zip } = req.body;

    let updateData = { fullName, lastName, email, phone, address, city, zip };

    if (req.files && req.files.profileImage) {
        const image = req.files.profileImage;
        const imageName = Date.now() + "_" + image.name;
        const uploadPath = "public/images/Uploads/" + imageName;

        image.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({ msg: "Image upload failed" });
            }

            updateData.profileImage = imageName;

            UserTb.findByIdAndUpdate(req.user.id, updateData, { new: true })
                .then(() => res.json({ flag: 1, msg: "Profile Updated Successfully" }))
                .catch(() => res.json({ flag: 0, msg: "Update Failed" }));
        });
    } else {
        UserTb.findByIdAndUpdate(req.user.id, updateData, { new: true })
            .then(() => res.json({ flag: 1, msg: "Profile Updated Successfully" }))
            .catch(() => res.json({ flag: 0, msg: "Update Failed" }));
    }
});

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

        return bcrypt.hash(newpassword,10)
        .then((hashPassword) => {
            user.password = hashPassword;
            user.resetToken = undefined;
            user.resetTokenExpire = undefined;

            return user.save()
        })
    }).then(() => res.json({flag:1,msg:"Your Password Is Reset Successfully!"}))
    .catch((err) => {
        console.log(err)
        res.json({flag:0,msg:"Your Password Is Not Reset..."})
    })
})

// Feedback-Rating For Particular Event
app.post("/event/rating",verifyToken,(req,res) => {
    const userId = req.user.id;
    const {eventId,rating,feedback} = req.body;

    BookingTb.findOne({userId:userId,eventId:eventId})
    .then((booking) => {
        if(!booking){
            throw new Error("Do booking for this event! Than you will be provide feedback and rating for this event");
        }

        return FeedbackTb.findOne({userId:userId,eventId:eventId})
    }).then((feedbackUser) => {
        if(feedbackUser){
            throw new Error("Your already submitted your feedback & rating")
        }

        return FeedbackTb.create({userId,eventId,rating,feedback})
    }).then((result) => {
        if(result){
            res.json({flag:1,msg:"Thanks For Your Feedback!"})
        }else{
            res.json({flag:0,msg:"Server Problem!"})
        }
    })
    .catch((err) => res.json({flag:0,msg:err.message}))
})

// Display Feedback On Page
app.get('/event/feedback/:eventId',(req,res) => {
    const eventId = req.params.eventId;
    FeedbackTb.find({eventId:eventId})
    .populate("userId","fullName")
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Display Feedback On Admin Side
app.get('/admin/event/feedback',(req,res) => {
    FeedbackTb.find()
    .populate("userId","fullName")
    .populate("eventId","title")
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Delete The Particular Feedback & Rating Admin Side
app.delete('/admin/event/feedbackdelete/:id',(req,res) => {
    FeedbackTb.findByIdAndDelete(req.params.id)
    .then(() => res.json({flag:1,msg:"Feedback & Rating Deleted Successfully"}))
    .catch((err) => res.json({flag:0,msg:err.message}))
})

// Wishlist User Side
app.post('/event/wishlist',verifyToken,(req,res) => {
    const userId = req.user.id;
    const {eventId} = req.body;

    WishlistTb.findOne({userId,eventId})
    .then((existingUser) => {
        if(existingUser){
            return res.json({flag:0,msg:"You Already Add This Event Into The Wishlist"})
        }

        return WishlistTb.create({ userId,eventId });
    }).then((saveUser) => {
        if(saveUser){
            return res.json({flag:1,msg:"Your Event Is Added Into The Wishlist!"})
        }

    }).catch((err) => res.json({flag:0,msg:"Your Event Id Not Addedd To Wishlist! Something Went Wrong!"}))
})

// Wishlist Display
app.get('/fetch/wishlist',verifyToken,(req,res) => {
    const userId = req.user.id;

    WishlistTb.find({userId:userId})
    .populate("eventId","eventImage title date time price venue")
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Delete The Event From The Wishlist
app.delete('/event/wishlist/delete/:id',(req,res) => {
    WishlistTb.findByIdAndDelete(req.params.id)
    .then(() => res.json({flag:1,msg:"Event Is Deleted Successfully!"}))
    .catch((err) => console.log(err))
})

// Admin Side Wishlist
app.get('/admin/wishlist',(req,res) => {
    WishlistTb.find()
    .populate("userId","fullName")
    .populate("eventId","eventImage title date time price venue area")
    .then((data) => res.json(data))
    .catch((err) => console.log(err))
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

// Ticekt Type Fetch From Database and display In UI

app.get('/ticketTypes/:eventId', (req, res) => {

    const eventObjectId = new mongoose.Types.ObjectId(req.params.eventId);

    TicektTypeTb.find({ eventId: eventObjectId })
    .then((tickets) => {
        console.log("Found tickets:", tickets);
        res.json({ flag: 1, data: tickets });
    })
    .catch((err) => {
        res.json({ flag: 0, msg: err.message });
    });

});

// Booking API
app.post('/booking', verifyToken, (req, res) => {

    const { eventId, numberOfTickets, totalAmount, ticketTypes } = req.body;

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    BookingTb.findOne({
        userId: req.user.id,
        eventId: eventId
    })
    .then((existingBooking) => {

        if (existingBooking) {
            throw { isCustom: true, msg: "You Already Did The Booking! Please Check Your Booking!" };
        }

        return TicektTypeTb.findOneAndUpdate(
            { eventId, type: ticketTypes[0].type },
            { $inc: { availableSeats: -ticketTypes[0].quantity } }
        );

    })
    .then((updatedTicket) => {

        if (!updatedTicket) {
            throw { isCustom: true, msg: "Ticket not available" };
        }

        if (ticketTypes[1]) {
            return TicektTypeTb.findOneAndUpdate(
                { eventId, type: ticketTypes[1].type },
                { $inc: { availableSeats: -ticketTypes[1].quantity } }
            );
        }

        return true;
    })
    .then(() => {

        return BookingTb.create({
            userId: req.user.id,
            eventId: eventId,
            ticketTypes: ticketTypes,
            numberOfTickets: numberOfTickets,
            totalAmount: totalAmount
        });

    })
    .then((bookingData) => {

        if (!bookingData) {
            throw { isCustom: true, msg: "Booking failed" };
        }

        return BookingTb.findById(bookingData._id)
            .populate("userId", "fullName email")
            .populate("eventId", "title");

    })
    .then((bookingData) => {

        if (!bookingData) {
            throw { isCustom: true, msg: "Booking data not found" };
        }

        const ticketRows = ticketTypes.map((t) => `
            <tr>
                <td>${t.type} Tickets</td>
                <td>${t.quantity} × ₹${t.pricePerTicket} = ₹${t.quantity * t.pricePerTicket}</td>
            </tr>
        `).join('');

        return transporter.sendMail({
            from: `"Eventify" <${process.env.EMAIL_USER}>`,
            to: "eventifyadmin0312@gmail.com",
            subject: "New Booking Received",
            html: `
                <h2>New Booking Alert</h2>
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                    <tr><th>Field</th><th>Details</th></tr>
                    <tr><td>User Name</td><td>${bookingData.userId.fullName}</td></tr>
                    <tr><td>User Email</td><td>${bookingData.userId.email}</td></tr>
                    <tr><td>Event</td><td>${bookingData.eventId.title}</td></tr>
                    ${ticketRows}
                    <tr><td>Total Tickets</td><td>${bookingData.numberOfTickets}</td></tr>
                    <tr><td>Total Price</td><td>₹${bookingData.totalAmount}</td></tr>
                    <tr><td>Booking Status</td><td>${bookingData.bookingStatus}</td></tr>
                    <tr><td>Booking Date</td><td>${bookingData.bookingDate}</td></tr>
                </table>
            `
        })
        .then(() => {
            return transporter.sendMail({
                from: `"Eventify" <${process.env.EMAIL_USER}>`,
                to: bookingData.userId.email,
                subject: "Booking Confirmation",
                html: `
                    <h2 style="color:green;">Booking Confirmed</h2>
                    <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                        <tr><th>Field</th><th>Details</th></tr>
                        <tr><td>Name</td><td>${bookingData.userId.fullName}</td></tr>
                        <tr><td>Event</td><td>${bookingData.eventId.title}</td></tr>
                        ${ticketRows}
                        <tr><td>Total Tickets</td><td>${bookingData.numberOfTickets}</td></tr>
                        <tr><td>Total Price</td><td>₹${bookingData.totalAmount}</td></tr>
                        <tr><td>Booking Status</td><td>${bookingData.bookingStatus}</td></tr>
                        <tr><td>Booking Date</td><td>${bookingData.bookingDate}</td></tr>
                    </table>
                    <br/>
                    <p>Thank You For Booking With Eventify</p>
                `
            });
        });

    })
    .then(() => {
        return res.json({
            flag: 1,
            msg: "Booking Successful & Emails Sent"
        });
    })
    .catch((err) => {
        console.log(err);

        if (res.headersSent) return;

        if (err.isCustom) {
            return res.json({ flag: 0, msg: err.msg });
        }

        return res.json({
            flag: 0,
            msg: "Booking or Email Failed",
            error: err.message
        });
    });
});

app.get('/booking/display',verifyToken,(req,res) => {
    UserTb.findById(req.user.id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Ticekt UI Display
app.get('/ticketdisplay/:id',(req,res) => {
    BookingTb.findById(req.params.id)
    .populate("userId","fullName")
    .populate("eventId","title date time venue area eventImage category")
    .then((data) => {
        res.json(data)})
    .catch((err) => res.json(err))
})

// Admin Booking Display
app.get('/display-booking', (req, res) => {
    BookingTb.find()
    .populate("userId","fullName") 
    .populate("eventId","title") 
    .then((data) => {
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

// Admin Update Event
app.get('/admin/eventdisplay/:id',(req,res) => {
    EventTb.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => console.log(err))
})

app.put('/admin/updatevent/:id', (req, res) => {

  let updateData = { ...req.body };

  if (!req.body.eventImage || req.body.eventImage === "") {
    delete updateData.eventImage;
  }

  EventTb.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  )
  .then((data) => {
    res.json({
      flag: 1,
      msg: "Record Updated Successfully",
      data: data
    });
  })
  .catch((err) => {
    console.log(err);
    res.json({
      flag: 0,
      msg: "Record Is Not Updated Successfully!"
    });
  });

});

// Contact Status Update
app.put('/admin/contact/status/:id',(req,res) => {
    const newstatus = req.body.status;

    ContactTb.findByIdAndUpdate(req.params.id,{
        status:newstatus
    }).then(() => res.json({flag:1,msg:"Status Updated Successfully"}))
    .catch((err) => console.log(err))
})

// Booking Cancel
app.put('/booking/cancel/status/:id', (req, res) => {
  const bookingStatus = req.body.bookingStatus;

  BookingTb.findById(req.params.id)
    .populate("userId")
    .then((booking) => {

      if (!booking) {
        return res.json({ flag: 0, msg: "Booking not found!" });
      }
     
      const oldStatus = booking.bookingStatus;
      booking.bookingStatus = bookingStatus;
      
      return booking.save()
      .then((updatedBooking) => {  
        if (oldStatus !== "Cancel" && bookingStatus === "Cancel") { 

          const nodemailer = require("nodemailer");

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: `"Eventify" <${process.env.EMAIL_USER}>`,
            to: updatedBooking.userId.email,
            subject: "Booking Cancelled",
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  
            <p>Hello <strong>${updatedBooking.userId.fullName}</strong>,</p>

            <p>We regret to inform you that your booking has been cancelled due to unforeseen circumstances related to the event.</p>
            <p>We sincerely apologize for any inconvenience caused. Thank you for your understanding.</p>
            <p>If you have any questions, please feel free to contact us.</p><br>
            <p>
                Regards,<br>
                <strong>Eventify Team</strong>
            </p>

        </div>`
          };

          return transporter.sendMail(mailOptions)
            .then(() => {
              return res.json({ flag: 1, msg: "Booking Cancelled & Email Sent!" });
            })
            .catch((err) => {
              console.log(err);
              return res.json({ flag: 1, msg: "Booking Cancelled but Email Failed!" });
            });

        } else {
          return res.json({ flag: 1, msg: "Status Updated!" });
        }

      });

    })
    .catch((err) => {
      console.log(err);
      return res.json({ flag: 0, msg: "Error occurred!" });
    });
});

// Admin Change Password
app.post('/admin/changepassword/:id', (req, res) => {
    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;

    AdminTb.findById(req.params.id)
    .then((user) => {
        if (!user) {
            return res.json({ flag: 0, msg: "User Not Found" });
        }

        
        return bcrypt.compare(oldpassword, user.password)
        .then((isMatch) => {
            if (!isMatch) {
                return res.json({ flag: 0, msg: "Old password doesn't match! Enter valid password." });
            }

            
            return bcrypt.hash(newpassword, 10)
                .then((hashedPassword) => {
                    user.password = hashedPassword;

                    return user.save()
                        .then(() => res.json({ flag: 1, msg: "Password updated successfully!" }))
                        .catch(() => res.json({ flag: 0, msg: "Password not updated successfully" }));
                });
        });
    })
    .catch((err) => {
        console.log(err);
        res.json({ flag: 0, msg: "Something went wrong" });
    });
});

// Admin Edit Profile
app.get("/admin/display/:id",(req,res) => {
    AdminTb.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

app.post('/admin/editprofile/:id', (req, res) => {

    const { adminName, lastName, email, mobile, address, city, zip } = req.body;

    const allData = { adminName, lastName, email, mobile, address, city, zip };

    if (req.files && req.files.profileImage) {

        const image = req.files.profileImage;
        const imagename = Date.now() + "_" + image.name;

        const uploadpath = 'public/Images/Admin/' + imagename;

        image.mv(uploadpath, (err) => {
            if (err) {
                console.log(err);
                return res.json({ flag: 0, msg: "File upload failed" });
            }

            allData.profileImage = imagename;

            AdminTb.findByIdAndUpdate(req.params.id, allData, { new: true })
                .then(() => res.json({ flag: 1, msg: "Profile Updated Successfully!" }))
                .catch((err) => {
                    console.log(err);
                    res.json({ flag: 0, msg: "Update failed" });
                });
        });

    } else {

        AdminTb.findByIdAndUpdate(req.params.id, allData, { new: true })
            .then(() => res.json({ flag: 1, msg: "Profile Updated Successfully!" }))
            .catch((err) => {
                console.log(err);
                res.json({ flag: 0, msg: "Update failed" });
            });
    }
});

// Forgot Password
app.post('/admin/forgotpassword',(req,res) => {

    const email = req.body.email;

    AdminTb.findOne({email:email})
    .then((user) => {

        if(!user){
            throw { isCustom:true, msg:"User Not Exist" };
        }

        const token = uuidv4();
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

        return user.save();

    }).then((saveUser) => {

        if(!saveUser){
            throw { isCustom:true, msg:"User save failed" };
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
                <p>This link will expire in 15 minutes.</p>
            `
        });

    }).then(() => {

        return res.json({flag:1,msg:"Email Send Successfully"});

    }).catch((err) => {

        console.log(err);

        if(res.headersSent) return;

        if(err.isCustom){
            return res.json({flag:0,msg:err.msg});
        }

        return res.json({flag:0,msg:"Something Went Wrong!"});
    });

});

app.post('/adminresetpassword/:token', (req, res) => {
    const newpassword = req.body.newpassword;
    const token = req.params.token;

    AdminTb.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    })
    .then((user) => {
        if (!user) {
            return res.json({ flag: 0, msg: "Your Token Is Expired! Please do Forgot Password again." });
        }

        return bcrypt.hash(newpassword, 10)
            .then((hashedPassword) => {
                user.password = hashedPassword;
                user.resetToken = undefined;
                user.resetTokenExpire = undefined;

                return user.save()
                    .then(() => res.json({ flag: 1, msg: "Your Password Reset Successfully" }))
                    .catch(() => res.json({ flag: 0, msg: "Your Password Not Reset..." }));
            });
    })
    .catch((err) => {
        console.log(err);
        res.json({ flag: 0, msg: "Something went wrong" });
    });
});

// Ticket Type
app.get('/fetch/event/title',(req,res) => {
    EventTb.find({},"title")
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

app.post('/admin/tickets', (req, res) => {
  const { eventId, type, price, availableSeats } = req.body;

  let eventData;

  EventTb.findById(eventId)
    .then((event) => {
      if (!event) {
        throw { isCustom: true, msg: "Event not found" };
      }

      eventData = event;
      return TicektTypeTb.find({ eventId });
    })
    .then((tickets) => {
      const totalSeatsUsed = tickets.reduce(
        (sum, t) => sum + t.availableSeats,
        0
      );

      if (totalSeatsUsed + Number(availableSeats) > eventData.totalseats) {
        throw {
          isCustom: true,
          msg: "Seats exceed total event capacity",
        };
      }

      return TicektTypeTb.create({ eventId, type, price, availableSeats });
    })
    .then((newTicket) => {
      return res.json({
        flag: 1,
        msg: "Ticket Added Successfully!",
        data: newTicket,
      });
    })
    .catch((err) => {
      console.log(err);

      if (res.headersSent) return;

      if (err.isCustom) {
        return res.json({ flag: 0, msg: err.msg });
      }

      return res.json({
        flag: 0,
        msg: err.message || "Something went wrong",
      });
    });
});

// fetch ticekt details admin side
app.get('/admin/ticket/display',(req,res) => {
    TicektTypeTb.find()
    .populate("eventId")
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

// Ticekt Delete By Admin
app.delete('/tickettype/delete/:id',(req,res) => {
    TicektTypeTb.findByIdAndDelete(req.params.id)
    .then(() => res.json({flag:1,msg:"Your Ticekt Deleted Successfully!"}))
    .catch(() => res.json({flag:0,msg:"Your Ticekt Is Not Deleted Successfully!"}))
})

app.get('/',(req,res) => {
    res.send("Hello World");
});

app.listen(port,() => {
    console.log(`Server Listning On ${port}`);
})