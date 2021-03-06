const User = require('../models/user.js');
const bcryptjs = require('bcryptjs');
const express = require('express');
const router = express.Router();
const Story = require('../models/story.js');

router.get('/', (req, res) => {
    /*  I check everywhere with my middleware authentication if someone is not logged in yet.
     *   If a user is not logged in, it renders the login page. 
     *   If you are logged in, and you go to the /login route, I made an exception down below.
     *   It redirects you to /my-profile where the my profile route is handled.
     */
    if (req.session.user) {
        return res.redirect('/');
    }

    /* Rendering login with a title, and offline to true.
     *  In the header I check if the property offline is given anyways.
     *  Based on that I render the logout button or not.
     *  Then I give a property of errors which holds the errors thrown by validation in the session.
     */
    res.render('login.ejs', {
        title: 'Login',
        offline: true,
        errors: req.session.errors,
        customMessage: req.session.customError,
        pageType: 'login'
    });
    // Cleaning up the errors after they've been rendered.
    req.session.errors = null;
});


router.post('/', (req, res) => {


    // User query where the input of the username, in my case the unique username which is the emailaddress.
    User.findOne({
            userName: req.body.emailaddress
        }).exec()
        //  Exec makes this query an full promise

        /*  Then get the result of the query. If the user evaluates to true, compare the input of the password field
         *   to the password of the user that has been found in the database.
         *   If the result equals to true, create a session
         *   Redirect to my profile, where the session can be used, if there is no session available there, the user
         *   will return to the login route.
         */
        .then((user) => {
            if (user) {

                // console.log(user.vluchtnummer)

                req.session.user = user.userName;
                req.session.firstName = user.firstName;
                req.session.offline = false
                res.redirect('/')

            }else{
                res.redirect('/login');
            }
        })
                // const stories = Story.find({}, (err, result) => {

                // }).exec()
            
                // stories.then((result) => {
                //     // console.log(result)
                //     if(req.session.user){
                //         User.findOne({userName:req.session.user}).then((userdata)=>{
                //             // var downloaded_stories = userdata.downloaded_stories;
                            
                //             // // console.log(downloaded_stories + "dit is eentest")

                //             // // var storyOverview = [downloaded_stories, all_stories];


                //             // res.render('home.ejs', {
                //             //     data: result,
                //             //     offline: req.session.offline,
                //             //     userdata: downloaded_stories
                //             // });
                            
                //             res.redirect('/');
                //         })
            
                //     }else{
                //         req.session.offline = true;
                //         res.redirect('/');
                //         // res.render('home.ejs', {
                //         //     // data: result,
                //         //     // offline: req.session.offline
                //         // });
                //     }
                // });
                // stories.catch((err) => {
                //     console.log('Followin error: ' + err);
                // });

                // return res.status(200).render('home.ejs', {
                //     offline: false,
                //     firstName: req.session.firstName
                // });
                // console.log(user)

                // bcryptjs.compare(req.body.password, user.password)
                //     .then((result) => {
                //         if (result === true) {
                //             console.log('nice, logged in');
                //             req.session.user = user.userName;
                //             req.session.firstName = user.firstName;
                //             console.log(req.session.user)

                //             console.log('sending to my profile');
                //             return res.status(200).redirect('/my-profile');
                //         } else if (result !== true) {

                //             req.session.customError = "Invalid Credentials";
                //             console.log(err)
                //             console.log('ik hoop dat je hier terecht komt')
                //             // reject(new Error('Could not be authenticated'));
                //             return res.render('/login')
                //         } else {
                //             throw 'errorrr';
                //         }

                //     }).catch((err) => {


                //         // let errors = req.validationErrors();
                //         // req.session.customError = "Invalid Credentials";
                //         // console.log(err)
                //         // console.log('ik hoop dat je hier terecht komt')
                //         // // reject(new Error('Could not be authenticated'));
                //         // return res.render('/login')
                //     })
            // }
            // else{
            //     // reject(new Error("User can't be found   "));
            // }
        // })
    // .catch((err)=>{
    //     console.log(err)
    // })

    // .then((result)=>{
    //     console.log(req.session.user)
    //     console.log('sending to my profile');
    //     res.send(req.session.user)

    //     // res.status(200).render('my-profile.ejs', {firstName:req.session.firstName});
    //     // return res.status(200).redirect('/my-profile');
    //     // console.log('send to profile')
    // })

    // Catch the error of the latest then. 
    // .catch((err) => {
    //     console.log(`Following error while attempting to login ${err.message}`);

    //     if (String(req.body.emailaddress).length !== 0) {
    //         let enteredEmail = req.session.emailaddress;
    //         res.render('register.ejs', {
    //             enteredEmail: enteredEmail
    //         });
    //     } else {
    //         res.render('register.ejs');
    //     }
    // })
});

module.exports = router;