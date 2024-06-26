module.exports = (req, res, next) => {
  res.locals.success_msg = req.flash('success')
  res.locals.error_msg = req.flash('error')
  res.locals.register_error_msg = req.flash('register_error')
  res.locals.register_success_msg = req.flash('register_success')
  next()
}
