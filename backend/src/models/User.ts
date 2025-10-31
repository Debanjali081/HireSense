const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

interface IUser {
  email: string;
  password?: string;
  name: string;
  provider?: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function(this: any) {
        return !this.provider; // Password required only if not OAuth user
      },
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'], // Add more providers as needed
      default: 'local',
    },
    providerId: {
      type: String,
      required: function(this: any) {
        return this.provider !== 'local'; // Required for OAuth users
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving (only for local users)
UserSchema.pre('save', async function (this: any, next: any) {
  const user = this;

  // Only hash the password if it has been modified (or is new) and user is local
  if (!user.isModified('password') || user.provider !== 'local') return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login (only for local users)
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password) return false; // OAuth users don't have passwords
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
