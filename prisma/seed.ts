import prisma from '../app/lib/prisma';
import { createHash } from 'crypto';


function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  try {
    // Check if admin already exists
    const adminExists = await prisma.presUser.findUnique({
      where: { email: "seanimayi@gmail.com" },
    });

    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = hashPassword("Codex@22224");
    const admin = await prisma.presUser.create({
      data: {
        first_name: "Sean",
        last_name: "Imayi",
        email: "seanimayi@gmail.com",
        password: hashedPassword,
      },
    });

    console.log("Admin user created successfully:", admin);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
