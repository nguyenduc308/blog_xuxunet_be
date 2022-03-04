const mongoose = require('mongoose');

module.exports = { 
  connectDB: async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/xuxunet');
      console.log('DB connected')
    } catch (e) {
      console.log('DB error occur', e);
      throw e;
    }
  }
}