// Sessions
app.get('/sessions/new', function(req, res) {
  res.render('sessions/new.ejs', {
    locals: { user: new app.models.User() },
    layout: true, title: 'AI Challenge - Bomberbot - Registro'
  });
});

app.post('/sessions', function(req, res) {
  models.User.findOne({ email: req.body.user.email }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      
      req.session.user = user;

      // Remember me
      if (req.body.remember_me) {
        var loginToken = new app.models.LoginToken({ email: user.email });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }
    } else {
      req.flash('error', 'Incorrect credentials');
      res.redirect('/sessions/new');
    }
  }); 
});

app.get('/sessions/end', app.util.loadUser, function(req, res) {
  if (req.session) {
    app.models.LoginToken.remove({ email: req.currentUser.email }, function() {});
    res.clearCookie('logintoken');
    req.session.destroy(function() {});
  }
  res.redirect('/sessions/new');
});