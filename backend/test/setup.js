const mongoose = require('mongoose');

exports.mochaHooks = {
  async beforeAll() {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/notes_app_test');
    } catch (error) {
      console.error('Failed to set up test database:', error);
      throw error;
    }
  },
  async afterAll() {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    } catch (error) {
      console.error('Failed to tear down test database:', error);
      throw error;
    }
  },
  async afterEach() {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    } catch (error) {
      console.error('Failed to clean up collections:', error);
      throw error;
    }
  },
};