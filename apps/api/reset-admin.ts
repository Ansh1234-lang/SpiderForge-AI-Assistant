import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = "SpiderForge@2026!";

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: {
      email: "admin@spiderforge.ai",
    },
    data: {
      password: hashedPassword,
    },
  });

  console.log("✅ Password updated successfully");
  console.log("Email:", "admin@spiderforge.ai");
  console.log("Password:", password);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });