module.exports = {
  user: (app, req, res) => {
    req.assert('name', 'Name is required, min. 10 characters').notEmpty().isLength({ min: 10 })
    req.assert('email', 'Email is required').isEmail()
    req.assert('password', 'password is required').notEmpty().isLength({ min: 10 })

    const errors = req.validationErrors()

    if (errors) {
      app.utils.error.send(errors, req, res)
      return false
    } else {
      return true
    }
  }
}
