const crypto = require('crypto');

let User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));



exports.getLogin = async (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    let user = await User.findOne({
      email: email
    });
    if (user) {
      try {
        let doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          await req.session.save();
          res.redirect('/');
        } else {
          req.flash('error', 'Invalid email');
          res.redirect('/login');
        }
      } catch (err) {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error')
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const {
      email,
      password,
      confirmPassword
    } = req.body;
    let userDoc = await User.findOne({
      email: email
    });
    if (userDoc) {
      req.flash('error', 'email already exists');
      return res.redirect('/signup');
    }
    let hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPassword
    });
    let result = await user.save();
    res.redirect('/login');
    await transporter.sendMail({
      to: email,
      from: 'shop@nodecomplete.com',
      subject: 'Signup succeeded',
      html: '<h1>Thank you for signing up!</h1>'
    });

  } catch (err) {
    console.log(err);
  }
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error')
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          reject("error generating token")
        }
        resolve(buffer);
      })
    })
    const token = buffer.toString('hex');
    let user = await User.findOne({
      email: req.body.email
    })
    if (!user) {
      req.flash('error', 'No account with that email found');
      res.redirect('/reset')
    } else {
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      res.redirect('/');
      await transporter.sendMail({
        to: req.body.email,
        from: 'shop@nodecomplete.com',
        subject: 'Reset Password',
        html: `
          <p>You requested a password reset</p>
          <p>Click this link<a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
      });
      console.log(token);
    }
  } catch (err) {
    console.log(err);
    req.flash('error', "Sorry, we can't reset your password at the moment, please try again later");
    res.redirect('/reset')
  }
}

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    let user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    })
    if (user) {
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: token
      });
    } else {
      req.flash('error', `Can't reset your password at the moment`);
      res.redirect('/signup');
    }
  } catch (err) {
    console.log(err)
  }
}

exports.postNewPassword = async (req, res, next) => {
  const {
    newPassword,
    userId,
    passwordToken
  } = req.body;
  try {
    let user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    })
    let hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save()
    res.redirect('/login');
  } catch (err) {
    console.log(err)
  }

}