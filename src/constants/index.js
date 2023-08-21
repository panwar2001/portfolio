// Contains constant data for using in website
// ! Don't remove anything from here if not sure

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  python,
  project1,
  project2,
  project3,
  project4,
  project5,
} from "../assets";

// Navbar Links
export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
  {
    id: "source-code",
    title: "linkedin",
    link: "https://www.linkedin.com/in/panwar2001/",
  },
];

// Services
const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

// Technologies
const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "python",
    icon: python,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

// Experiences
const experiences = [
  {
    title: "Software Development Engineer Intern",
    company_name: "Tally Solution Private Limited",
    icon: starbucks,
    iconBg: "#383E56",
    date: "Oct 2023 - Nov 2023",
    points: [
    ],
  },
  {
    title: "Technical Content writing intern",
    company_name: "GeeksforGeeks",
    icon: shopify,
    iconBg: "#383E56",
    date: "April 2023 - present",
    points: [
    ],
  },
];

// Testimonials
const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

// Projects
const projects = [
  {
    name: "TypeRacing",
    description:"This project was a part of tally code brewers 2023 hackathon , were i had a chance to develop and work on the project.",
    tags: [
      {
        name: "Vite react",
        color: "blue-text-gradient",
      },
      {
        name: "Express.js",
        color: "green-text-gradient",
      },
      {
        name: "Vercel",
        color: "pink-text-gradient",
      },
    ],
    image: project1,
    source_code_link: "https://github.com/panwar2001/typeRacing",
    live_site_link: "https://type-racing.vercel.app/",
  },
  {
    name: "DualMeet",
    description:
      "Implemented a web-based real-time end-to-end video calling between 2 client with a user interface similar to Google Meet.",
    tags: [
      {
        name: "Next.JS",
        color: "blue-text-gradient",
      },
      {
        name: "Express.JS",
        color: "green-text-gradient",
      },
      {
        name: "Vercel",
        color: "pink-text-gradient",
      },
    ],
    image: project2,
    source_code_link: "https://github.com/panwar2001",
    live_site_link: "https://dualmeet.vercel.app",
  },
  {
    name: "Android Weather App",
    description:
      "Developed a React Native Android Weather application following the principle of code component reusability.",
    tags: [
      {
        name: "React Native",
        color: "blue-text-gradient",
      },
      {
        name: "Playstore",
        color: "green-text-gradient",
      }
    ],
    image: project3,
    source_code_link:
      "https://github.com/panwar2001/Android-Weather-App",
    live_site_link: "https://play.google.com/store/apps/details?id=com.panwar2001.weather",
  },
  {
    name: "Youtube transcript Summarizer in different languages",
    description:
      "A Next.js Website that can fetch captions in different languages , summarize them in its language as well as english.",
    tags: [
      {
        name: "Next.JS",
        color: "blue-text-gradient",
      },
      {
        name: "Node.JS",
        color: "green-text-gradient",
      },
      {
        name: "Flask",
        color: "pink-text-gradient",
      },
    ],
    image: project4,
    source_code_link: "https://github.com/panwar2001/YouTube-Transcript-Summarizer-In-Different-Languages",
    live_site_link: "",
  },
  {
    name: "Deep Learning Digit Recognition",
    description:
      "The goal of the project was to implement a classifier using deep learning to predict digits using the MNIST handwritten dataset.",
    tags: [
      {
        name: "Python",
        color: "blue-text-gradient",
      }
    ],
    image: project5,
    source_code_link: "https://github.com/panwar2001/mnistTrain",
    live_site_link: "",
  }
];

export { services, technologies, experiences, testimonials, projects };
