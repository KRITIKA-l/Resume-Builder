let projectsContainer = document.getElementById('projects');
let educationContainer = document.getElementById('education');
let skillsContainer = document.getElementById('skills');
let experienceContainer = document.getElementById('experience');
let contactList = document.getElementById('contact-list');
const form = document.getElementById('resume-form');
const resetButton = document.getElementById('reset-btn');
const printButton = document.getElementById('print-btn');
let nameHeading = document.getElementById('name');
const resumePage = document.querySelector('.resume-page');
const resumeScaler = document.getElementById('resume-scaler');
const fitWarning = document.getElementById('fit-warning');

// A4 at 96 CSS px/in. The resume is always laid out on this fixed sheet (see
// styles.css), so the preview and the printed PDF wrap text identically.
const PAGE_W = 793.7;
const PAGE_H = 1120.6; // 296.5mm, see .resume-page in styles.css
// Bump when styles/scripts change so browsers never reuse stale cached copies.
const ASSET_VERSION = '3';
const templateStyleLink = document.getElementById('template-style');
const templateBar = document.getElementById('template-bar');
const themeBar = document.getElementById('theme-bar');
const skillsForm = document.getElementById('skills-form');
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

const templates = [
  { key: 'classic', label: 'Classic' },
  { key: 'compact', label: 'Compact' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'executive', label: 'Executive' }
];

const themePresets = {
  classic: [
    { key: 'classic-blue', label: 'Blue', vars: { accent: '#1f4c8f', accentSoft: 'rgba(31, 76, 143, 0.06)', paper: '#ffffff', muted: '#56606e' } },
    { key: 'classic-charcoal', label: 'Charcoal', vars: { accent: '#374151', accentSoft: 'rgba(55, 65, 81, 0.08)', paper: '#ffffff', muted: '#5b6472' } },
    { key: 'classic-olive', label: 'Olive', vars: { accent: '#586b3c', accentSoft: 'rgba(88, 107, 60, 0.08)', paper: '#fbfbf8', muted: '#5e6656' } },
    { key: 'classic-mono', label: 'Black & White', vars: { accent: '#000000', accentSoft: 'rgba(0, 0, 0, 0.06)', paper: '#ffffff', muted: '#3a3a3a' } }
  ],
  compact: [
    { key: 'compact-forest', label: 'Forest', vars: { accent: '#2f5b5f', accentSoft: 'rgba(47, 91, 95, 0.07)', paper: '#fcfcfb', muted: '#56606e' } },
    { key: 'compact-slate', label: 'Slate', vars: { accent: '#475569', accentSoft: 'rgba(71, 85, 105, 0.08)', paper: '#fbfcfd', muted: '#5c6778' } },
    { key: 'compact-ink', label: 'Ink', vars: { accent: '#111827', accentSoft: 'rgba(17, 24, 39, 0.08)', paper: '#ffffff', muted: '#5e6671' } },
    { key: 'compact-mono', label: 'Black & White', vars: { accent: '#000000', accentSoft: 'rgba(0, 0, 0, 0.06)', paper: '#ffffff', muted: '#3a3a3a' } }
  ],
  editorial: [
    { key: 'editorial-plum', label: 'Plum', vars: { accent: '#5d3fd3', accentSoft: 'rgba(93, 63, 211, 0.07)', paper: '#fffdf9', muted: '#625f7a' } },
    { key: 'editorial-ruby', label: 'Ruby', vars: { accent: '#9b2c2c', accentSoft: 'rgba(155, 44, 44, 0.08)', paper: '#fffdf8', muted: '#6d5a5a' } },
    { key: 'editorial-teal', label: 'Teal', vars: { accent: '#0f766e', accentSoft: 'rgba(15, 118, 110, 0.08)', paper: '#fbfffe', muted: '#5d6867' } },
    { key: 'editorial-mono', label: 'Black & White', vars: { accent: '#000000', accentSoft: 'rgba(0, 0, 0, 0.06)', paper: '#ffffff', muted: '#3a3a3a' } }
  ],
  executive: [
    { key: 'executive-teal', label: 'Teal', vars: { accent: '#0f766e', accentSoft: 'rgba(15, 118, 110, 0.08)', paper: '#fbfaf7', muted: '#5e625f' } },
    { key: 'executive-navy', label: 'Navy', vars: { accent: '#1f4c8f', accentSoft: 'rgba(31, 76, 143, 0.08)', paper: '#fbfbfc', muted: '#5c6470' } },
    { key: 'executive-graphite', label: 'Graphite', vars: { accent: '#334155', accentSoft: 'rgba(51, 65, 85, 0.08)', paper: '#fcfcfd', muted: '#616775' } },
    { key: 'executive-mono', label: 'Black & White', vars: { accent: '#000000', accentSoft: 'rgba(0, 0, 0, 0.06)', paper: '#ffffff', muted: '#3a3a3a' } }
  ]
};

const initialState = () => ({
  contact: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: ''
  },
  template: 'classic',
  themeByTemplate: {
    classic: 'classic-blue',
    compact: 'compact-forest',
    editorial: 'editorial-plum',
    executive: 'executive-teal'
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
  training: [
    { title: '', issuer: '', duration: '', url: '' }
  ],
  awards: [
    { title: '', date: '' }
  ],
  extracurricular: [
    { title: '', role: '', date: '' }
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
      template: templates.some((template) => template.key === parsed.template) ? parsed.template : fallback.template,
      themeByTemplate: {
        ...fallback.themeByTemplate,
        ...(parsed.themeByTemplate || {})
      },
      education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : fallback.education,
      experience: Array.isArray(parsed.experience) && parsed.experience.length ? parsed.experience : fallback.experience,
      skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : fallback.skills,
      training: Array.isArray(parsed.training) && parsed.training.length ? parsed.training : fallback.training,
      awards: Array.isArray(parsed.awards) && parsed.awards.length ? parsed.awards : fallback.awards,
      extracurricular: Array.isArray(parsed.extracurricular) && parsed.extracurricular.length ? parsed.extracurricular : fallback.extracurricular,
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

  // Group consecutive/duplicate entries that share the same institute (matched
  // case-insensitively, ignoring surrounding whitespace) so multiple degrees
  // from one school render as one institute block with a date per degree,
  // instead of repeating the institute name for each degree.
  const groups = [];
  const groupIndexByInstitute = new Map();

  items.forEach((item) => {
    const key = item.institute.trim().toLowerCase();
    if (key && groupIndexByInstitute.has(key)) {
      groups[groupIndexByInstitute.get(key)].entries.push(item);
      return;
    }

    groups.push({ institute: item.institute, location: item.location, entries: [item] });
    if (key) groupIndexByInstitute.set(key, groups.length - 1);
  });

  educationContainer.innerHTML = groups
    .map((group) => {
      const degreeRows = group.entries
        .map(
          (entry) => `
            <div class="edu-degree-row">
              <span class="edu-degree">${entry.degree}</span>
              ${entry.duration ? `<span class="entry-date">${entry.duration}</span>` : ''}
            </div>
          `
        )
        .join('');

      return `
        <div class="entry">
          <div class="entry-header">
            <h3>${group.institute}</h3>
          </div>
          ${degreeRows}
          <div class="meta">
            ${group.location ? `<span>${group.location}</span>` : ''}
          </div>
        </div>
      `;
    })
    .join('');
}

function renderSkills() {
  const items = state.skills.filter((group) => group.category || group.skills.some(Boolean));
  skillsContainer.innerHTML = items
    .map(
      (group) => `
        <div class="skill-group">
          <strong>${group.category}:</strong> ${group.skills.filter(Boolean).join(', ')}
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
          <div class="entry-header">
            <h3>${item.title}</h3>
            ${item.duration ? `<span class="entry-date">${item.duration}</span>` : ''}
          </div>
          <p style="font-weight: 700;">${item.company}</p>
          <div class="meta">${item.location ? `${item.location}` : ''}</div>
          <ul class="bullets">
            ${(item.bullets || []).filter(Boolean).map((point) => `<li>${point}</li>`).join('')}
          </ul>
        </div>
      `
    )
    .join('');
}

function renderTraining() {
  const trainingContainer = document.getElementById('training');
  if (!trainingContainer) return;
  
  const items = state.training.filter((item) => item.title.trim() || item.issuer.trim() || item.duration.trim());
  const list = items
    .map((item) => {
      const url = safeUrl(item.url);
      return `
        <li class="entry">
          <div class="entry-header">
            <h3>${url ? `<a href="${url}" target="_blank" rel="noreferrer">${item.title}</a>` : item.title} | ${item.issuer}</h3>
            ${item.duration ? `<span class="entry-date">${item.duration}</span>` : ''}
          </div>
        </li>
      `;
    })
    .join('');
  trainingContainer.innerHTML = list ? `<ul class="entry-list">${list}</ul>` : '';
}

function renderAwards() {
  const awardsContainer = document.getElementById('awards');
  if (!awardsContainer) return;
  
  const items = state.awards.filter((item) => item.title.trim() || item.date.trim());
  const list = items
    .map((item) => `
      <li class="entry">
        <div class="entry-header">
          <h3>${item.title}</h3>
          ${item.date ? `<span class="entry-date">${item.date}</span>` : ''}
        </div>
      </li>
    `)
    .join('');
  awardsContainer.innerHTML = list ? `<ul class="entry-list">${list}</ul>` : '';
}

function renderExtracurricular() {
  const extracurricularContainer = document.getElementById('extracurricular');
  if (!extracurricularContainer) return;
  
  const items = state.extracurricular.filter((item) => item.title.trim() || item.role.trim() || item.date.trim());
  const list = items
    .map((item) => `
      <li class="entry">
        <h3>${item.title}</h3>
      </li>
    `)
    .join('');
  extracurricularContainer.innerHTML = list ? `<ul class="entry-list">${list}</ul>` : '';
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

function buildEducationSection() {
  return `
    <section class="block">
      <h2>Education</h2>
      <div id="education"></div>
    </section>
  `;
}

function buildSkillsSection() {
  return `
    <section class="block">
      <h2>Skills</h2>
      <div id="skills"></div>
    </section>
  `;
}

function buildTrainingSection() {
  return `
    <section class="block">
      <h2>Training & Certifications</h2>
      <div id="training"></div>
    </section>
  `;
}

function buildAwardsSection() {
  return `
    <section class="block">
      <h2>Awards & Achievements</h2>
      <div id="awards"></div>
    </section>
  `;
}

function buildExtracurricularSection() {
  return `
    <section class="block">
      <h2>Extracurricular Activities & Leadership</h2>
      <div id="extracurricular"></div>
    </section>
  `;
}

function buildExperienceSection() {
  return `
    <section class="block">
      <h2>Internships</h2>
      <div id="experience"></div>
    </section>
  `;
}

function buildProjectsSection() {
  return `
    <section class="block">
      <h2>Projects</h2>
      <div id="projects" class="projects"></div>
    </section>
  `;
}

function renderTemplateLayout() {
  if (!resumePage) return;

  const layout = templates.some((template) => template.key === state.template) ? state.template : 'classic';
  let markup = '';

  if (layout === 'classic') {
    // Traditional single-column "Harvard style" resume: centered header,
    // everything in one reading column. The most conservative, most
    // ATS-safe format, common in law, finance, and academia.
    markup = `
      <header class="header">
        <div class="name-wrap"><h1 id="name"></h1></div>
        <ul class="contact-list" aria-label="Contact details" id="contact-list"></ul>
      </header>
      <section class="content-grid content-grid-classic">
        ${buildEducationSection()}
        ${buildSkillsSection()}
        ${buildExperienceSection()}
        ${buildProjectsSection()}
        ${buildTrainingSection()}
        ${buildAwardsSection()}
        ${buildExtracurricularSection()}
      </section>
    `;
  } else if (layout === 'compact') {
    // Two-column layout: main experience/projects column plus a
    // multi-column footer band for the shorter list sections. Common
    // "one-pager" style used for tech and general professional resumes.
    markup = `
      <header class="header">
        <div class="name-wrap"><h1 id="name"></h1></div>
        <ul class="contact-list" aria-label="Contact details" id="contact-list"></ul>
      </header>
      <section class="content-grid content-grid-compact">
        <section class="main-column">
          ${buildExperienceSection()}
          ${buildProjectsSection()}
        </section>
        <aside class="compact-footer">
          ${buildEducationSection()}
          ${buildSkillsSection()}
          ${buildTrainingSection()}
          ${buildAwardsSection()}
          ${buildExtracurricularSection()}
        </aside>
      </section>
    `;
  } else if (layout === 'editorial') {
    // Sidebar layout with a wide main column: common "modern creative"
    // resume format used in design, marketing, and content roles.
    markup = `
      <header class="header">
        <div class="name-wrap"><h1 id="name"></h1></div>
        <ul class="contact-list" aria-label="Contact details" id="contact-list"></ul>
      </header>
      <section class="content-grid content-grid-editorial">
        <aside class="sidebar">
          ${buildEducationSection()}
          ${buildSkillsSection()}
          ${buildTrainingSection()}
          ${buildAwardsSection()}
          ${buildExtracurricularSection()}
        </aside>
        <section class="main-column">
          ${buildExperienceSection()}
          ${buildProjectsSection()}
        </section>
      </section>
    `;
  } else {
    // Executive: banner header plus a narrow sidebar, wide main column.
    // Bold, senior/management resume format.
    markup = `
      <header class="header">
        <div class="name-wrap"><h1 id="name"></h1></div>
        <ul class="contact-list" aria-label="Contact details" id="contact-list"></ul>
      </header>
      <section class="content-grid content-grid-executive">
        <aside class="sidebar">
          ${buildEducationSection()}
          ${buildSkillsSection()}
          ${buildTrainingSection()}
        </aside>
        <section class="main-column">
          ${buildExperienceSection()}
          ${buildProjectsSection()}
          ${buildAwardsSection()}
          ${buildExtracurricularSection()}
        </section>
      </section>
    `;
  }

  resumePage.innerHTML = `<div class="page-fit">${markup}</div>`;

  nameHeading = document.getElementById('name');
  contactList = document.getElementById('contact-list');
  educationContainer = document.getElementById('education');
  skillsContainer = document.getElementById('skills');
  experienceContainer = document.getElementById('experience');
  projectsContainer = document.getElementById('projects');
}

// Shrinks the resume content (via CSS zoom) so it always fits within a
// single A4 page, instead of overflowing onto a second page. `zoom` is used
// instead of `transform: scale()` because it reflows the actual layout at
// the smaller size (like changing font-size), so text stays crisp instead
// of being stretched/rasterized like a scaled image.
function fitResumeToOnePage() {
  if (!resumePage) return;
  const pageFit = resumePage.querySelector('.page-fit');
  if (!pageFit) return;

  // Reset first so we measure the content's natural, unzoomed height.
  pageFit.style.zoom = 1;
  delete resumePage.dataset.density;

  const pageStyles = getComputedStyle(resumePage);
  const paddingTop = parseFloat(pageStyles.paddingTop) || 0;
  const paddingBottom = parseFloat(pageStyles.paddingBottom) || 0;
  let availableHeight = resumePage.clientHeight - paddingTop - paddingBottom;
  let contentHeight = pageFit.scrollHeight;

  // Classic keeps every section in one column. Tighten only its whitespace
  // first, so normal full resumes retain readable text before zoom is used.
  if (state.template === 'classic' && contentHeight > availableHeight) {
    resumePage.dataset.density = 'tight';
    const tightPageStyles = getComputedStyle(resumePage);
    const tightPaddingTop = parseFloat(tightPageStyles.paddingTop) || 0;
    const tightPaddingBottom = parseFloat(tightPageStyles.paddingBottom) || 0;
    availableHeight = resumePage.clientHeight - tightPaddingTop - tightPaddingBottom;
    contentHeight = pageFit.scrollHeight;
  }

  if (availableHeight > 0 && contentHeight > availableHeight) {
    // Floor kept high enough that text stays legible even on a packed
    // resume — base font sizes were raised for print legibility and
    // spacing trimmed sitewide, so the zoom rarely needs to drop this far.
    const MIN_ZOOM = 0.88;
    const zoom = Math.max(availableHeight / contentHeight, MIN_ZOOM);
    pageFit.style.zoom = zoom;
  }

  // Even at the smallest allowed zoom the content may not fit. The sheet clips
  // anything past the bottom edge, so tell the user instead of failing silently.
  if (fitWarning) {
    fitWarning.hidden = !(availableHeight > 0 && contentHeight * 0.88 > availableHeight + 1);
  }
}

// A saved template can replace the initial Classic stylesheet during startup.
// Refit after that stylesheet is applied so a refresh cannot leave the page
// measured with one template and displayed with another.
if (templateStyleLink) {
  templateStyleLink.addEventListener('load', () => {
    requestAnimationFrame(fitResumeToOnePage);
  });
}

function renderTemplateButtons() {
  if (!templateBar) return;

  templateBar.innerHTML = templates
    .map(
      (template) => `
        <button type="button" class="template-chip${state.template === template.key ? ' active' : ''}" data-template="${template.key}">
          ${template.label}
        </button>
      `
    )
    .join('');
}

function getCurrentThemeList() {
  return themePresets[state.template] || [];
}

function getCurrentThemeKey() {
  const options = getCurrentThemeList();
  const selected = state.themeByTemplate[state.template];
  return options.some((theme) => theme.key === selected) ? selected : (options[0] && options[0].key);
}

function renderThemeButtons() {
  if (!themeBar) return;

  const themes = getCurrentThemeList();
  const activeTheme = getCurrentThemeKey();

  themeBar.innerHTML = themes
    .map(
      (theme) => `
        <button type="button" class="template-chip${activeTheme === theme.key ? ' active' : ''}" data-theme="${theme.key}">
          ${theme.label}
        </button>
      `
    )
    .join('');
}

function applyTheme() {
  if (!resumePage) return;

  const options = getCurrentThemeList();
  const selectedKey = getCurrentThemeKey();
  const theme = options.find((item) => item.key === selectedKey) || options[0];

  if (!theme) return;

  state.themeByTemplate[state.template] = theme.key;
  resumePage.dataset.theme = theme.key;
  resumePage.style.setProperty('--accent', theme.vars.accent);
  resumePage.style.setProperty('--accent-soft', theme.vars.accentSoft);
  resumePage.style.setProperty('--paper', theme.vars.paper);
  resumePage.style.setProperty('--muted', theme.vars.muted);
}

function applyTemplate() {
  if (!resumePage) return;
  const templateKey = templates.some((template) => template.key === state.template)
    ? state.template
    : 'classic';

  resumePage.dataset.template = templateKey;

  if (templateStyleLink) {
    const templateHref = `templates/${templateKey}.css?v=${ASSET_VERSION}`;
    if (templateStyleLink.getAttribute('href') !== templateHref) {
      templateStyleLink.href = templateHref;
    }
  }

  renderThemeButtons();
  applyTheme();
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

  const trainingForm = document.getElementById('training-form');
  if (trainingForm) {
    trainingForm.innerHTML = state.training
      .map(
        (item, index) => `
          <div class="repeat-card repeatable-item">
            <button type="button" class="remove-btn" data-remove="training" data-index="${index}">Remove</button>
            <div class="grid-2">
              <label>Training / Certificate<input data-list="training" data-index="${index}" data-field="title" value="${item.title}" placeholder="Training or certificate title"></label>
              <label>Issuer<input data-list="training" data-index="${index}" data-field="issuer" value="${item.issuer}" placeholder="Organization / Platform"></label>
            </div>
            <div class="grid-2">
              <label>Duration / Date (optional)<input data-list="training" data-index="${index}" data-field="duration" value="${item.duration}" placeholder="Start - End"></label>
              <label>URL (optional)<input data-list="training" data-index="${index}" data-field="url" value="${item.url}" placeholder="https://..."></label>
            </div>
          </div>
        `
      )
      .join('');
  }

  const awardsForm = document.getElementById('awards-form');
  if (awardsForm) {
    awardsForm.innerHTML = state.awards
      .map(
        (item, index) => `
          <div class="repeat-card repeatable-item repeat-card-compact">
            <button type="button" class="remove-btn" data-remove="award" data-index="${index}">Remove</button>
            <div class="grid-2">
              <label>Award / Achievement<input data-list="awards" data-index="${index}" data-field="title" value="${item.title}" placeholder="Award name"></label>
              <label>Date<input data-list="awards" data-index="${index}" data-field="date" value="${item.date}" placeholder="Month Year"></label>
            </div>
          </div>
        `
      )
      .join('');
  }

  const extracurricularForm = document.getElementById('extracurricular-form');
  if (extracurricularForm) {
    extracurricularForm.innerHTML = state.extracurricular
      .map(
        (item, index) => `
          <div class="repeat-card repeatable-item repeat-card-compact">
            <button type="button" class="remove-btn" data-remove="extracurricular" data-index="${index}">Remove</button>
            <div class="grid-2">
              <label>Activity / Leadership<input data-list="extracurricular" data-index="${index}" data-field="title" value="${item.title}" placeholder="Activity name"></label>
              <label>Role<input data-list="extracurricular" data-index="${index}" data-field="role" value="${item.role}" placeholder="Role / Position"></label>
            </div>
            <div class="grid-2">
              <label>Date<input data-list="extracurricular" data-index="${index}" data-field="date" value="${item.date}" placeholder="Start - End"></label>
            </div>
          </div>
        `
      )
      .join('');
  }
}

// Put the saved contact details back into the form inputs. Without this the
// inputs start empty on every page load, and the first syncFromForm() then
// overwrites the saved name/email/phone/links with those empty values.
function hydrateFixedFields() {
  Object.keys(state.contact).forEach((key) => {
    const field = form.elements[key];
    if (field) field.value = state.contact[key] || '';
  });
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
  applyTemplate();
  renderTemplateLayout();
  syncFixedFields();
  renderContact();
  renderEducation();
  renderSkills();
  renderExperience();
  renderTraining();
  renderAwards();
  renderExtracurricular();
  renderProjects();
  renderTemplateButtons();
  renderThemeButtons();
  saveState();
  fitResumeToOnePage();
}

function addItem(type) {
  if (type === 'skill') {
    state.skills.push({ category: '', skills: [''] });
  }

  if (type === 'training') {
    state.training.push({ title: '', issuer: '', duration: '', url: '' });
  }

  if (type === 'award') {
    state.awards.push({ title: '', date: '' });
  }

  if (type === 'extracurricular') {
    state.extracurricular.push({ title: '', role: '', date: '' });
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

  if (type === 'training' && state.training.length > 1) {
    state.training.splice(index, 1);
  }

  if (type === 'award' && state.awards.length > 1) {
    state.awards.splice(index, 1);
  }

  if (type === 'extracurricular' && state.extracurricular.length > 1) {
    state.extracurricular.splice(index, 1);
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
  renderTraining();
  renderAwards();
  renderExtracurricular();
  renderProjects();
  saveState();
  // Keep the live preview's scale stable while the user types. The fitting
  // pass still runs for Generate, template changes, resize, and print.
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

if (templateBar) {
  templateBar.addEventListener('click', (event) => {
    const templateButton = event.target.closest('[data-template]');
    if (!templateButton) return;

    state.template = templateButton.dataset.template;
    syncFromForm();
  });
}

if (themeBar) {
  themeBar.addEventListener('click', (event) => {
    const themeButton = event.target.closest('[data-theme]');
    if (!themeButton) return;

    state.themeByTemplate[state.template] = themeButton.dataset.theme;
    syncFromForm();
  });
}

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
  renderTemplateLayout();
  renderRepeatableForms();
  syncFromForm();
});

printButton.addEventListener('click', () => {
  window.print();
});

// ---------------------------------------------------------------------------
// Preview scaling (screen only): the fixed A4 sheet is shrunk with a transform
// so it fits the preview column. Layout inside the sheet never changes.
// ---------------------------------------------------------------------------
function updatePreviewScale() {
  if (!resumePage || !resumeScaler) return;
  const available = resumeScaler.clientWidth;
  if (!available) return;

  const scale = Math.min(1, available / PAGE_W);
  resumePage.style.setProperty('--preview-scale', String(scale));
  resumePage.style.marginLeft = `${Math.max(0, (available - PAGE_W * scale) / 2)}px`;
  resumeScaler.style.height = `${PAGE_H * scale}px`;
}

if (resumeScaler && 'ResizeObserver' in window) {
  new ResizeObserver(updatePreviewScale).observe(resumeScaler);
} else {
  window.addEventListener('resize', updatePreviewScale);
}

// ---------------------------------------------------------------------------
// Printing. The sheet keeps its fixed A4 layout, so the fit computed for the
// preview is already the fit for the PDF. The only thing that can differ is
// the size of the printable area the browser hands us (custom margins, Letter
// paper). #print-probe fills that area; we shrink the whole sheet to fit it.
// ---------------------------------------------------------------------------
const printProbe = document.createElement('div');
printProbe.id = 'print-probe';
document.body.appendChild(printProbe);

const printQuery = window.matchMedia('print');

function applyPrintScale() {
  if (!resumePage) return;
  const width = printProbe.offsetWidth;
  const height = printProbe.offsetHeight;
  let scale = 1;

  if (width > 0 && height > 0) {
    scale = Math.min(1, width / PAGE_W, height / PAGE_H);
    if (scale > 0.99) scale = 1; // ignore sub-pixel rounding on a full A4 page
  }

  resumePage.style.setProperty('--print-scale', String(scale));
  // The wrapper's height (what the browser paginates) must shrink with the sheet.
  resumeScaler.style.setProperty('--print-height', `${PAGE_H * scale}px`);
}

function enterPrint() {
  fitResumeToOnePage();
  applyPrintScale();
}

function leavePrint() {
  if (resumePage) resumePage.style.removeProperty('--print-scale');
  if (resumeScaler) resumeScaler.style.removeProperty('--print-height');
  updatePreviewScale();
}

if (printQuery.addEventListener) {
  printQuery.addEventListener('change', (event) => (event.matches ? enterPrint() : leavePrint()));
} else if (printQuery.addListener) {
  // Older Safari.
  printQuery.addListener((event) => (event.matches ? enterPrint() : leavePrint()));
}

// Fallbacks for browsers that don't fire the media-query change. The sheet's
// layout is fixed, so fitting here is correct even before print styles apply.
window.addEventListener('beforeprint', enterPrint);
window.addEventListener('afterprint', leavePrint);

hydrateFixedFields();
renderRepeatableForms();
renderTemplateLayout();
syncFromForm();
updatePreviewScale();