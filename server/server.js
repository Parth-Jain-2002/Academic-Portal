const nodemailer = require('nodemailer');
const express = require('express');

const app = express();

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'parthljain2002@outlook.com',
        pass: 'parthjain@2002'
    }
});

let otpPairs = {}; // {email: otp}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/sendmail', (req, res) => {

    const otp = Math.floor(Math.random()*1000000)

    const mailOptions = {
        from: 'parthljain2002@outlook.com',
        to: req.query.to,
        subject: 'Sending Email using Node.js',
        text: `So the mail is sent for OTP Verification for your account that you have created on our application. The OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send('Error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent');
            otpPairs[req.query.to] = otp;
        }
    });
});

app.get('/verifyotp', (req, res) => {
    const otp = req.query.otp
    const email = req.query.email
    if(otp == otpPairs[email]) { 
        delete otpPairs[email];
        res.send('OTP Verified');
    }
    else {
        res.send('OTP Not Verified');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});