import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Secure Authentication against Go Backend API with bcrypt verification
        try {
          const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8070/api/v1";
          const res = await fetch(`${apiURL}/admin/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          if (data && data.status && data.data && data.data.user) {
            return {
              id: data.data.user.id,
              name: data.data.user.full_name,
              email: data.data.user.email,
              role: data.data.user.role,
              token: data.data.token,
            } as any;
          }
        } catch (e) {
          console.error("[Auth] Security Notice: Backend authentication service unreachable:", e);
        }

        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours session expiration
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.accessToken = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: false,
};
