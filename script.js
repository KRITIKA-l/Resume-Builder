const projectsContainer = document.getElementById('projects');
const educationContainer = document.getElementById('education');
const skillsContainer = document.getElementById('skills');
const experienceContainer = document.getElementById('experience');
const certificationsContainer = document.getElementById('certifications');
const contactList = document.getElementById('contact-list');
const form = document.getElementById('resume-form');
const resetButton = document.getElementById('reset-btn');
const printButton = document.getElementById('print-btn');
const nameHeading = document.getElementById('name');
const skillsForm = document.getElementById('skills-form');
const certificationsForm = document.getElementById('certifications-form');
const projectsForm = document.getElementById('projects-form');
const experienceForm = document.getElementById('experience-form');
const educationForm = document.getElementById('education-form');
const storageKey = 'resume-builder-state';

const iconPaths = {
  email: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5',
  phone: 'M8.5 3.5h3l1.1 5-2 1.8a12 12 0 0 0 5.1 5.1l1.8-2 5 1.1v3a2 2 0 0 1-2 2C12.3 19.5 4.5 11.7 4.5 5.5a2 2 0 0 1 2-2Z',
  linkedin: 'M7 8v12M7 5.2v.6M11 20V8h4v1.9c.6-1.1 1.9-2.2 4-2.2 2.8 0 4 1.8 4 5V20',
  github: 'M12 3a9 9 0 0 0-2.8 17.5c.4.1.5-.2.5-.4v-1.5c-2.1.5-2.6-1-2.6-1-.4-1-.9-1.3-.9-1.3-.8-.6.1-.6.1-.6.9.1 1.4 1 1.4 1 .8 1.4 2.1 1 2.7.8.1-.6.3-1 .6-1.2-1.7-.2-3.5-.9-3.5-4.1 0-.9.3-1.6.9-2.2-.1-.2-.4-1 .1-2.1 0 0 .8-.3 2.5 1a8.6 8.6 0 0 1 4.6 0c1.7-1.3 2.5-1 2.5-1 .5 1.1.2 1.9.1 2.1.6.6.9 1.3.9 2.2 0 3.2-1.8 3.9-3.5 4.1.3.3.6.8.6 1.6v2.3c0 .2.1.5.5.4A9 9 0 0 0 12 3Z',
  calendar: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z'
};

const initialState = () => ({
  contact: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: ''
  },
  education: [
    {
      degree: '',
      institute: '',
      duration: '',
      location: ''
    }
  ],
  experience: [
    {
      title: '',
      company: '',
      duration: '',
      location: '',
      bullets: ['']
    }
  ],
  skills: [
    { category: '', skills: [''] }
  ],
  certifications: [
    { title: '', url: '' }
  ],
  projects: [
    {
      name: '',
      tech: '',
      liveUrl: '',
      githubUrl: '',
      bullets: ['']
    }
  ]
});

function loadState() {
  const fallback = initialState();

  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return fallback;

    const parsed = JSON.parse(saved);
    return {
      ...fallback,
      ...parsed,
      contact: { ...fallback.contact, ...(parsed.contact || {}) },
      education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : fallback.education,
      experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : fallback.experience,
      skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : fallback.skills,
      certifications: Array.isArray(parsed.certifications) && parsed.certifications.length ? parsed.certifications : fallback.certifications,
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : fallback.projects
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Ignore storage failures, such as private mode or quota limits.
  }
}

const state = loadState();

function splitLines(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitFlexible(value) {
  return value.includes('\n') ? splitLines(value) : splitList(value);
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  return trimmed ? trimmed : '';
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function safeUrl(url) {
  const value = normalizeUrl(url);
  if (!value) return '';
  if (isValidUrl(value)) return value;
  if (value.startsWith('mailto:') || value.startsWith('tel:')) return value;
  return `https://${value.replace(/^https?:\/\//, '')}`;
}

function renderContact() {
  const items = [
    { key: 'email', href: state.contact.email ? `mailto:${state.contact.email}` : '', label: state.contact.email },
    { key: 'phone', href: state.contact.phone ? `tel:${state.contact.phone.replace(/[^\d+]/g, '')}` : '', label: state.contact.phone },
    { key: 'linkedin', href: safeUrl(state.contact.linkedin), label: state.contact.linkedin.replace(/^https?:\/\//, '') },
    { key: 'github', href: safeUrl(state.contact.github), label: state.contact.github.replace(/^https?:\/\//, '') }
  ].filter((item) => item.label);

  contactList.innerHTML = items
    .map(
      (item) => `
        <li>
          <a href="${item.href}"${item.key === 'linkedin' || item.key === 'github' ? ' target="_blank" rel="noreferrer"' : ''}>
            <svg class="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="${iconPaths[item.key]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span>${item.label}</span>
          </a>
        </li>
      `
    )
    .join('');
}

function renderEducation() {
  const items = state.education.filter((item) => item.degree || item.institute || item.duration || item.location);
  educationContainer.innerHTML = items
    .map(
      (item) => `
        <div class="entry">
          <h3>${item.degree}</h3>
          <p>${item.institute}</p>
          <div class="meta meta-with-icon">
            ${item.duration ? `
              <svg class="meta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="${iconPaths.calendar}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span>${item.duration}</span>
            ` : ''}
            ${item.duration && item.location ? '<span class="meta-separator">|</span>' : ''}
            ${item.location ? `<span>${item.location}</span>` : ''}
          </div>
        </div>
      `
    )
    .join('');
}

function renderSkills() {
  const items = state.skills.filter((group) => group.category || group.skills.some(Boolean));
  skillsContainer.innerHTML = items
    .map(
      (group) => `
        <div class="skill-group">
          <h3>${group.category}</h3>
          <div class="skill-tags">
            ${group.skills.filter(Boolean).map((skill) => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      `
    )
    .join('');
}

function renderExperience() {
  const items = state.experience.filter((item) => item.title || item.company || item.duration || item.location || (item.bullets && item.bullets.some(Boolean)));

  if (!items.length) {
    experienceContainer.innerHTML = '';
    return;
  }

  experienceContainer.innerHTML = items
    .map(
      (item) => `
        <div class="entry">
          <h3>${item.title}</h3>
          <p>${item.company}</p>
          <div class="meta">${item.duration}${item.duration && item.location ? ' | ' : ''}${item.location}</div>
          <ul class="bullets">
            ${(item.bullets || []).filter(Boolean).map((point) => `<li>${point}</li>`).join('')}
          </ul>
        </div>
      `
    )
    .join('');
}

function renderCertifications() {
  const items = state.certifications.filter((item) => item.title.trim());
  certificationsContainer.innerHTML = items
    .map((item) => {
      const url = safeUrl(item.url);
      return `<li>${url ? `<a href="${url}" target="_blank" rel="noreferrer">${item.title}</a>` : item.title}</li>`;
    })
    .join('');
}

function renderProjects() {
  const items = state.projects.filter((project) => project.name.trim() || project.tech.trim() || project.bullets.some(Boolean));
  projectsContainer.innerHTML = items
    .map((project) => {
      const links = [];
      const liveUrl = safeUrl(project.liveUrl);
      const githubUrl = safeUrl(project.githubUrl);

      if (liveUrl) {
        links.push(`<a href="${liveUrl}" target="_blank" rel="noreferrer">Live demo</a>`);
      }
      if (githubUrl) {
        links.push(`<a href="${githubUrl}" target="_blank" rel="noreferrer">GitHub</a>`);
      }

      return `
        <article class="project-item">
          <h3>${project.name}</h3>
          <div class="project-tech">${project.tech}</div>
          ${links.length ? `<div class="project-links">${links.join(' | ')}</div>` : ''}
          <ul class="bullets">
            ${project.bullets.filter(Boolean).map((point) => `<li>${point}</li>`).join('')}
          </ul>
        </article>
      `;
    })
    .join('');
}

function renderRepeatableForms() {
  educationForm.innerHTML = state.education
    .map(
      (item, index) => `
        <div class="repeat-card repeatable-item repeat-card-compact">
          <button type="button" class="remove-btn" data-remove="education" data-index="${index}">Remove</button>
          <div class="grid-2">
            <label>School / degree<input data-list="education" data-index="${index}" data-field="degree" value="${item.degree}" placeholder="Degree / class"></label>
            <label>Institute<input data-list="education" data-index="${index}" data-field="institute" value="${item.institute}" placeholder="School / college name"></label>
          </div>
          <div class="grid-2">
            <label>Dates<input data-list="education" data-index="${index}" data-field="duration" value="${item.duration}" placeholder="Start - End"></label>
            <label>Location<input data-list="education" data-index="${index}" data-field="location" value="${item.location}" placeholder="City, State"></label>
          </div>
        </div>
      `
    )
    .join('');

  skillsForm.innerHTML = state.skills
    .map(
      (group, index) => `
        <div class="repeat-card repeatable-item">
          <button type="button" class="remove-btn" data-remove="skill" data-index="${index}">Remove</button>
          <div class="grid-2">
            <label>Skill category<input data-list="skills" data-index="${index}" data-field="category" value="${group.category}" placeholder="Example: Programming Languages"></label>
            <label>Skills (comma or line separated)<textarea data-list="skills" data-index="${index}" data-field="skills" rows="3" placeholder="C/C++\nJavaScript\nPython">${group.skills.join('\n')}</textarea></label>
          </div>
        </div>
      `
    )
    .join('');

  certificationsForm.innerHTML = state.certifications
    .map(
      (item, index) => `
        <div class="repeat-card repeatable-item">
          <button type="button" class="remove-btn" data-remove="certificate" data-index="${index}">Remove</button>
          <label>Certificate title<input data-list="certifications" data-index="${index}" data-field="title" value="${item.title}" placeholder="Certificate name"></label>
          <label>Certificate URL (optional)<input data-list="certifications" data-index="${index}" data-field="url" value="${item.url}" placeholder="https://..."></label>
        </div>
      `
    )
    .join('');

  projectsForm.innerHTML = state.projects
    .map(
      (item, index) => `
        <div class="repeat-card repeatable-item">
          <button type="button" class="remove-btn" data-remove="project" data-index="${index}">Remove</button>
          <div class="grid-2">
            <label>Project name<input data-list="projects" data-index="${index}" data-field="name" value="${item.name}" placeholder="Project title"></label>
            <label>Tech stack<input data-list="projects" data-index="${index}" data-field="tech" value="${item.tech}" placeholder="React, Node.js"></label>
          </div>
          <div class="grid-2">
            <label>Live demo URL (optional)<input data-list="projects" data-index="${index}" data-field="liveUrl" value="${item.liveUrl}" placeholder="https://..."></label>
            <label>GitHub URL (optional)<input data-list="projects" data-index="${index}" data-field="githubUrl" value="${item.githubUrl}" placeholder="https://..."></label>
          </div>
          <label>Project bullets<textarea data-list="projects" data-index="${index}" data-field="bullets" rows="4" placeholder="Bullet 1\nBullet 2\nBullet 3">${item.bullets.join('\n')}</textarea></label>
        </div>
      `
    )
    .join('');

  // Experience repeatable form
  experienceForm.innerHTML = state.experience
    .map(
      (item, index) => `
        <div class="repeat-card repeatable-item">
          <button type="button" class="remove-btn" data-remove="experience" data-index="${index}">Remove</button>
          <div class="grid-2">
            <label>Role<input data-list="experience" data-index="${index}" data-field="title" value="${item.title}" placeholder="Job title / internship"></label>
            <label>Company<input data-list="experience" data-index="${index}" data-field="company" value="${item.company}" placeholder="Company name"></label>
          </div>
          <div class="grid-2">
            <label>Duration<input data-list="experience" data-index="${index}" data-field="duration" value="${item.duration}" placeholder="Start - End"></label>
            <label>Location<input data-list="experience" data-index="${index}" data-field="location" value="${item.location}" placeholder="City, State"></label>
          </div>
          <label>Highlights<textarea data-list="experience" data-index="${index}" data-field="bullets" rows="4" placeholder="Bullet 1\nBullet 2\nBullet 3">${(item.bullets || []).join('\n')}</textarea></label>
        </div>
      `
    )
    .join('');
}

function syncFixedFields() {
  state.contact = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    linkedin: form.elements.linkedin.value.trim(),
    github: form.elements.github.value.trim()
  };

  nameHeading.textContent = state.contact.name;
}

function syncDynamicField(target) {
  const listName = target.dataset.list;
  const index = Number(target.dataset.index);
  const field = target.dataset.field;

  if (!Number.isFinite(index) || !field || !state[listName] || !state[listName][index]) return;

  const item = state[listName][index];

  if (listName === 'skills' && field === 'skills') {
    item.skills = splitFlexible(target.value);
    return;
  }

  if (listName === 'education') {
    item[field] = target.value.trim();
    return;
  }

  if (listName === 'projects' && field === 'bullets') {
    item.bullets = splitLines(target.value);
    return;
  }

  if (listName === 'experience' && field === 'bullets') {
    item.bullets = splitLines(target.value);
    return;
  }

  item[field] = target.value.trim();
}

function syncFromForm() {
  syncFixedFields();
  renderContact();
  renderEducation();
  renderSkills();
  renderExperience();
  renderCertifications();
  renderProjects();
  saveState();
}

function addItem(type) {
  if (type === 'skill') {
    state.skills.push({ category: '', skills: [''] });
  }

  if (type === 'certificate') {
    state.certifications.push({ title: '', url: '' });
  }

  if (type === 'project') {
    state.projects.push({ name: '', tech: '', liveUrl: '', githubUrl: '', bullets: [''] });
  }
  if (type === 'experience') {
    state.experience.push({ title: '', company: '', duration: '', location: '', bullets: [''] });
  }
  if (type === 'education') {
    state.education.push({ degree: '', institute: '', duration: '', location: '' });
  }

  renderRepeatableForms();
  syncFromForm();
}

function removeItem(type, index) {
  if (type === 'skill' && state.skills.length > 1) {
    state.skills.splice(index, 1);
  }

  if (type === 'certificate' && state.certifications.length > 1) {
    state.certifications.splice(index, 1);
  }

  if (type === 'project' && state.projects.length > 1) {
    state.projects.splice(index, 1);
  }

  if (type === 'experience' && state.experience.length > 1) {
    state.experience.splice(index, 1);
  }

  if (type === 'education' && state.education.length > 1) {
    state.education.splice(index, 1);
  }

  renderRepeatableForms();
  syncFromForm();
}

form.addEventListener('input', (event) => {
  const target = event.target;

  if (target.matches('[data-list]')) {
    syncDynamicField(target);
  }

  syncFixedFields();
  renderContact();
  renderEducation();
  renderSkills();
  renderExperience();
  renderCertifications();
  renderProjects();
  saveState();
});

form.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    addItem(addButton.dataset.add);
    return;
  }

  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    removeItem(removeButton.dataset.remove, Number(removeButton.dataset.index));
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  syncFromForm();
});

resetButton.addEventListener('click', () => {
  Object.assign(state, initialState());
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage failures.
  }
  form.reset();
  renderRepeatableForms();
  syncFromForm();
});

printButton.addEventListener('click', () => {
  window.print();
});

renderRepeatableForms();
syncFromForm();
