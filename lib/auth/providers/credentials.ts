import { prisma } from '@/lib/db/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

export const credentialsProvider = CredentialsProvider({
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' }
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Invalid credentials');
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user || !user.password) {
      throw new Error('User not found');
    }

    const isPasswordValid = await compare(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }
});