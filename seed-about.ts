import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

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
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  console.log("Start seeding Work Experiences...");
  for (let i = 0; i < timelineData.length; i++) {
    const data = timelineData[i];
    await client.query(
      `INSERT INTO "WorkExperience" (id, company, role, year, achievements, "order", published, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [
        uuidv4(),
        data.company,
        data.role,
        data.year,
        data.achievements,
        i,
        true,
      ],
    );
  }
  console.log("Work Experiences seeded!");

  console.log("Start seeding Clients...");
  for (let i = 0; i < clientsData.length; i++) {
    const data = clientsData[i];
    await client.query(
      `INSERT INTO "Client" (id, name, logo, "order", published, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [uuidv4(), data.name, null, i, true],
    );
  }
  console.log("Clients seeded!");

  await client.end();
}

main().catch(console.error);
