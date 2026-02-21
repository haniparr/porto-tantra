const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const timelineData = [
  {
    year: "2018",
    company: "TechStart Inc.",
    role: "Junior Designer",
    achievements:
      "Spearheaded the redesign of internal tools, reducing user error rates by 40%. Collaborated with engineering to implement a new design system.",
  },
  {
    year: "2019",
    company: "Creative Agency X",
    role: "UI Designer",
    achievements:
      "Delivered award-winning websites for 5 top-tier clients. Optimization of asset pipelines improved page load speeds by 25%.",
  },
  {
    year: "2020",
    company: "Global Corp",
    role: "Senior Designer",
    achievements:
      "Led a cross-functional team of 10 in a complete brand refresh. Establish visually consistent guidelines adopted globally.",
  },
  {
    year: "2021",
    company: "Freelance",
    role: "Art Director",
    achievements:
      "Developed comprehensive visual identity strategies for startups, resulting in a collective $5M raised in seed funding.",
  },
  {
    year: "2022",
    company: "Design Studio Y",
    role: "Lead Product Designer",
    achievements:
      "Orchestrated the end-to-end UX/UI for a SaaS platform serving 50k+ users. improved customer retention by 15%.",
  },
];

const clientsData = [
  { name: "CocaCola" },
  { name: "USAID" },
  { name: "APLMA" },
  { name: "KIK" },
  { name: "Kemendikbud" },
  { name: "TechStart" },
  { name: "GlobalCorp" },
  { name: "Studio Y" },
];

async function main() {
  console.log("Start seeding Work Experiences...");
  for (let i = 0; i < timelineData.length; i++) {
    const data = timelineData[i];
    await prisma.workExperience.create({
      data: {
        company: data.company,
        role: data.role,
        year: data.year,
        achievements: data.achievements,
        order: i, // Maintain the original order
      },
    });
  }
  console.log("Work Experiences seeded!");

  console.log("Start seeding Clients...");
  for (let i = 0; i < clientsData.length; i++) {
    const data = clientsData[i];
    await prisma.client.create({
      data: {
        name: data.name,
        order: i,
      },
    });
  }
  console.log("Clients seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
