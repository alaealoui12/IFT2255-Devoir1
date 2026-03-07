// ==========================
// UTILITAIRES
// ==========================
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// chargement des avis  
async function loadAvis(courseId) {
  try {
    const res = await fetch(`/api/avis/${courseId}`);
    const allAvis = await res.json();

    const avisDuCours = allAvis.filter(
      a => a.cours.toUpperCase() === courseId.toUpperCase()
    );

    renderAvis(avisDuCours);
  } catch (err) {
    console.error("Erreur chargement avis.json", err);
  }
}

function renderAvis(avis) {
  let html = `<h3>Avis étudiants</h3>`;

  if (!avis || avis.length === 0) {
    html += `<p>Aucun avis pour ce cours.</p>`;
  } else {
    const avgDifficulty =
      avis.reduce((s, a) => s + a.difficulte, 0) / avis.length;

    const avgWorkload =
      avis.reduce((s, a) => s + a.charge, 0) / avis.length;

    html += `
      <div class="avis-summary">
        <p>Difficulté moyenne : ${avgDifficulty.toFixed(1)} / 5</p>
        <p>Charge de travail moyenne : ${avgWorkload.toFixed(1)} / 5</p>
      </div>

      <ul class="avis-list">
        ${avis
          .map(
            a => `
            <li>
              <span>Difficulté ${a.difficulte}/5</span> |
              <span>Charge ${a.charge}/5</span><br>
              ${a.commentaire || ""}
            </li>
          `
          )
          .join("")}
      </ul>
    `;
  }

  document
    .getElementById("course-details")
    .insertAdjacentHTML("beforeend", html);
}







// ==========================
// CHARGEMENT DU COURS
// ==========================



async function loadCourse() {
  const courseId = getParam("id");
  const semester = getParam("semester");

  if (!courseId) {
    document.getElementById("course-details").innerHTML =
      "<p>Identifiant de cours manquant</p>";
    return;
  }

  try {
    let url = `/courses/${courseId}?include_schedule=true`;
    if (semester) {
      url += `&schedule_semester=${semester}`;
    }

    const response = await fetch(url);
    const course = await response.json();

    renderCourse(course);

  } catch (err) {
    console.error(err);
    document.getElementById("course-details").innerHTML =
      "<p>Erreur lors du chargement du cours</p>";
  }
}

// ==========================
// AFFICHAGE DU COURS
// ==========================
function renderCourse(c) {
  const container = document.getElementById("course-details");

  let html = `
    <h2>${c.id} – ${c.name}</h2>
    <p><strong>Crédits :</strong> ${c.credits}</p>
    <p>${c.description}</p>

    <h3>Conditions</h3>
    <p><strong>Prérequis :</strong> ${
      c.prerequisite_courses?.length
        ? c.prerequisite_courses.join(", ")
        : "Aucun"
    }</p>
    <p><strong>Équivalents :</strong> ${
      c.equivalent_courses?.length
        ? c.equivalent_courses.join(", ")
        : "Aucun"
    }</p>
  `;

  // ==========================
  // HORAIRES
  // ==========================
  if (Array.isArray(c.schedules) && c.schedules.length > 0) {
    html += `<h3>Horaires</h3>`;

    c.schedules.forEach(schedule => {
      html += `
        <div class="schedule">
          <h4>Trimestre ${schedule.semester}</h4>
      `;

      schedule.sections.forEach(section => {
        html += `
          <div class="section">
            <h5>Section ${section.name}</h5>
            <p>
              <strong>Enseignant(s) :</strong>
              ${section.teachers.join(", ")}
              <br>
              <strong>Capacité :</strong> ${section.capacity}
            </p>
        `;

        section.volets.forEach(volet => {
          html += `<div class="volet"><strong>${volet.name}</strong>`;

          volet.activities.forEach(act => {
            html += `
              <div class="activity">
                <p>
                  ${act.days.join(", ")}
                  ${act.start_time} – ${act.end_time}<br>
                  ${act.pavillon_name} – Salle ${act.room}<br>
                  ${act.campus} | Mode ${act.mode}
                </p>
              </div>
            `;
          });

          html += `</div>`;
        });

        html += `</div>`;
      });

      html += `</div>`;
    });

  } else {
    html += `<p>Aucun horaire disponible</p>`;
  }
  
  container.innerHTML = html;
  loadAvis(c.id);
  loadResultats(c.id);
  

}


// ==========================
// RÉSULTATS ACADÉMIQUES
// ==========================
async function loadResultats(courseId) {
  try {
    const res = await fetch(`/results/${courseId}`);

    if (!res.ok) {
      renderResultatsErreur();
      return;
    }

    const r = await res.json();
    renderResultats(r);

  } catch (err) {
    console.error("Erreur chargement résultats académiques", err);
    renderResultatsErreur();
  }
}

function renderResultats(r) {
  const html = `
    <h3>Résultats académiques</h3>

    <div class="resultats-box">
      <p><strong>Moyenne :</strong> ${r.moyenne}</p>
      <p><strong>Score :</strong> ${r.score} / 5</p>
      <p><strong>Participants :</strong> ${r.participants}</p>
      <p><strong>Trimestres analysés :</strong> ${r.trimestres}</p>
    </div>
  `;

  document
    .getElementById("course-details")
    .insertAdjacentHTML("beforeend", html);
}

function renderResultatsErreur() {
  const html = `
    <h3>Résultats académiques</h3>
    <p>Aucun résultat académique disponible pour ce cours.</p>
  `;

  document
    .getElementById("course-details")
    .insertAdjacentHTML("beforeend", html);
}
// ==========================
// DÉMARRAGE
// ==========================
loadCourse();