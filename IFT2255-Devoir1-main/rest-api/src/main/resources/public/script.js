/// ==========================
// ÉTAT GLOBAL
// ==========================
const TERM_TO_CODE = {
  winter: "H25",
  autumn: "A24",
  summer: "E24"
};


let courses = [];
const courseSet = [];
let visibleCount = 5;

let loadingInterval = null;

// une petite animation pour le chargement des cours 
function showGlobalLoading() {
  const loading = document.getElementById("global-loading");
  const dots = document.getElementById("global-dots");

  if (!loading || !dots) return;

  loading.style.display = "block";

  let count = 1;
  dots.textContent = ".";

  loadingInterval = setInterval(() => {
    count = (count % 3) + 1;
    dots.textContent = ".".repeat(count);
  }, 400);
}

function hideGlobalLoading() {
  const loading = document.getElementById("global-loading");
  if (loading) loading.style.display = "none";

  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
}
// uutilitaires 
async function getAvisAggreges(courseId) {
  try {
    const res = await fetch(`/api/avis/${courseId}`);
    if (!res.ok) return null;

    const avis = await res.json();
    if (!avis || avis.length === 0) return null;

    const avgCharge =
      avis.reduce((s, a) => s + a.charge, 0) / avis.length;

    const avgDifficulte =
      avis.reduce((s, a) => s + a.difficulte, 0) / avis.length;

    const commentaires = avis
      .map(a => a.commentaire)
      .filter(c => c && c.trim().length > 0);

    return {
      charge: avgCharge.toFixed(1),
      difficulte: avgDifficulte.toFixed(1),
      commentaires   // on return un tablequ
    };
  } catch (e) {
    console.error("Erreur avis", e);
    return null;
  }
}

async function getResultatsAggreges(courseId) {
  try {
    const res = await fetch(`/results/${courseId}`);

    if (!res.ok) return null;

    const r = await res.json();

    return {
      moyenne: r.moyenne,
      score: r.score,
      participants: r.participants,
      trimestres: r.trimestres
    };
  } catch (e) {
    console.error("Erreur résultats", e);
    return null;
  }
}


// fonction loadResultats
async function loadResultats(courseId) {
 
  try {
    const res = await fetch(`/resultats/${courseId}`);

    if (!res.ok) {
      renderResultatsErreur();
      return;
    }

    const resultat = await res.json();
    renderResultats(resultat);

  } catch (err) {
    console.error("Erreur chargement résultats académiques", err);
    renderResultatsErreur();
  }
}




// ==========================
// CHARGEMENT DES COURS
// ==========================
async function loadCourses() {
  
  showGlobalLoading();   
  try {
    const res = await fetch("/courses");
    const raw = await res.json();

    // CAS 1 : backend renvoie déjà les cours
    if (Array.isArray(raw) && raw[0]?.id) {
      courses = raw;
    }
    // CAS 2 : backend renvoie un programme
    else if (Array.isArray(raw) && raw[0]?.courses) {
      const ids = raw[0].courses;

      // charger les vrais objets cours
      courses = await Promise.all(
        ids.map(id =>
          fetch(`/courses/${id}`).then(r => r.json())
        )
      );
    } else {
      throw new Error("Format catalogue invalide");
    }

    renderCatalogue();
    hideGlobalLoading();
  } catch (err) {
    console.error("Erreur catalogue", err);
  }
}

// ==========================
// VOIR PLUS / MOINS
// ==========================
function affichermoinsdecours() {
  visibleCount = Math.max(5, visibleCount - 5);
  renderCatalogue();
}

function afficherplusdecours() {
  visibleCount += 5;
  renderCatalogue();
}

// ==========================
// AFFICHAGE + FILTRES
// ==========================
function renderCatalogue() {
  const container = document.getElementById("courses");
  const query = searchInput.value.toLowerCase();
  const term = termFilter.value;

  container.innerHTML = "";

  courses
    .filter(c => {
      const matchText =
        c.id.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        (c.description || "").toLowerCase().includes(query);

      const matchTerm =
        term === "" || c.available_terms?.[term] === true;

      return matchText && matchTerm;
    })
    .slice(0, visibleCount)
    .forEach(c => {
      const div = document.createElement("div");
      div.className = "course";

      div.innerHTML = `
        <h3>${c.id}</h3>
        <p>${c.name}</p>
        <p>Crédits : ${c.credits}</p>
      `;

      div.onclick = () => {
        const semester = TERM_TO_CODE[term] || "H25";
        window.location.href =
          `course.html?id=${c.id}&semester=${semester}`;
      };

      container.appendChild(div);
    });
}

// ==========================
// REMPLIR LES SELECTS
// ==========================
function populateSelects() {
  ["compare1", "compare2", "setSelect"].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = "";
    courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.id;
      select.appendChild(opt);
    });
  });
}

// ==========================
// COMPARAISON DE COURS
// ==========================
async function compareCourses() {
  const result = document.getElementById("comparison");
  result.innerHTML = "";

  const input = document
    .getElementById("compareInput")
    .value
    .toUpperCase()
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (input.length < 2) {
    result.innerHTML =
      "<p>Veuillez entrer au moins deux sigles de cours.</p>";
    return;
  }

  const selectedCourses = input
    .map(code => courses.find(c => c.id === code))
    .filter(Boolean);

  if (selectedCourses.length < 2) {
    result.innerHTML =
      "<p>Erreur : au moins un sigle est invalide.</p>";
    return;
  }

  // === NOUVEAU : charger avis + résultats ===
  const avisList = await Promise.all(
    selectedCourses.map(c => getAvisAggreges(c.id))
  );

  const resultatsList = await Promise.all(
    selectedCourses.map(c => getResultatsAggreges(c.id))
  );

  let html = `
    <h3>Comparaison des cours</h3>

    <table class="compare-table">
      <tr>
        <th>Sigle</th>
        ${selectedCourses.map(c => `<td>${c.id}</td>`).join("")}
      </tr>

      <tr>
        <th>Nom</th>
        ${selectedCourses.map(c => `<td>${c.name}</td>`).join("")}
      </tr>

      <tr>
        <th>Crédits</th>
        ${selectedCourses.map(c => `<td>${c.credits}</td>`).join("")}
      </tr>

      <tr>
        <th>Description</th>
        ${selectedCourses.map(c => `
          <td class="description">
            ${c.description || "Aucune description"}
          </td>
        `).join("")}
      </tr>

      <tr>
        <th>Hiver</th>
        ${selectedCourses.map(c =>
          `<td>${c.available_terms.winter ? "✔️" : "—"}</td>`
        ).join("")}
      </tr>

      <tr>
        <th>Automne</th>
        ${selectedCourses.map(c =>
          `<td>${c.available_terms.autumn ? "✔️" : "—"}</td>`
        ).join("")}
      </tr>

      <tr>
        <th>Été</th>
        ${selectedCourses.map(c =>
          `<td>${c.available_terms.summer ? "✔️" : "—"}</td>`
        ).join("")}
      </tr>

      <!-- ========================= -->
      <!-- AVIS ÉTUDIANTS (agrégés) -->
      <!-- ========================= -->

      <tr>
        <th>Charge de travail (avis)</th>
        ${avisList.map(a =>
          `<td>${a ? a.charge + " / 5" : "—"}</td>`
        ).join("")}
      </tr>

      <tr>
        <th>Difficulté perçue (avis)</th>
        ${avisList.map(a =>
          `<td>${a ? a.difficulte + " / 5" : "—"}</td>`
        ).join("")}
      </tr>

      <!-- ========================= -->
      <!-- RÉSULTATS ACADÉMIQUES -->
      <!-- ========================= -->

      <tr>
        <th>Moyenne finale</th>
        ${resultatsList.map(r =>
          `<td>${r ? r.moyenne : "—"}</td>`
        ).join("")}
      </tr>

      <tr>
        <th>Score académique</th>
        ${resultatsList.map(r =>
          `<td>${r ? r.score + " / 5" : "—"}</td>`
        ).join("")}
      </tr>

      <tr>
        <th>Participants</th>
        ${resultatsList.map(r =>
          `<td>${r ? r.participants : "—"}</td>`
        ).join("")}
      </tr>
   <tr>
  <th>Commentaires (avis)</th>
  ${avisList.map(a => `
    <td>
      ${a && a.commentaires.length > 0
        ? `<ul class="avis-comments">
            ${a.commentaires.map(c => `<li>${c}</li>`).join("")}
           </ul>`
        : "—"}
    </td>
  `).join("")}
</tr>
      </table>
   
  
    `;

  result.innerHTML = html;
}

function checkEligibility() {
  const targetCourse =
    document.getElementById("targetCourse").value.trim().toUpperCase();

  if (!targetCourse) {
    alert("Veuillez entrer un cours à vérifier");
    return;
  }

  const completedCourses = document
    .getElementById("completedCourses")
    .value
    .split(",")
    .map(c => c.trim().toUpperCase())
    .filter(Boolean);

  const cycle =
    document.getElementById("cycle").value;

  const payload = {
    completedCourses: completedCourses,
    cycle: cycle
  };

  fetch(`/courses/${targetCourse}/eligibility`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Cours introuvable");
      }
      return res.json();
    })
    .then(renderEligibilityResult)
    .catch(err => {
      document.getElementById("eligibilityResult").innerHTML = `
        <p style="color:red">
           ${err.message}
        </p>
      `;
    });
}
 function renderEligibilityResult(result) {
  const container =
    document.getElementById("eligibilityResult");

  if (result.eligible) {
    container.innerHTML = `
      <p style="color:green;font-weight:bold">
         ${result.message}
      </p>
    `;
  } else {
    let prereqHtml = "";

    if (result.missingPrerequisites?.length) {
      prereqHtml = `
        <p>Prérequis manquants :</p>
        <ul>
          ${result.missingPrerequisites
            .map(p => `<li>${p}</li>`)
            .join("")}
        </ul>
      `;
    }

    container.innerHTML = `
      <p style="color:red;font-weight:bold">
         ${result.message}
      </p>
      ${prereqHtml}
    `;
  }
}

// ==========================
// ENSEMBLE DE COURS
// ==========================
function addToSet() {
  const code = setSelect.value;
  if (courseSet.length >= 6) return;
  if (courseSet.includes(code)) return;

  courseSet.push(code);
  renderSet();
}

function renderSet() {
  const ul = document.getElementById("courseSet");
  ul.innerHTML = "";

  courseSet.forEach(code => {
    const li = document.createElement("li");
    li.textContent = code;
    ul.appendChild(li);
  });
}

// ==========================
// CONFLITS D’HORAIRES
// ==========================
async function fetchCourseWithSchedule(courseId, term) {
  const semester = TERM_TO_CODE[term];
  const res = await fetch(
    `/courses/${courseId}?include_schedule=true&schedule_semester=${semester}`
  );
  if (!res.ok) throw new Error("Cours introuvable : " + courseId);
  return await res.json();
}

function extractActivities(course) {
  const activities = [];
  const seen = new Set();

  if (!Array.isArray(course.schedules)) return [];

  course.schedules.forEach(s => {
    s.sections.forEach(section => {
      section.volets.forEach(volet => {
        volet.activities.forEach(a => {
          const key = `${section.name}-${volet.name}-${a.days}-${a.start_time}-${a.end_time}`;
          if (!seen.has(key)) {
            seen.add(key);
            activities.push({
              course: course.id,
              section: section.name,
              type: volet.name,
              day: a.days[0],
              start: a.start_time,
              end: a.end_time,
              room: a.room,
              pavillon: a.pavillon_name
            });
          }
        });
      });
    });
  });

  return activities;
}

//  
function keepOneSection(list) {
  if (list.length === 0) return [];
  const section = list[0].section;
  return list.filter(a => a.section === section);
}

function renderConflictSchedules(list1, list2) {
  let html = "<h3>Horaires des cours</h3>";

  [list1, list2].forEach(list => {
    if (list.length === 0) return;

    html += `<h4>${list[0].course}</h4><ul>`;
    list.forEach(a => {
      html += `
        <li>
          ${a.day} ${a.start}–${a.end}
          (${a.type}, section ${a.section})
          – ${a.pavillon} ${a.room}
        </li>`;
    });
    html += "</ul>";
  });

  document.getElementById("conflictSchedules").innerHTML = html;
}

function overlap(a, b) {
  return a.day === b.day && a.start < b.end && b.start < a.end;
}

async function checkConflictBetweenTwoCourses() {
  const input = document
    .getElementById("conflictInput")
    .value.toUpperCase()
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const term = document.getElementById("conflictTerm").value;
  const schedulesDiv = document.getElementById("conflictSchedules");
  const resultDiv = document.getElementById("conflictResult");

  schedulesDiv.innerHTML = "";
  resultDiv.innerHTML = "";

  if (input.length !== 2) {
    resultDiv.innerHTML = "Veuillez entrer exactement deux cours.";
    return;
  }

  try {
    const c1 = await fetchCourseWithSchedule(input[0], term);
    const c2 = await fetchCourseWithSchedule(input[1], term);

    let a1 = keepOneSection(extractActivities(c1));
    let a2 = keepOneSection(extractActivities(c2));

    renderConflictSchedules(a1, a2);

    const conflicts = [];
    a1.forEach(x =>
      a2.forEach(y => {
        if (overlap(x, y)) conflicts.push({ x, y });
      })
    );

    if (conflicts.length === 0) {
      resultDiv.innerHTML =
        "<p style='color:green'> Aucun conflit détecté.</p>";
    } else {
      resultDiv.innerHTML = `
        <h3>⚠️ Conflits détectés</h3>
        <ul>
          ${conflicts
            .map(
              c =>
                `<li>${c.x.day} ${c.x.start}-${c.x.end} ↔ ${c.y.start}-${c.y.end}</li>`
            )
            .join("")}
        </ul>`;
    }
  } catch (e) {
    resultDiv.innerHTML = `<p style="color:red">${e.message}</p>`;
  }
}

function goToProgramCourses() {
  const programId =
    document.getElementById("programId").value.trim();

  if (!programId) {
    alert("Veuillez entrer un identifiant de programme");
    return;
  }

  window.location.href =
    `programs.html?programId=${programId}`;
}
//
// ==========================
// EVENTS
// ==========================
searchInput.addEventListener("input", renderCatalogue);
termFilter.addEventListener("change", renderCatalogue);





// ==========================
// START
// ==========================
loadCourses();