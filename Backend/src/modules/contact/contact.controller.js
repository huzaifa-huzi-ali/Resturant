const contactService = require('./contact.service');

const sendContactMessage = async (req, res, next) => {
  try { res.status(201).json(await contactService.send(req.body)); }
  catch (err) { next(err); }
};
const getContactMessages = async (req, res, next) => {
  try { 
    const { limit, offset } = req.query;
    res.json(await contactService.getAll(limit, offset)); 
  }
  catch (err) { next(err); }
};
const deleteContactMessage = async (req, res, next) => {
  try { await contactService.remove(req.params.id); res.json({ message: 'Contact message deleted' }); }
  catch (err) { next(err); }
};

module.exports = { sendContactMessage, getContactMessages, deleteContactMessage };
