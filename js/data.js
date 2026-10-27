// Seed courses. Each lesson can have a YouTube "video" id and/or text "body".
window.SEED_COURSES = [
  {
    id: "html-basics",
    title: "HTML Fundamentals",
    level: "Beginner",
    instructor: "Asha Rao",
    color: "#0E7C7B",
    summary: "Learn how web pages are structured: tags, links, images, forms and semantic layout.",
    lessons: [
      { id: "l1", title: "HTML crash course (video)", video: "UB1O30fR-EE", body: "Watch the video, then try building a simple page with a heading, paragraph and image." },
      { id: "l2", title: "Tags, elements and attributes", body: "An element is an opening tag, content and a closing tag, e.g. <p>Hello</p>. Attributes add information, e.g. <a href=\"page.html\">Link</a>." },
      { id: "l3", title: "Forms and inputs", body: "Use <form>, <label>, <input> and <button>. Always connect a label to an input using the for and id attributes." }
    ],
    quiz: [
      { q: "Which tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
      { q: "Which element holds the main visible page content?", options: ["<head>", "<title>", "<body>", "<meta>"], answer: 2 },
      { q: "Which attribute gives an image alternative text?", options: ["title", "alt", "src", "name"], answer: 1 }
    ]
  },
  {
    id: "css-styling",
    title: "CSS Styling and Layout",
    level: "Beginner",
    instructor: "Kiran Mehta",
    color: "#F2B632",
    summary: "Make pages look great with selectors, the box model, flexbox, grid and responsive design.",
    lessons: [
      { id: "l1", title: "CSS crash course (video)", video: "yfoY53QXEnI", body: "Follow along and style the page you made in the HTML course." },
      { id: "l2", title: "The box model", body: "Every element is a box: content, padding, border, margin. Set box-sizing: border-box so width includes padding and border." },
      { id: "l3", title: "Flexbox and Grid", body: "Use display:flex for one-dimensional layouts and display:grid for two-dimensional layouts. Media queries make them responsive." }
    ],
    quiz: [
      { q: "Which property changes text color?", options: ["font-color", "text-color", "color", "foreground"], answer: 2 },
      { q: "Which value makes an element a flex container?", options: ["display:flex", "flex:container", "position:flex", "layout:flex"], answer: 0 },
      { q: "Which part of the box model is outside the border?", options: ["Padding", "Content", "Margin", "Outline-fill"], answer: 2 }
    ]
  },
  {
    id: "js-essentials",
    title: "JavaScript Essentials",
    level: "Intermediate",
    instructor: "Neha Iyer",
    color: "#7A5CFA",
    summary: "Add behavior to your pages: variables, functions, the DOM, events and fetch.",
    lessons: [
      { id: "l1", title: "JavaScript crash course (video)", video: "hdI2bqOjy3c", body: "Pause often and run the examples in your browser console." },
      { id: "l2", title: "The DOM and events", body: "document.querySelector selects elements. element.addEventListener('click', fn) runs code when a user clicks." },
      { id: "l3", title: "Fetch and JSON", body: "fetch(url) returns a promise. Use await response.json() to read JSON data from a cloud API." }
    ],
    quiz: [
      { q: "Which keyword declares a block-scoped variable you can reassign?", options: ["var", "let", "const", "static"], answer: 1 },
      { q: "Which method selects the first matching element?", options: ["getAll()", "querySelector()", "findOne()", "select()"], answer: 1 },
      { q: "What does fetch() return?", options: ["A string", "A number", "A Promise", "An array"], answer: 2 }
    ]
  },
  {
    id: "cloud-intro",
    title: "Introduction to Cloud Computing",
    level: "Beginner",
    instructor: "Rahul Verma",
    color: "#E4572E",
    summary: "Understand IaaS, PaaS, SaaS, deployment models and how web apps are hosted in the cloud.",
    lessons: [
      { id: "l1", title: "What is the cloud?", body: "Cloud computing delivers servers, storage, databases and software over the internet, on demand, and you pay for what you use." },
      { id: "l2", title: "IaaS, PaaS and SaaS", body: "IaaS gives virtual machines and networks (e.g. AWS EC2). PaaS gives a platform to run code (e.g. Firebase, Heroku). SaaS gives finished software (e.g. Gmail)." },
      { id: "l3", title: "Deploying a static site", body: "Static HTML/CSS/JS can be hosted on GitHub Pages, Netlify, Vercel, Firebase Hosting or AWS S3 + CloudFront." }
    ],
    quiz: [
      { q: "Gmail is an example of which model?", options: ["IaaS", "PaaS", "SaaS", "On-premise"], answer: 2 },
      { q: "AWS EC2 is mainly which model?", options: ["IaaS", "SaaS", "PaaS", "FaaS only"], answer: 0 },
      { q: "Which is a benefit of cloud computing?", options: ["Fixed hardware cost only", "On-demand scalability", "No internet needed", "Manual patching only"], answer: 1 }
    ]
  }
];
