import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';
import { connectToDatabase } from '@/lib/database/connection';
import { errorResponse, successResponse } from '@/utils/api';

interface IUser {
  name?: string;
  email: string;
  password: string;
  image?: string;
  createdAt: Date;
}

interface UserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

let User: mongoose.Model<UserDocument>;

try {
  User = mongoose.model<UserDocument>('User');
} catch {
  const UserSchema = new Schema<UserDocument>({
    name: String,
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    image: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  User = mongoose.model<UserDocument>('User', UserSchema);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required', 400);
    }
    
    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
    }
    
    await connectToDatabase();
    
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return errorResponse('Email already in use', 409);
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    const userWithoutPassword = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    
    return successResponse(userWithoutPassword, 'User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    return errorResponse('Failed to create user', 500);
  }
}