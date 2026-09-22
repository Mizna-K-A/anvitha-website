const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        env[match[1]] = val;
      }
    });
    return env;
  } catch (e) {
    console.error('Error loading .env.local:', e);
    return {};
  }
}

const env = loadEnv();
const uri = env.MONGODB_URI;

if (!uri || uri.includes('your_username')) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Please configure a valid MONGODB_URI in your .env.local file first!');
  process.exit(1);
}

const initialContent = {
  products: [
    {
      title: "Enterprise CRM",
      description: "Streamline customer relationships with our intelligent CRM platform that grows with your business.",
      features: ["Sales Automation", "Customer Analytics", "Team Collaboration", "Mobile Ready"],
      image: "/crm.png"
    },
    {
      title: "Attendance Manager",
      description: "Efficiently track and manage attendance with our smart attendance system designed for organizations.",
      features: ["Real-time Tracking", "Automated Reports", "Multi-user Access", "Analytics Dashboard"],
      image: "/attendance.png"
    }
  ],
  
  clientProjects: [
    {
      title: "Luminar Academy",
      category: "web-apps",
      categoryLabel: "Web Application",
      tagline: "Empowering Next-Gen Learning",
      description: "A state-of-the-art interactive e-learning platform with smooth GSAP animations, course search/filtering, and dynamic dashboard tools.",
      image: "/luminarWebsite.png",
      features: [
        "Interactive course directory",
        "Responsive, high-fidelity UI design",
        "Optimized SEO & fast page load times",
        "Seamless registration flow"
      ],
      technologies: ["React", "Next.js", "GSAP", "TailwindCSS"],
      liveLink: "#"
    },
    {
      title: "Apex Retail",
      category: "ecommerce",
      categoryLabel: "E-Commerce",
      tagline: "Scalable Shopping Experience",
      description: "A lightning-fast digital storefront with custom cart drawer, real-time inventory management, and secure multi-currency checkout.",
      image: "/crm.png",
      features: [
        "Advanced product catalog with filters",
        "Mobile-first responsive shopping flow",
        "High performance metrics (95+ Lighthouse)",
        "Stripe payment integration"
      ],
      technologies: ["Next.js", "Stripe API", "PostgreSQL", "TailwindCSS"],
      liveLink: "#"
    },
    {
      title: "Zenith Agency",
      category: "corporate",
      categoryLabel: "Corporate & Creative",
      tagline: "Immersive Agency Showcase",
      description: "A premium corporate website featuring sophisticated parallax layouts and custom page transitions, reflecting the agency's creative power.",
      image: "/zmyt.png",
      features: [
        "Bespoke horizontal scrolling sections",
        "Custom GSAP micro-animations",
        "Interactive case study viewer",
        "Highly engaging contact portal"
      ],
      technologies: ["React", "GSAP", "Three.js", "TailwindCSS"],
      liveLink: "#"
    }
  ],

  services: [
    {
      title: "Web Development",
      category: "development",
      tagline: "Building Digital Excellence",
      description: "Custom web applications built with modern technologies and best practices for scalability and performance.",
      features: [
        "React/Next.js Development",
        "Full-Stack Solutions",
        "API Integration",
        "Progressive Web Apps",
        "E-commerce Platforms",
        "CMS Development"
      ],
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "PostgreSQL"],
      startingPrice: "$5,000",
      iconName: "Code"
    },
    {
      title: "UI/UX Design",
      category: "design",
      tagline: "Crafting Memorable Experiences",
      description: "User-centered design solutions that drive engagement, conversion, and brand loyalty through intuitive interfaces.",
      features: [
        "User Research & Testing",
        "Wireframing & Prototyping",
        "Design Systems",
        "Brand Identity",
        "Mobile-First Design",
        "Accessibility Standards"
      ],
      technologies: ["Figma", "Adobe XD", "Sketch", "Principle", "Framer"],
      startingPrice: "$3,000",
      iconName: "Palette"
    },
    {
      title: "Mobile Development",
      category: "development",
      tagline: "Native & Cross-Platform Apps",
      description: "High-performance mobile applications for iOS and Android that deliver seamless user experiences.",
      features: [
        "Native iOS & Android",
        "React Native Apps",
        "Flutter Development",
        "App Store Optimization",
        "Push Notifications",
        "Offline Functionality"
      ],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
      startingPrice: "$8,000",
      iconName: "Smartphone"
    },
    {
      title: "Digital Strategy",
      category: "strategy",
      tagline: "Data-Driven Growth",
      description: "Comprehensive digital transformation strategies that align technology with your business objectives.",
      features: [
        "Market Analysis",
        "Digital Roadmaps",
        "KPI Tracking",
        "Growth Hacking",
        "Conversion Optimization",
        "Analytics Setup"
      ],
      technologies: ["Google Analytics", "Hotjar", "SEMrush", "Mixpanel"],
      startingPrice: "$4,000",
      iconName: "Globe"
    },
    {
      title: "Cloud Solutions",
      category: "development",
      tagline: "Scalable Infrastructure",
      description: "Enterprise-grade cloud architecture and migration services for reliability, security, and performance.",
      features: [
        "AWS/Azure/GCP Setup",
        "Cloud Migration",
        "DevOps Implementation",
        "Container Orchestration",
        "Serverless Architecture",
        "Disaster Recovery"
      ],
      technologies: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
      startingPrice: "$10,000",
      iconName: "Cloud"
    },
    {
      title: "Consulting",
      category: "strategy",
      tagline: "Expert Guidance",
      description: "Strategic consulting to optimize your digital presence, streamline operations, and maximize ROI.",
      features: [
        "Technical Audits",
        "Process Optimization",
        "Team Training",
        "Best Practices",
        "Security Assessment",
        "Performance Review"
      ],
      technologies: ["Custom Analysis", "Industry Standards"],
      startingPrice: "$2,500",
      iconName: "Users"
    }
  ],

  about: {
    storyText: [
      "Founded in 2025, Anvitha emerged from a simple yet powerful vision: to bridge the gap between ambitious ideas and exceptional digital realities. We started as a small team of passionate technologists who believed that great software should be both beautiful and functional.",
      "Today, we're a growing family of creators, strategists, and innovators who share a common goal—empowering businesses to thrive in the digital age. Every project we undertake is an opportunity to push boundaries, challenge conventions, and deliver solutions that make a real difference.",
      "We're not just building applications; we're crafting experiences that resonate, inspire, and drive meaningful growth. From startups to enterprises, we partner with visionaries who dare to dream big."
    ],
    mission: "To empower businesses with innovative digital solutions that drive growth, enhance user experiences, and create lasting value. We're committed to delivering excellence in every project while fostering meaningful partnerships built on trust and transparency.",
    vision: "To become a global leader in digital transformation, recognized for our innovation, quality, and client success. We envision a future where technology seamlessly enhances human potential and businesses thrive through meaningful digital experiences.",
    stats: [
      { number: "2025", label: "Founded", iconName: "Sparkles" },
      { number: "50+", label: "Projects Delivered", iconName: "Award" },
      { number: "30+", label: "Happy Clients", iconName: "Heart" },
      { number: "15+", label: "Team Members", iconName: "Users" }
    ],
    values: [
      {
        iconName: "Lightbulb",
        title: "Innovation First",
        description: "We constantly push boundaries and embrace cutting-edge technologies to deliver solutions that are ahead of their time.",
        color: "from-blue-500 to-cyan-500"
      },
      {
        iconName: "Heart",
        title: "Client-Centric",
        description: "Your success is our success. We build lasting relationships by truly understanding and exceeding your expectations.",
        color: "from-pink-500 to-rose-500"
      },
      {
        iconName: "Target",
        title: "Excellence Driven",
        description: "We don't just meet standards—we set them. Every project reflects our commitment to exceptional quality.",
        color: "from-purple-500 to-indigo-500"
      },
      {
        iconName: "Shield",
        title: "Trust & Transparency",
        description: "Open communication and honest partnerships form the foundation of everything we do.",
        color: "from-green-500 to-emerald-500"
      },
      {
        iconName: "Rocket",
        title: "Agile & Adaptive",
        description: "In a rapidly evolving digital landscape, we stay flexible and responsive to deliver results that matter.",
        color: "from-orange-500 to-amber-500"
      },
      {
        iconName: "Users",
        title: "Collaborative Spirit",
        description: "Great ideas come from diverse perspectives. We foster teamwork and creative collaboration at every step.",
        color: "from-teal-500 to-cyan-500"
      }
    ],
    team: [
      {
        name: "Sarah Chen",
        role: "Founder & CEO",
        bio: "Visionary leader with 10+ years in digital transformation"
      },
      {
        name: "Michael Rodriguez",
        role: "Chief Technology Officer",
        bio: "Tech innovator passionate about scalable solutions"
      },
      {
        name: "Emily Watson",
        role: "Head of Design",
        bio: "Award-winning designer creating exceptional experiences"
      },
      {
        name: "David Kim",
        role: "Lead Developer",
        bio: "Full-stack expert building robust applications"
      }
    ]
  },
  contact: {
    email: "info@anvithainfotech.com",
    phone: "+91 903 709 5615",
    address: "Door No: 16/4117, 1st Floor, Vallamattam Estate, Opposite CZEZ, Seaport AirPort Road, Kakkanad, Ernakulam, 682037",
    companyName: "Anvitha Infotech OPC Pvt Ltd"
  }
};

async function main() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully. Initializing data seeding...');
    const dbName = new URL(uri).pathname.substring(1) || 'anvitha';
    const db = client.db(dbName);

    // Seed Website Content configuration
    const settingsCollection = db.collection('settings');
    
    // Clear and insert products
    console.log('Seeding products...');
    const productsCollection = db.collection('products');
    await productsCollection.deleteMany({});
    await productsCollection.insertMany(initialContent.products);

    // Clear and insert portfolio
    console.log('Seeding portfolio...');
    const portfolioCollection = db.collection('portfolio');
    await portfolioCollection.deleteMany({});
    await portfolioCollection.insertMany(initialContent.clientProjects);

    // Clear and insert services
    console.log('Seeding services...');
    const servicesCollection = db.collection('services');
    await servicesCollection.deleteMany({});
    await servicesCollection.insertMany(initialContent.services);

    // Clear and insert about section data
    console.log('Seeding about content...');
    const aboutCollection = db.collection('about');
    await aboutCollection.deleteMany({});
    await aboutCollection.insertOne(initialContent.about);

    // Clear and insert contact section data
    console.log('Seeding contact content...');
    const contactCollection = db.collection('contact');
    await contactCollection.deleteMany({});
    await contactCollection.insertOne(initialContent.contact);

    console.log('\x1b[32m%s\x1b[0m', 'Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await client.close();
  }
}

main();
