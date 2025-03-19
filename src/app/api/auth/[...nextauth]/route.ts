import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { connectToDatabase } from '@/lib/database/connection';
import clientPromise from '@/lib/database/mongodb';
import bcrypt from 'bcryptjs';

import mongoose from 'mongoose';

interface IUser {
  name?: string;
  email: string;
  password: string;
  image?: string;
  createdAt: Date;
}

interface UserDocument extends IUser, Document {}

let User: mongoose.Model<UserDocument>;

try {
  User = mongoose.model<UserDocument>('User');
} catch {
  const UserSchema = new mongoose.Schema({
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

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }
        
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        
        if (!isValid) {
          return null;
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    // signUp: '/auth/signup',
    error: '/auth/error',
    newUser: '/profile',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };