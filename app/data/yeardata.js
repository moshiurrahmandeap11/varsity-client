export const yearData = [
  {
    id: "1st-year",
    year: "1st Year",
    title: "First Year Honours",
    icon: "BookOpen",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-400",
    description:
      "Introduction to Islamic History from Prophet Muhammad (sm) to the Umayyads and Abbasids",
    totalMarks: 600,
    totalCredits: 24,
    courses: [
      {
        courseCode: "1652",
        courseTitle:
          "History of Muslims (570-750, Prophet Muhammad (sm), Khulafa-i-Rashidun and the Umayyads)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1653",
        courseTitle:
          "History of Muslims (750-1258, The Abbasids and the Regional Dynasties)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1654",
        courseTitle: "History of Muslims in Spain (710-1492)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1655",
        courseTitle:
          "History of Muslim rule in Syria, Egypt and North Africa (Fatimids, Ayyubids and Mamluks)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "6203",
        courseTitle: "Introducing Sociology",
        marks: 100,
        credits: 4,
        note: "Or",
      },
      {
        courseCode: "6212",
        courseTitle: "Introduction to Social Work",
        marks: null,
        credits: null,
        note: "Alternative to 6203",
      },
      {
        courseCode: "6192",
        courseTitle: "Introduction to Political Theory",
        marks: 100,
        credits: 4,
      },
    ],
  },
  {
    id: "2nd-year",
    year: "2nd Year",
    title: "Second Year Honours",
    icon: "GraduationCap",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    textColor: "text-purple-400",
    description:
      "Advanced studies in Muslim rule in India, Bengal, and modern political systems",
    totalMarks: 550,
    totalCredits: 22,
    compulsoryCourse: {
      courseCode: "9999",
      courseTitle: "English (Compulsory)",
      marks: 100,
      credits: "Non-Credit",
    },
    courses: [
      {
        courseCode: "1662",
        courseTitle: "History of the Muslims in India (upto 1526)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1663",
        courseTitle: "History of Ancient Bengal (upto 1204)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1664",
        courseTitle: "History of Muslim rule in Bengal (1204-1757)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "7203",
        courseTitle: "Sociology of Bangladesh",
        marks: 100,
        credits: 4,
        note: "Or",
      },
      {
        courseCode: "7211",
        courseTitle: "Bangladesh Society and Culture",
        marks: null,
        credits: null,
        note: "Alternative to 7203",
      },
      {
        courseCode: "7192",
        courseTitle:
          "Political Organization and Political System of UK and USA",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1696",
        courseTitle: "Viva-Voce",
        marks: 50,
        credits: 2,
      },
    ],
  },
  {
    id: "3rd-year",
    year: "3rd Year",
    title: "Third Year Honours",
    icon: "BookOpen",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-400",
    description:
      "Specialization in Ottoman Empire, Modern Europe, Muslim Administration and World Civilizations",
    totalMarks: 800,
    totalCredits: 32,
    courses: [
      {
        courseCode: "1672",
        courseTitle:
          "History of the Muslims in Persia and Central Asia (13th - 18th century)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1673",
        courseTitle: "History of the Ottomans (upto 1924)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1674",
        courseTitle: "History of Bengal (1757-1947)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1675",
        courseTitle: "History of Modern Europe (Since 1789)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1676",
        courseTitle: "Muslim Minorities in the Contemporary World",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1677",
        courseTitle: "History of Muslim Administration (570-1258)",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1678",
        courseTitle: "History of World Civilizations",
        marks: 100,
        credits: 4,
      },
      {
        courseCode: "1679",
        courseTitle:
          "Development of Religious Principles, Institutions, Literature and Science in Islam",
        marks: 100,
        credits: 4,
      },
    ],
  },
];

// Helper function to get year by ID
export const getYearById = (yearId) => {
  return yearData.find((year) => year.id === yearId) || null;
};

// Helper function to get all years
export const getAllYears = () => {
  return yearData;
};

// Helper function to get total courses count for a year
export const getTotalCourses = (yearId) => {
  const year = getYearById(yearId);
  return year ? year.courses.length : 0;
};