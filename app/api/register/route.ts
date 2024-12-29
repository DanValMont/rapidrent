import connectDB from '@/config/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// POST /api/register
export const POST = async (request: Request) => {
    try {
      await connectDB();
  
        const { username, email, password } = await request.json();

        const user = await User.findOne({ email });

  if (user) {
    return new Response("Email is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
        const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  return new Response("user is registered successfully", { status: 200 });
    } catch (error) {
      return new Response("Failed to register user", { status: 500 });
    }
  };

