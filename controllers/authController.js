module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = (req, res) => {
    const { username, password } = req.body;


  console.log(username, password);
  res.send('new signup');
}

module.exports.login_post = (req, res) => {
    const { username, password } = req.body;


 console.log(username, password);
 res.send('user login');

}
