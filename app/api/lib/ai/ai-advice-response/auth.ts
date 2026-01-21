import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const jwt_secret = process.env.jwt_secret || "Your secret key";

  if (!token) return null;
  try {
    const decoded = jwt.verify(token, jwt_secret) as {
      first_name: string;
    };

    return decoded;
  } catch (error) {
    return null;
  }
}
