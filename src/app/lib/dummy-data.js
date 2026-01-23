export const dummyProjects = [
  {
    id: "hardcoded-1",
    attributes: {
      slug: "beermut",
      title: "Beermut",
      subtitle: "Bringing fun to gatherings",
      tagline: "Bringing fun to gatherings.",
      thumbnail: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d25?auto=format&fit=crop&w=800&q=80",
          },
        },
      },
      credits: [
        { name: "Tantra Hariastama", role: "Art Director" },
        { name: "John Doe", role: "Developer" },
      ],
      sections: [
        {
          id: "overview",
          title: "Overview",
          description:
            "Beermut is a project focused on creating a vibrant and engaging brand identity for a modern beverage company. The goal was to capture the essence of fun and social gatherings.",
          images: [
            "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "challenge",
          title: "The Challenge",
          description:
            "The main challenge was to stand out in a saturated market while maintaining a playful yet professional appeal. We needed to design packaging that pops on the shelf.",
          images: [
            "https://images.unsplash.com/photo-1586996292898-71f40754595e?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          id: "solution",
          title: "The Solution",
          description:
            "We developed a bold color palette and quirky illustrations that resonate with the target audience. The result is a cohesive brand experience that invites consumers to celebrate.",
          images: [
            "https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=crop&w=1200&q=80",
          ],
        },
      ],
    },
  },
  {
    id: "hardcoded-2",
    attributes: {
      slug: "body-om",
      title: "Body Ōm",
      subtitle: "To elevate mood and awaken the senses",
      tagline: "To elevate mood and awaken the senses.",
      thumbnail: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
          },
        },
      },
      credits: [{ name: "Tantra H.", role: "Designer" }],
      sections: [
        {
          id: "overview",
          title: "Overview",
          description:
            "Body Ōm is a wellness brand designed to promote relaxation and mindfulness. The visual identity reflects calmness and balance.",
          images: [
            "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=1200&q=80",
          ],
        },
      ],
    },
  },
  {
    id: "hardcoded-3",
    attributes: {
      slug: "fapro",
      title: "Fapro",
      subtitle: "Every piece of data, a business opportunity",
      tagline: "Every piece of data, a business opportunity.",
      thumbnail: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
          },
        },
      },
      credits: [],
      sections: [
        {
          id: "overview",
          title: "Overview",
          description:
            "Fapro is a fintech solution that simplifies financial data management. We created a clean, trustworthy interface.",
          images: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          ],
        },
      ],
    },
  },
  {
    id: "hardcoded-4",
    attributes: {
      slug: "el-guarango",
      title: "El Guarango",
      subtitle: "This vermouth will bring you knowledge",
      tagline: "This vermouth will bring you knowledge.",
      thumbnail: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
          },
        },
      },
      credits: [],
      sections: [],
    },
  },
  {
    id: "hardcoded-5",
    attributes: {
      slug: "salta",
      title: "Salta",
      subtitle: "A gourmet snack for breaking routine",
      tagline: "A gourmet snack for breaking routine.",
      thumbnail: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
          },
        },
      },
      credits: [],
      sections: [],
    },
  },
  {
    id: "hardcoded-6",
    attributes: {
      slug: "pocho",
      title: "Pocho",
      subtitle: "Clothing to play and explore",
      tagline: "Clothing to play and explore.",
      thumbnail: {
        data: {
          attributes: {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
          },
        },
      },
      credits: [],
      sections: [],
    },
  },
];

export function getHardcodedProjects() {
  return dummyProjects;
}
