import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { name: "General Discussion", slug: "general", description: "General Arduino discussions and questions", icon: "message-circle" },
    { name: "Hardware Help", slug: "hardware", description: "Help with hardware issues, wiring, and components", icon: "cpu" },
    { name: "Software & Code", slug: "software", description: "Programming help, code review, and software issues", icon: "code" },
    { name: "Project Showcase", slug: "projects", description: "Share your Arduino projects with the community", icon: "star" },
    { name: "Components & Parts", slug: "components", description: "Discuss components, sensors, and parts", icon: "package" },
    { name: "Announcements", slug: "announcements", description: "Official announcements from the team", icon: "megaphone" },
    { name: "Team Recruitment", slug: "recruitment", description: "Find team members for your Arduino projects", icon: "users" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@arduinoforum.com" },
    update: {},
    create: { username: "admin", email: "admin@arduinoforum.com", passwordHash },
  });

  await prisma.team.upsert({
    where: { name: "Arduino Wizards" },
    update: {},
    create: { name: "Arduino Wizards", description: "A team of Arduino enthusiasts building amazing projects", emoji: "🧙", points: 5 },
  });

  console.log("Seed complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
