// DOM Elements
const internshipForm = document.getElementById("internshipForm");
const searchInput = document.querySelector('#searchInput');
const levelSelect = document.querySelector('#levelSelect');
const positionTypeSelect = document.querySelector('#positionType');
const searchButton = document.querySelector('#searchButton');
const locationSelect = document.querySelector("select.search-input");
const filterTags = document.querySelectorAll(".filter-tag");
const internshipGrid = document.querySelector(".internship-grid");
const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

// Internship Data
const internships = [
  {
    id: 1,
    title: "Software Development Intern",
    level: "Beginner",
    company: "Debo Engineering",
    location: "Remote/Onsite",
    duration: "6 months",
    type: "Unpaid", // or "Paid"
    category: "Technology",
    isNew: true,
    requirements: [
      "Basic programming knowledge",
      "Understanding of web technologies",
      "Willingness to learn",
    ],
    description: "Join our team as a beginner software development intern...",
    responsibilities: [
      "Learn and work with our development team",
      "Assist in basic coding tasks",
      "Participate in team meetings"
    ]
  },
  // Add more internship positions...
];

// Define developer levels
const developerLevels = [
  "Beginner",
  "Early Beginner",
  "Junior Developer",
  "Mid-Level Developer",
  "Senior Developer",
  "Tech Lead",
  "Expert Developer",
  "Master Developer"
];

// Filter State
let activeFilters = {
  search: "",
  location: "",
  categories: new Set(),
};

// Form Validation
const validateForm = (formData) => {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "Name is required";
  }

  if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = "Valid email is required";
  }

  if (!formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
    errors.phone = "Valid phone number is required";
  }

  if (!formData.education.trim()) {
    errors.education = "Education details are required";
  }

  if (!formData.resume) {
    errors.resume = "Resume is required";
  } else if (!formData.resume.name.toLowerCase().endsWith(".pdf")) {
    errors.resume = "Resume must be a PDF file";
  }

  if (!formData.coverLetter.trim()) {
    errors.coverLetter = "Cover letter is required";
  }

  return errors;
};

// Show Error Message
const showError = (inputElement, message) => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message text-danger mb-2";
  errorDiv.textContent = message;
  inputElement.parentNode.appendChild(errorDiv);
  inputElement.classList.add("error");
};

// Clear Error Messages
const clearErrors = () => {
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());
  document
    .querySelectorAll(".error")
    .forEach((input) => input.classList.remove("error"));
};

// Handle Form Submission
internshipForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const formData = {
    fullName: e.target.fullName.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
    education: e.target.education.value,
    resume: e.target.resume.files[0],
    coverLetter: e.target.coverLetter.value,
  };

  const errors = validateForm(formData);

  if (Object.keys(errors).length > 0) {
    // Display validation errors
    Object.entries(errors).forEach(([field, message]) => {
      const input = document.getElementById(field);
      showError(input, message);
    });
    return;
  }

  try {
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success message
    const successMessage = document.createElement("div");
    successMessage.className = "alert alert-success fade-in";
    successMessage.textContent = "Application submitted successfully!";
    internshipForm.insertBefore(successMessage, internshipForm.firstChild);

    // Reset form
    e.target.reset();

    // Remove success message after 5 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  } catch (error) {
    // Error handling
    const errorMessage = document.createElement("div");
    errorMessage.className = "alert alert-danger fade-in";
    errorMessage.textContent =
      "Error submitting application. Please try again.";
    internshipForm.insertBefore(errorMessage, internshipForm.firstChild);
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

// Filter Internships
const filterInternships = () => {
  const filtered = internships.filter((internship) => {
    const matchesSearch =
      internship.title
        .toLowerCase()
        .includes(activeFilters.search.toLowerCase()) ||
      internship.company
        .toLowerCase()
        .includes(activeFilters.search.toLowerCase());
    const matchesLocation =
      !activeFilters.location || internship.location === activeFilters.location;
    const matchesCategory =
      activeFilters.categories.size === 0 ||
      activeFilters.categories.has(internship.category);

    return matchesSearch && matchesLocation && matchesCategory;
  });

  renderInternships(filtered);
};

// Render Internships
const renderInternships = (internships) => {
  if (!internshipGrid) {
    console.error('Internship grid element not found');
    return;
  }

  if (internships.length === 0) {
    internshipGrid.innerHTML = `
      <div class="no-results">
        <h3>No internships found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    `;
    return;
  }

  internshipGrid.innerHTML = internships
    .map(
      (internship) => `
        <div class="internship-card slide-up">
            ${internship.isNew ? '<span class="card-badge">New</span>' : ""}
            <h3>${internship.title}</h3>
            <p class="company">${internship.company}</p>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${
              internship.location
            }</p>
            <p class="duration"><i class="far fa-clock"></i> ${
              internship.duration
            }</p>
            <p class="stipend"><i class="fas fa-money-bill-wave"></i> ${
              internship.stipend
            }</p>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="applyForInternship(${
                  internship.id
                })">Apply Now</button>
                <button class="btn btn-secondary" onclick="viewDetails(${
                  internship.id
                })">View Details</button>
            </div>
        </div>
    `
    )
    .join("");
};

// Search and Filter Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements
  const searchInput = document.querySelector('#searchInput');
  const locationSelect = document.querySelector('#locationSelect');
  const searchButton = document.querySelector('#searchButton');
  const filterTags = document.querySelectorAll('.filter-tag');
  const internshipGrid = document.querySelector('.internship-grid');
  const hamburger = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  // Internship Data
  const internships = [
    {
      id: 1,
      title: "Software Development Intern",
      level: "Beginner",
      company: "Debo Engineering",
      location: "Remote/Onsite",
      duration: "6 months",
      type: "Unpaid", // or "Paid"
      category: "Technology",
      isNew: true,
      requirements: [
        "Basic programming knowledge",
        "Understanding of web technologies",
        "Willingness to learn",
      ],
      description: "Join our team as a beginner software development intern...",
      responsibilities: [
        "Learn and work with our development team",
        "Assist in basic coding tasks",
        "Participate in team meetings"
      ]
    },
    {
      id: 2,
      title: "Marketing Intern",
      company: "Digital Marketing Pro",
      location: "Remote",
      duration: "6 months",
      stipend: "$1500/month",
      category: "Marketing",
      isNew: false,
      requirements: [
        "Marketing or Business major",
        "Experience with social media platforms",
        "Creative mindset",
      ],
    },
    {
      id: 3,
      title: "UI/UX Design Intern",
      company: "Creative Solutions",
      location: "San Francisco, CA",
      duration: "4 months",
      stipend: "$2200/month",
      category: "Design",
      isNew: true,
      requirements: [
        "Design background",
        "Proficiency in Figma or Adobe XD",
        "Understanding of user-centered design",
      ],
    },
  ];

  // Filter State
  let activeFilters = {
    search: "",
    location: "",
    categories: new Set(),
  };

  // Render Internships
  const renderInternships = (internships) => {
    if (!internshipGrid) return;

    if (internships.length === 0) {
      internshipGrid.innerHTML = `
        <div class="no-results">
          <h3>No internships found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    internshipGrid.innerHTML = internships
      .map(
        (internship) => `
          <div class="internship-card slide-up">
              ${internship.isNew ? '<span class="card-badge">New</span>' : ""}
              <h3>${internship.title}</h3>
              <p class="company">${internship.company}</p>
              <p class="location"><i class="fas fa-map-marker-alt"></i> ${internship.location}</p>
              <p class="duration"><i class="far fa-clock"></i> ${internship.duration}</p>
              <p class="stipend"><i class="fas fa-money-bill-wave"></i> ${internship.stipend}</p>
              <div class="card-actions">
                  <button class="btn btn-primary" onclick="applyForInternship(${internship.id})">Apply Now</button>
                  <button class="btn btn-secondary" onclick="viewDetails(${internship.id})">View Details</button>
              </div>
          </div>
      `
      )
      .join("");
  };

  // Search functionality
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  // Add enter key support for search
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // Perform search function
  const performSearch = () => {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedLevel = levelSelect ? levelSelect.value : '';
    const selectedType = positionTypeSelect ? positionTypeSelect.value : '';

    const filteredPositions = internships.filter(position => {
      const matchesSearch = 
        position.title.toLowerCase().includes(searchTerm) ||
        position.company.toLowerCase().includes(searchTerm) ||
        position.description.toLowerCase().includes(searchTerm);

      const matchesLevel = 
        !selectedLevel || 
        position.level === selectedLevel;

      const matchesType = 
        !selectedType || 
        position.type === selectedType;

      return matchesSearch && matchesLevel && matchesType;
    });

    renderPositions(filteredPositions);
    updateResultsCount(filteredPositions.length);
  };

  // Render positions function
  const renderPositions = (positions) => {
    const internshipGrid = document.querySelector('.internship-grid');
    if (!internshipGrid) return;

    if (positions.length === 0) {
      internshipGrid.innerHTML = `
        <div class="no-results">
          <h3>No positions found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    internshipGrid.innerHTML = positions.map(position => `
      <div class="internship-card">
        ${position.isNew ? '<span class="card-badge">New</span>' : ''}
        <h3>${position.title}</h3>
        <p class="company">${position.company}</p>
        <div class="position-details">
          <span class="level-badge ${position.level.toLowerCase()}">${position.level}</span>
          <span class="type-badge ${position.type.toLowerCase()}">${position.type}</span>
        </div>
        <p class="location"><i class="fas fa-map-marker-alt"></i> ${position.location}</p>
        <p class="duration"><i class="far fa-clock"></i> ${position.duration}</p>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="applyForPosition(${position.id})">Apply Now</button>
          <button class="btn btn-secondary" onclick="viewDetails(${position.id})">View Details</button>
        </div>
      </div>
    `).join('');
  };

  // Update results count
  const updateResultsCount = (count) => {
    const resultsSection = document.querySelector('#internships h2');
    if (resultsSection) {
      resultsSection.textContent = `Available Positions (${count})`;
    }
  };

  // Event Listeners
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  if (locationSelect) {
    locationSelect.addEventListener('change', performSearch);
  }

  if (filterTags) {
    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const category = tag.textContent;
        tag.classList.toggle('active');
        
        if (activeFilters.categories.has(category)) {
          activeFilters.categories.delete(category);
        } else {
          activeFilters.categories.add(category);
        }
        
        performSearch();
      });
    });
  }

  // Mobile menu functionality
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });

  // Close mobile menu when window is resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });

  // Initial render
  renderInternships(internships);

  // Admin Login
  const adminLoginBtn = document.querySelector('#adminLoginBtn');
  const adminPanel = document.querySelector('#adminPanel');
  
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
      // In production, this should be a proper login form
      const password = prompt('Enter admin password:');
      if (password === 'admin123') { // This should be proper authentication in production
        adminPanel.style.display = 'block';
        adminLoginBtn.style.display = 'none';
      } else {
        alert('Invalid password');
      }
    });
  }

  // Add Position Form
  const addPositionBtn = document.querySelector('#addPositionBtn');
  const addPositionForm = document.querySelector('#addPositionForm');
  const positionForm = document.querySelector('#positionForm');

  if (addPositionBtn) {
    addPositionBtn.addEventListener('click', () => {
      addPositionForm.style.display = 'flex';
    });
  }

  if (positionForm) {
    positionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        title: e.target.positionTitle.value,
        level: e.target.positionLevel.value,
        type: e.target.positionType.value,
        description: e.target.positionDescription.value,
        requirements: e.target.positionRequirements.value.split('\n'),
      };
      
      // Add new position to internships array
      const newPosition = {
        id: internships.length + 1,
        ...formData,
        isNew: true,
        company: 'Debo Engineering',
        location: 'Remote/Onsite',
      };
      
      internships.push(newPosition);
      renderInternships(internships);
      addPositionForm.style.display = 'none';
      e.target.reset();
    });
  }

  // View Applications
  const viewApplicationsBtn = document.querySelector('#viewApplicationsBtn');
  const applicationsPanel = document.querySelector('#applicationsPanel');
  
  if (viewApplicationsBtn) {
    viewApplicationsBtn.addEventListener('click', () => {
      applicationsPanel.style.display = 'block';
      loadApplications();
    });
  }

  // Load and render applications
  const loadApplications = () => {
    const applicationsList = document.querySelector('.applications-list');
    if (!applicationsList) return;

    // This would normally fetch from a backend
    const applications = [
      {
        id: 1,
        name: 'John Doe',
        position: 'Software Development Intern',
        level: 'Beginner',
        status: 'pending',
        appliedDate: '2024-03-20',
      },
      // Add more mock applications...
    ];

    applicationsList.innerHTML = applications.map(app => `
      <div class="application-card">
        <h4>${app.name}</h4>
        <p>${app.position} - ${app.level}</p>
        <p>Applied: ${app.appliedDate}</p>
        <span class="application-status status-${app.status}">${app.status}</span>
        <div class="card-actions">
          <button class="btn btn-primary" onclick="reviewApplication(${app.id})">Review</button>
        </div>
      </div>
    `).join('');
  };

  // Classification button
  const classifyInternsBtn = document.querySelector('#classifyInternsBtn');
  if (classifyInternsBtn) {
    classifyInternsBtn.addEventListener('click', () => {
      document.querySelector('#classificationPanel').style.display = 'block';
      loadInternsList();
    });
  }

  // Report generation
  const generateReportBtn = document.querySelector('#generateReportBtn');
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', () => {
      const report = adminFunctions.generateReport('applications');
      displayReport(report);
    });
  }

  // Initialize admin vacancy management
  adminVacancyManagement.init();
});

// View Internship Details
const viewDetails = (internshipId) => {
  const internship = internships.find((i) => i.id === internshipId);
  if (!internship) return;

  const modal = document.createElement("div");
  modal.className = "modal fade-in";
  modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${internship.title}</h2>
            <p class="company">${internship.company}</p>
            <div class="details">
                <p><strong>Location:</strong> ${internship.location}</p>
                <p><strong>Duration:</strong> ${internship.duration}</p>
                <p><strong>Stipend:</strong> ${internship.stipend}</p>
            </div>
            <div class="requirements">
                <h3>Requirements:</h3>
                <ul>
                    ${internship.requirements
                      .map((req) => `<li>${req}</li>`)
                      .join("")}
                </ul>
            </div>
            <button class="btn btn-primary" onclick="applyForInternship(${
              internship.id
            })">Apply Now</button>
        </div>
    `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.remove();
    };
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  };
};

// Apply for Internship
const applyForInternship = (internshipId) => {
  const internship = internships.find((i) => i.id === internshipId);
  if (!internship) return;

  // Scroll to application form
  const applySection = document.querySelector('#apply');
  if (applySection) {
    applySection.scrollIntoView({ behavior: 'smooth' });
  }

  // Update form title
  const formTitle = document.querySelector('#apply h2');
  if (formTitle) {
    formTitle.textContent = `Apply for ${internship.title} at ${internship.company}`;
  }

  // Pre-fill hidden field
  const internshipForm = document.querySelector('#internshipForm');
  if (internshipForm) {
    let positionField = internshipForm.querySelector('input[name="position"]');
    if (!positionField) {
      positionField = document.createElement('input');
      positionField.type = 'hidden';
      positionField.name = 'position';
      internshipForm.appendChild(positionField);
    }
    positionField.value = internship.title;
  }
};

// Make sure these functions are in the global scope
window.viewDetails = viewDetails;
window.applyForInternship = applyForInternship;

// Update the modal styles
const addModalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }
    
    .close {
      position: absolute;
      right: 1rem;
      top: 1rem;
      font-size: 1.5rem;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
};

// Add modal styles when the page loads
document.addEventListener('DOMContentLoaded', addModalStyles);

// Update the filter tags to match developer levels
const updateFilterTags = () => {
  const filterTagsContainer = document.querySelector('.filter-tags');
  if (filterTagsContainer) {
    filterTagsContainer.innerHTML = developerLevels
      .map(level => `<span class="filter-tag">${level}</span>`)
      .join('');
  }
};

// Add to global scope
window.reviewApplication = (applicationId) => {
  // This would open a detailed review modal
  alert(`Reviewing application ${applicationId}`);
};

// Add admin functionality
const adminFunctions = {
  // Classify intern based on profile
  classifyIntern: (profile) => {
    const {
      experience,
      skills,
      education,
      projects
    } = profile;
    
    // Classification logic based on Gada system
    if (experience < 1) return "Beginner";
    if (experience < 2) return "Early Beginner";
    if (experience < 3) return "Junior Developer";
    // ... continue classification logic
  },

  // Generate reports
  generateReport: (type) => {
    const reports = {
      applications: {
        total: applications.length,
        byLevel: groupBy(applications, 'level'),
        byStatus: groupBy(applications, 'status')
      },
      hiring: {
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        pending: applications.filter(app => app.status === 'pending').length
      }
    };
    return reports[type];
  },

  // Review application
  reviewApplication: (applicationId, decision) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    application.status = decision;
    // Send email notification
    sendNotification(application.email, decision);
  }
};

// Helper function to group arrays
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

// Display report function
const displayReport = (report) => {
  const reportSection = document.createElement('div');
  reportSection.className = 'report-section';
  reportSection.innerHTML = `
    <h3>Application Report</h3>
    <div class="report-summary">
      <p>Total Applications: ${report.total}</p>
      <div class="report-chart">
        <!-- Add chart visualization here -->
      </div>
    </div>
  `;
  document.querySelector('#adminPanel').appendChild(reportSection);
};

// Update the applyForPosition function
window.applyForPosition = (positionId) => {
  const position = internships.find(p => p.id === positionId);
  if (!position) return;

  // Scroll to application form
  const applySection = document.querySelector('#apply');
  if (applySection) {
    applySection.scrollIntoView({ behavior: 'smooth' });
  }

  // Pre-fill position details
  const formTitle = document.querySelector('#apply h2');
  if (formTitle) {
    formTitle.textContent = `Apply for ${position.title}`;
  }

  // Pre-select developer level if it matches
  const levelSelect = document.querySelector('#developerLevel');
  if (levelSelect) {
    levelSelect.value = position.level;
  }

  // Pre-select application type
  const typeSelect = document.querySelector('#applicationType');
  if (typeSelect) {
    typeSelect.value = position.type.includes('Internship') ? 'internship' : 'fulltime';
  }
};

// Update the adminVacancyManagement object
const adminVacancyManagement = {
    // ... existing code ...

    saveVacancy: async (vacancyData) => {
        try {
            const response = await fetch('/api/vacancies.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vacancyData)
            });
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            adminVacancyManagement.loadVacancies();
        } catch (error) {
            alert('Error saving vacancy: ' + error.message);
        }
    },

    loadVacancies: async () => {
        try {
            const response = await fetch('/api/vacancies.php');
            const vacancies = await response.json();
            if (vacancies.error) {
                throw new Error(vacancies.error);
            }
            renderVacancies(vacancies);
        } catch (error) {
            alert('Error loading vacancies: ' + error.message);
        }
    }
};

// Update application submission
const submitApplication = async (formData) => {
    try {
        const response = await fetch('/api/applications.php', {
            method: 'POST',
            body: formData // FormData handles file uploads
        });
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        alert('Application submitted successfully!');
        window.location.href = '#home';
    } catch (error) {
        alert('Error submitting application: ' + error.message);
    }
};

// Update the fetch calls in your JavaScript
const api = {
    // Get vacancies
    getVacancies: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/vacancies.php?${queryString}`);
        return response.json();
    },

    // Add vacancy
    addVacancy: async (data) => {
        const response = await fetch('/api/vacancies.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    // Submit application
    submitApplication: async (formData) => {
        const response = await fetch('/api/applications.php', {
            method: 'POST',
            body: formData
        });
        return response.json();
    },

    // Get applications (admin only)
    getApplications: async (filters = {}) => {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/applications.php?${queryString}`);
        return response.json();
    },

    // Update application status (admin only)
    updateApplicationStatus: async (id, status) => {
        const response = await fetch('/api/applications.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, status })
        });
        return response.json();
    }
};
