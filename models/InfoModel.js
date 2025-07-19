const mongoose = require('mongoose');

const InfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },

  // ✅ New field: Education history
 education: {
  tenth: {
    institution: { type: String, required: true },
    year: { type: String, required: true }
  },
  twelfth: {
    institution: { type: String, required: true },
    year: { type: String, required: true }
  },
  bachelors: {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true }
  },
  masters: {
    degree: { type: String, required: true }, // Made required
    institution: { type: String, required: true }, // Made required
    year: { type: String, required: true } // Made required
  },
  additional: [ // New field for additional qualifications
    {
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      year: { type: String, required: true },
      specialization: { type: String } // Optional field
    }
  ]
},
  // ✅ New field: Awards & Achievements
  awards: [
    {
      title: { type: String, required: true },
      description: { type: String },
      date: { type: Date }
    }
  ]

}, {
  timestamps: true
});

const InfoModel = mongoose.model('AdditionalInfo', InfoSchema);

module.exports = InfoModel;
