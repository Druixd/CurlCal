    import { GoogleGenAI } from 'https://esm.run/@google/genai';

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    let currentUser = null;
    
    // Auth state observer
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      if (user) {
        // User is signed in
        console.log('User signed in:', user.displayName);
        document.getElementById('loginBtn').textContent = truncateName(user.displayName);
        document.getElementById('loginBtn').onclick = () => {
          document.getElementById('apiKeyInput').value = loadApiKey();
          document.getElementById('breakDurationSelect').value = loadBreakDuration().toString();
          document.getElementById('userModal').style.display = 'flex';
        };
        // Load user data
        loadUserData(user.uid);
      } else {
        // User is signed out
        document.getElementById('loginBtn').textContent = 'Login with Google';
        document.getElementById('loginBtn').onclick = loginWithGoogle;
        // Load from localStorage
        history = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
        activeWorkout = JSON.parse(localStorage.getItem(LS_ACTIVE) || "null");
        updateResumeChip();
        renderLibrary();
        renderCalendar();
        renderDayDetails(null);
      }
    });
    
    // Login function
    function loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          showToast('Logged in successfully');
        })
        .catch((error) => {
          console.error('Login error:', error);
          showToast('Login failed', 'error');
        });
    }
    
    // Load user data from Firestore
    async function loadUserData(uid) {
      try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          history = data.history || [];
          activeWorkout = data.activeWorkout || null;
          updateResumeChip();
          renderLibrary();
          renderCalendar();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    
    // Save user data to Firestore
    function saveUserData() {
      if (!currentUser) return;
      const data = {
        history,
        activeWorkout
      };
      db.collection('users').doc(currentUser.uid).set(data, { merge: true });
    }
    
    // ===== Constants and Data =====
    const LS_HISTORY = "GYM_HISTORY_V1";
    const LS_ACTIVE  = "GYM_ACTIVE_WORKOUT_V1";
    const LS_API_KEY = "GYM_GEMINI_API_KEY_V1";
    const LS_BREAK_DURATION = "GYM_BREAK_DURATION_V1";

    // Use comprehensive exercise database
    const ALL_EXERCISES = COMPREHENSIVE_EXERCISES.map(ex => ({
      ...ex,
      muscles: [ex.muscle] // Convert muscle to muscles array for consistency
    })).sort((a, b) => a.name.localeCompare(b.name));

    function truncateName(name, maxLen = 12) {
      return name.length > maxLen ? name.substring(0, maxLen) + '...' : name;
    }


    // ===== State =====
    let activeTab = "library"; // "library" | "workout" | "calendar"
    let history = [];
    let activeWorkout = null;
    let calendarCursor = new Date(); // month being viewed
    let workoutTimerInterval = null;
    let selectedExerciseIndex = null;
    let activeDeleteSet = null; // {ei, si} or null
    let breakTimerInterval = null;
    let breakTimeRemaining = 0;
    let breakDuration = 90; // default 90 seconds

    // ===== Utilities =====
    function loadHistory(){
      try{ return JSON.parse(localStorage.getItem(LS_HISTORY) || "[]"); }catch{ return [] }
    }
    function saveHistory(){
      if(currentUser){
        saveUserData();
      } else {
        localStorage.setItem(LS_HISTORY, JSON.stringify(history));
      }
    }
    function loadActiveWorkout(){
      try{ return JSON.parse(localStorage.getItem(LS_ACTIVE) || "null"); }catch{ return null }
    }
    function saveActiveWorkout(){
      if(currentUser){
        saveUserData();
      } else {
        if(activeWorkout) localStorage.setItem(LS_ACTIVE, JSON.stringify(activeWorkout));
        else localStorage.removeItem(LS_ACTIVE);
      }
    }
    function id(){ return Math.random().toString(36).slice(2,10) }
    function todayKey(d = new Date()){
      // local date key YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth()+1).padStart(2,'0');
      const day = String(d.getDate()).padStart(2,'0');
      return `${year}-${month}-${day}`;
    }
    function fmtDate(key){
      // key: YYYY-MM-DD
      const [y,m,d] = key.split('-').map(Number);
      const dt = new Date(y, m-1, d);
      return dt.toLocaleDateString(undefined,{ year:'numeric', month:'short', day:'numeric' });
    }
    function minutesBetween(isoStart, isoEnd){
      const t = (new Date(isoEnd) - new Date(isoStart)) / 60000;
      return Math.max(1, Math.round(t));
    }
    function showToast(text, kind="info"){
      const toast = document.getElementById("toast");
      toast.textContent = text;
      toast.classList.remove("show");

      // Reset to design-system surfaces
      toast.style.background = "var(--card)";
      toast.style.color = "var(--text)";
      toast.style.borderColor = "var(--border)";

      // Variant borders using allowed palette only
      if (kind === "success") {
        toast.style.borderColor = "rgba(163,230,53,0.60)"; // lime-400/60
      } else if (kind === "info") {
        toast.style.borderColor = "rgba(34,211,238,0.60)"; // cyan-400/60
      } else if (kind === "warn") {
        toast.style.borderColor = "rgba(241,245,249,0.25)"; // neutral outline
      }

      requestAnimationFrame(()=>{
        toast.classList.add("show");
        setTimeout(()=> toast.classList.remove("show"), 2200);
      });
    }
    function countCompletedSets(workout){
      let count = 0;
      workout.exercises.forEach(ex => ex.sets?.forEach(s => { if(s.completed) count++; }));
      return count;
    }

    // API Key utilities
    function loadApiKey(){
      return localStorage.getItem(LS_API_KEY) || "";
    }
    function saveApiKey(key){
      localStorage.setItem(LS_API_KEY, key);
    }

    // Break timer utilities
    function loadBreakDuration(){
      return parseInt(localStorage.getItem(LS_BREAK_DURATION) || "90");
    }
    function saveBreakDuration(duration){
      localStorage.setItem(LS_BREAK_DURATION, duration.toString());
    }

    function startBreakTimer(){
      if(breakTimerInterval) clearInterval(breakTimerInterval);
      breakTimeRemaining = breakDuration;
      updateBreakDisplay();
      document.getElementById('breakModal').style.display = 'flex';

      breakTimerInterval = setInterval(() => {
        breakTimeRemaining--;
        updateBreakDisplay();
        if(breakTimeRemaining <= 0){
          endBreakTimer();
        }
      }, 1000);
    }

    function endBreakTimer(){
      if(breakTimerInterval) clearInterval(breakTimerInterval);
      breakTimerInterval = null;
      document.getElementById('breakModal').style.display = 'none';
      showToast("Break ended", "success");
    }

    function updateBreakDisplay(){
      const minutes = Math.floor(breakTimeRemaining / 60);
      const seconds = breakTimeRemaining % 60;
      const display = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      document.getElementById('breakCountdown').textContent = display;
    }

    function modifyBreakTime(seconds){
      breakTimeRemaining = Math.max(0, breakTimeRemaining + seconds);
      updateBreakDisplay();
    }

    function startWorkoutTimer(){
      if(workoutTimerInterval) clearInterval(workoutTimerInterval);
      workoutTimerInterval = setInterval(() => {
        if(!activeWorkout) return;
        const elapsed = Math.floor((new Date() - new Date(activeWorkout.startTime)) / 1000);
        const min = Math.floor(elapsed / 60);
        const sec = elapsed % 60;
        const timerEl = document.getElementById('workoutTimer');
        if(timerEl) timerEl.textContent = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
      }, 1000);
    }

    // ===== Tabs =====
    function setTab(name){
      activeTab = name;
      document.querySelectorAll(".tab-btn").forEach(btn=>{
        const on = btn.id === `tab-${name}`;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-selected", String(on));
      });
      document.querySelectorAll(".panel").forEach(p=>{
        p.classList.toggle("active", p.id === `panel-${name}`);
      });

      // render tab-specific
      if(name === "library") renderLibrary();
      if(name === "workout") renderWorkout();
      if(name === "calendar") {
        calendarCursor = new Date();
        renderCalendar();
        const today = todayKey();
        renderDayDetails(today);
      }

      updateResumeChip();
    }

    // ===== Exercise Library Rendering =====
    function lastPerformedDate(workoutName){
      const dates = history
        .filter(h => h.name === workoutName)
        .map(h => h.dateKey);
      if(dates.length===0) return null;
      dates.sort(); // lexicographic works for YYYY-MM-DD
      return dates[dates.length-1];
    }
    function renderLibrary(){
      const grid = document.getElementById("libraryGrid");
      const activeMuscle = document.querySelector(".chip.active")?.dataset.muscle || "All";
      const q = document.getElementById("searchInput").value.trim().toLowerCase();

      let items = WORKOUT_TEMPLATES
        .filter(w => {
          if(activeMuscle === "All") return true;
          if(activeMuscle === "Custom") return w.isCustom;
          return w.muscles.includes(activeMuscle);
        })
        .filter(w => w.name.toLowerCase().includes(q));

      // Sort to show custom first
      items.sort((a,b) => (b.isCustom ? 1 : 0) - (a.isCustom ? 1 : 0));

      grid.innerHTML = "";
      if(items.length === 0){
        grid.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; text-align:center">
            <div class="muted">No workouts match your filters.</div>
          </div>
        `;
        return;
      }

      for(const w of items){
        const last = lastPerformedDate(w.name);
        const el = document.createElement("div");
        el.className = "card";
        el.innerHTML = `
          <div class="title-row">
            <div style="display:flex; align-items:center; gap:10px">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="${'var(--primary)'}" aria-hidden="true"><path d="M1 10h3V7h2v10H4v-3H1zm19 7h-2V7h2v3h3v4h-3zM8 17H6V7h2zm8 0h-2V7h2zM9 15V9h6v6z"/></svg>
              <h3 style="margin:0">${w.name}</h3>
            </div>
            <div style="display:flex; gap:8px; align-items:center">
              <button class="icon-btn primary" data-start="${w.id}" aria-label="Start workout from template">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#0a0a0a" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button class="btn secondary" data-preview="${w.id}" aria-label="Preview exercises">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 6a9.77 9.77 0 018.94 6A9.77 9.77 0 0112 18a9.77 9.77 0 01-8.94-6A9.77 9.77 0 0112 6zm0 2C8.55 8 5.65 9.82 4.35 12 5.65 14.18 8.55 16 12 16s6.35-1.82 7.65-4C18.35 9.82 15.45 8 12 8zm0 2a2 2 0 110 4 2 2 0 010-4z"/></svg>
              </button>
            </div>
          </div>
          <div class="badges">
            ${w.muscles.map(m => `<span class="badge">${m}</span>`).join("")}
          </div>
          <div style="display:flex; align-items:center; gap:14px; margin-top:8px">
            <span style="display:inline-flex; align-items:center; gap:6px" class="muted">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 1a11 11 0 1011 11A11.012 11.012 0 0012 1zm1 11H7V11h5V6h1z"/></svg>
              ${last ? `Last: ${fmtDate(last)}` : `Not performed yet`}
            </span>
          </div>
        `;
        grid.appendChild(el);
      }
    }

    function getTemplateById(tid){ return WORKOUT_TEMPLATES.find(w => w.id === tid); }

    /**
     * Show a modal preview of a workout template.
     * Builds a lightweight modal DOM and inserts into document.body.
     */
    function showTemplatePreview(tid){
      const t = getTemplateById(tid);
      if(!t) return;
      // Remove existing preview if present
      const existing = document.getElementById('templatePreviewModal');
      if(existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'templatePreviewModal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-labelledby="templatePreviewTitle" style="max-width:640px">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px">
            <h3 id="templatePreviewTitle" style="margin:0">${t.name}</h3>
            <button id="closeTemplatePreview" class="btn secondary" aria-label="Close preview">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div style="margin-top:8px; color:var(--muted)">Muscles: ${t.muscles.join(', ')}</div>
          <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px; max-height:60vh; overflow:auto; padding-right:8px">
            ${t.exercises.map(ex => `
              <div style="display:flex; gap:12px; align-items:flex-start; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--panel-2)">
                <div style="width:36px; height:36px; border-radius:8px; background:var(--card); display:grid; place-items:center; font-weight:700; color:var(--text)">${(ex.name||'')[0] || '?'}</div>
                <div style="flex:1">
                  <div style="font-weight:700; color:var(--text)">${ex.name}</div>
                  <div style="color:var(--muted); font-size:13px; margin-top:4px">${ex.muscle} • ${ex.defaultSets || ''} sets ${ex.defaultReps ? `• ${ex.defaultReps} reps` : ''}</div>
                </div>
                <div style="display:flex; gap:8px; align-items:center">
                    ${ex.exercise_link ? `<a href="${ex.exercise_link}" target="_blank" rel="noopener" class="icon-btn" style="width:32px;height:32px;border-radius:8px" aria-label="Open demo">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5v2H6v11h11v-4h2v6H5V5z"/></svg>
                    </a>` : ''}
                  </div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px">
            <button id="startFromPreview" class="btn" data-start="${t.id}">Start Workout</button>
            <button id="closePreviewFooter" class="btn secondary">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Wire up close and start actions
      modal.querySelectorAll('#closeTemplatePreview, #closePreviewFooter').forEach(btn=>{
        btn.addEventListener('click', ()=> modal.remove());
      });
      const startBtn = modal.querySelector('#startFromPreview');
      if(startBtn){
        startBtn.addEventListener('click', () => {
          const tid = startBtn.getAttribute('data-start');
          modal.remove();
          startWorkoutFromTemplate(tid);
        });
      }
    }

    function startWorkoutFromTemplate(tid){
      const t = getTemplateById(tid);
      if(!t) return;

      if(activeWorkout){
        const replace = confirm("A workout is already in progress. Replace it with this one?");
        if(!replace) return;
      }

      activeWorkout = {
        id: id(),
        templateId: t.id,
        name: t.name,
        muscles: [...t.muscles],
        startTime: new Date().toISOString(),
        exercises: t.exercises.map(ex => ({
          name: ex.name,
          muscle: ex.muscle,
          exercise_link: ex.exercise_link,
          trackingType: ex.trackingType || "weight_reps",
          sets: Array.from({ length: ex.defaultSets }, () => {
            const isTimeDistance = ex.trackingType === "time_distance";
            return isTimeDistance
              ? { time: 0, distance: 0, completed: false }
              : { weight: 0, reps: ex.defaultReps, completed: false };
          })
        }))
      };
      saveActiveWorkout();
      updateResumeChip();
      startWorkoutTimer();
      setTab("workout");
      showToast("Workout started");
    }

    // ===== Workout Rendering =====
    function renderWorkout(){
      revertActiveDeleteSet(); // Reset any active delete mode
      const wrap = document.getElementById("workoutContent");
      const actions = document.getElementById("workoutActions");
      if(!activeWorkout){
        wrap.innerHTML = `
          <div class="workout-empty">
            <div>
              <div style="font-weight:700; margin-bottom:8px">No active workout</div>
              <div class="muted" style="margin-bottom:12px">Start a plan from the Exercise Library to begin tracking sets, weights and reps.</div>
              <button class="btn" id="gotoLibraryBtn2">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 7l-1.41 1.41L14.17 11H4v2h10.17l-2.58 2.59L13 17l5-5z"/></svg>
                <span class="btn-text">Go to Library</span>
              </button>
            </div>
          </div>
        `;
        actions.style.display = "none";
        clearInterval(workoutTimerInterval);
        wrap.querySelector("#gotoLibraryBtn2")?.addEventListener("click", () => setTab("library"));
        return;
      }

      actions.style.display = "flex";
      startWorkoutTimer();
      const totalSets = activeWorkout.exercises.reduce((a,e)=>a+(e.sets?.length||0),0);
      const doneSets = countCompletedSets(activeWorkout);

      let html = `
       <div class="workout-head">
         <div style="display:flex; align-items:center; gap:10px">
           <div style="font-weight:800; letter-spacing:.4px">${activeWorkout.name}</div>
           <div class="badges">
             ${activeWorkout.muscles.map(m=>`<span class="badge">${m}</span>`).join("")}
           </div>
         </div>
         <div style="display:flex; align-items:center; gap:10px">
           <div class="muted">${doneSets}/${totalSets} sets completed</div>
           <button class="btn secondary" id="editWorkoutBtn" title="Add exercises to workout">
             <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
           </button>
         </div>
       </div>
        <div class="exercise-list">
      `;

      activeWorkout.exercises.forEach((ex, ei)=>{
        const isTimeDistance = ex.trackingType === "time_distance";
        html += `
          <div class="exercise" data-ex="${ei}">
            <div class="row">
              <div>
                <div style="display:flex; align-items:center; gap:8px">
                  <button class="exercise-link-btn" data-link="${ex.exercise_link || '#'}" title="View Exercise Demo">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <div>
                    <div class="name exercise-name-btn" data-ex="${ei}">${ex.name}</div>
                    <div class="muscle">${ex.muscle}</div>
                  </div>
                </div>
              </div>
              <div style="display:flex; gap:8px">
                <button class="btn secondary" data-add-set="${ei}">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z"/></svg>
                  <span class="btn-text">Add Set</span>
                </button>
                ${ex.sets?.length ? `<button class="btn secondary" data-complete-all="${ei}">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z"/></svg>
                  <span class="btn-text">Complete All</span>
                </button>`:``}
              </div>
            </div>
            <div class="set-list">
              ${(ex.sets||[]).map((s, si)=>`
                <div class="set" data-ex="${ei}" data-set="${si}">
                  <div class="index set-index-btn" data-ei="${ei}" data-si="${si}">${si+1}</div>
                  ${isTimeDistance ? `
                    <input type="number" inputmode="decimal" step="0.1" placeholder="Time (min)" value="${s.time ?? ''}" data-time />
                    <input type="number" inputmode="decimal" step="0.1" placeholder="Distance (km)" value="${s.distance ?? ''}" data-distance />
                  ` : `
                    <input type="number" inputmode="decimal" step="0.5" placeholder="Weight (kg)" value="${s.weight ?? ''}" data-weight />
                    <input type="number" inputmode="numeric" step="1" placeholder="Reps" value="${s.reps ?? ''}" data-reps />
                  `}
                  <div class="complete ${s.completed?'checked':''}" data-complete title="Mark set complete">
                    ${s.completed ? '&#10003;' : ''}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      });

      html += `</div>`;
      wrap.innerHTML = html;

      // Bind events for exercise link buttons
      wrap.querySelectorAll('.exercise-link-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const link = this.getAttribute('data-link');
          if (link && link !== '#') {
            window.open(link, '_blank');
          } else {
            // Google the exercise name
            const exerciseEl = this.closest('.exercise');
            const ei = Number(exerciseEl.getAttribute('data-ex'));
            const ex = activeWorkout.exercises[ei];
            const query = encodeURIComponent(ex.name + ' exercise');
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
          }
        });
      });

      wrap.querySelectorAll("[data-add-set]").forEach(btn=>{
        btn.addEventListener("click", e=>{
          const ei = Number(btn.getAttribute("data-add-set"));
          addSet(ei);
        });
      });
      wrap.querySelectorAll("[data-complete-all]").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const ei = Number(btn.getAttribute("data-complete-all"));
          completeAllSets(ei);
        });
      });
      // Delegated for set list
      wrap.querySelectorAll(".set-list").forEach(list=>{
        list.addEventListener("input", onSetInput);
        list.addEventListener("click", onSetClick);
      });

      // Set index buttons
      wrap.querySelectorAll('.set-index-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const ei = Number(this.getAttribute('data-ei'));
          const si = Number(this.getAttribute('data-si'));
          handleSetIndexClick(ei, si, this);
        });
      });

      // Exercise name buttons
      wrap.querySelectorAll('.exercise-name-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          selectedExerciseIndex = Number(this.getAttribute('data-ex'));
          document.getElementById('exerciseOptionsModal').style.display = 'flex';
        });
      });

      // Edit workout button
      const editBtn = document.getElementById("editWorkoutBtn");
      if (editBtn) {
        editBtn.addEventListener("click", openExerciseSelector);
      }

      // Actions
      document.getElementById("finishWorkoutBtn").disabled = doneSets < totalSets;
    }

    function onSetInput(e){
      const target = e.target;
      const setEl = target.closest(".set");
      if(!setEl) return;
      const ei = Number(setEl.getAttribute("data-ex"));
      const si = Number(setEl.getAttribute("data-set"));
      if(!activeWorkout) return;

      const ex = activeWorkout.exercises[ei];
      const s  = ex.sets[si];
      if(target.hasAttribute("data-weight")) s.weight = Number(target.value || 0);
      if(target.hasAttribute("data-reps"))   s.reps   = Number(target.value || 0);
      if(target.hasAttribute("data-time"))   s.time   = Number(target.value || 0);
      if(target.hasAttribute("data-distance")) s.distance = Number(target.value || 0);
      saveActiveWorkout();
      updateWorkoutProgressBar();
    }
    function onSetClick(e){
      const btn = e.target.closest("[data-remove],[data-complete]");
      if(!btn) return;
      const setEl = e.target.closest(".set");
      const ei = Number(setEl.getAttribute("data-ex"));
      const si = Number(setEl.getAttribute("data-set"));

      if(btn.hasAttribute("data-remove")) removeSet(ei, si);
      if(btn.hasAttribute("data-complete")) toggleSetComplete(ei, si, btn);
    }
    function updateWorkoutProgressBar(){
      const content = document.getElementById("workoutContent");
      if(!activeWorkout || !content) return;
      const total = activeWorkout.exercises.reduce((a,e)=>a+(e.sets?.length||0),0);
      const done = countCompletedSets(activeWorkout);
      const head = content.querySelector(".workout-head .muted");
      if(head) head.textContent = `${done}/${total} sets completed`;
      const finishBtn = document.getElementById("finishWorkoutBtn");
      if(finishBtn) finishBtn.disabled = done === 0;
      saveActiveWorkout();
    }

    function addSet(ei){
      if(!activeWorkout) return;
      const ex = activeWorkout.exercises[ei];
      if(!ex.sets) ex.sets = [];
      const isTimeDistance = ex.trackingType === "time_distance";
      const newSet = isTimeDistance
        ? { time: 0, distance: 0, completed: false }
        : { weight: 0, reps: 0, completed: false };
      ex.sets.push(newSet);
      saveActiveWorkout();
      renderWorkout();
    }
    function removeSet(ei, si){
      if(!activeWorkout) return;
      const ex = activeWorkout.exercises[ei];
      ex.sets.splice(si,1);
      saveActiveWorkout();
      renderWorkout();
    }
    function toggleSetComplete(ei, si, btnEl){
      const s = activeWorkout.exercises[ei].sets[si];
      s.completed = !s.completed;
      saveActiveWorkout();
      btnEl.classList.toggle("checked", s.completed);
      btnEl.innerHTML = s.completed ? "&#10003;" : "";
      updateWorkoutProgressBar();

      // Auto-trigger break if set is completed
      if(s.completed){
        startBreakTimer();
      }
    }
    function completeAllSets(ei){
      const ex = activeWorkout.exercises[ei];
      if(!ex?.sets?.length) return;
      ex.sets.forEach(s => s.completed = true);
      saveActiveWorkout();
      renderWorkout();
    }

    function handleSetIndexClick(ei, si, btnEl){
      if(!activeWorkout) return;

      if(activeDeleteSet && activeDeleteSet.ei === ei && activeDeleteSet.si === si){
        // Second click: delete the set
        removeSet(ei, si);
        activeDeleteSet = null;
      } else {
        // First click: activate delete mode
        revertActiveDeleteSet();
        activeDeleteSet = {ei, si};
        btnEl.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#cbd5e1"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
        btnEl.classList.add('delete-mode');
      }
    }

    function revertActiveDeleteSet(){
      if(!activeDeleteSet) return;
      const btn = document.querySelector(`.set-index-btn[data-ei="${activeDeleteSet.ei}"][data-si="${activeDeleteSet.si}"]`);
      if(btn){
        btn.innerHTML = activeDeleteSet.si + 1;
        btn.classList.remove('delete-mode');
      }
      activeDeleteSet = null;
    }

    function discardWorkout(){
      const ok = confirm("Discard current workout? This cannot be undone.");
      if(!ok) return;
      activeWorkout = null;
      saveActiveWorkout();
      updateResumeChip();
      clearInterval(workoutTimerInterval);
      renderWorkout();
      showToast("Workout discarded", "warn");
    }

    function finishWorkout(){
      if(!activeWorkout) return;
      const totalSets = activeWorkout.exercises.reduce((a,e)=>a+(e.sets?.length||0),0);
      const totalDone = countCompletedSets(activeWorkout);
      if(totalDone < totalSets){
        // Show warning modal
        document.getElementById('incompleteModal').style.display = 'flex';
        return;
      }
      proceedFinishWorkout();
    }
    
    function proceedFinishWorkout(){
      if(!activeWorkout) return;

      const endTime = new Date().toISOString();
      // Build compact summary to store
      const record = {
        id: activeWorkout.id,
        templateId: activeWorkout.templateId,
        name: activeWorkout.name,
        dateKey: todayKey(),
        startTime: activeWorkout.startTime,
        endTime,
        minutes: minutesBetween(activeWorkout.startTime, endTime),
        exercises: activeWorkout.exercises.map(ex => ({
          name: ex.name,
          muscle: ex.muscle,
          sets: ex.sets.filter(s => s.reps || s.weight || s.time || s.distance || s.completed).map(s => {
            const isTimeDistance = ex.trackingType === "time_distance";
            return isTimeDistance ? {
              time: Number(s.time || 0),
              distance: Number(s.distance || 0),
              completed: !!s.completed
            } : {
              weight: Number(s.weight || 0),
              reps: Number(s.reps || 0),
              completed: !!s.completed
            };
          })
        }))
      };
      history.push(record);
      saveHistory();

      // Generate AI summary
      generateWorkoutSummary(record);

      // Clear active
      activeWorkout = null;
      saveActiveWorkout();
      updateResumeChip();
      clearInterval(workoutTimerInterval);

      setTab("calendar");
      renderCalendar();
      // Focus details on today
      const today = todayKey();
      renderDayDetails(today);
      showToast("Workout saved to calendar");
    }

    function updateResumeChip(){
      const resumeChip = document.getElementById("floatingResume");
      const generateChip = document.getElementById("floatingGenerate");
      if(activeWorkout && activeTab !== "workout"){
        resumeChip.style.display = "block";
        generateChip.style.display = "none";
      }else if(activeTab === "library"){
        resumeChip.style.display = "none";
        generateChip.style.display = "block";
      }else{
        resumeChip.style.display = "none";
        generateChip.style.display = "none";
      }
    }

    // ===== Exercise Selector Modal =====
    let selectedExercises = new Set();

    function openExerciseSelector(){
      if(!activeWorkout) return;
      selectedExercises.clear();
      renderExerciseSelector();
      document.getElementById('exerciseSelectorModal').style.display = 'flex';
    }

    function renderExerciseSelector(){
      const grid = document.getElementById("exerciseSelectorGrid");
      const activeMuscle = document.querySelector("#exerciseChips .chip.active")?.dataset.muscle || "All";
      const q = document.getElementById("exerciseSearchInput").value.trim().toLowerCase();

      let items = ALL_EXERCISES
        .filter(ex => {
          if(activeMuscle === "All") return true;
          return ex.muscles.some(muscle => muscle === activeMuscle);
        })
        .filter(ex => ex.name.toLowerCase().includes(q));

      // Filter out exercises already in the workout
      const existingNames = new Set(activeWorkout.exercises.map(ex => ex.name));
      items = items.filter(ex => !existingNames.has(ex.name));

      grid.innerHTML = "";
      if(items.length === 0){
        grid.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; text-align:center">
            <div class="muted">No exercises match your filters.</div>
          </div>
        `;
        return;
      }

      for(const ex of items){
        const isSelected = selectedExercises.has(ex.name);
        const el = document.createElement("div");
        el.className = `card ${isSelected ? 'selected' : ''}`;
        el.dataset.exercise = ex.name;
        el.innerHTML = `
          <div class="title-row">
            <h3>${ex.name}</h3>
          </div>
          <div class="badges">
            ${ex.muscles.map(m => `<span class="badge">${m}</span>`).join("")}
          </div>
          <div class="muted">${ex.muscle}</div>
        `;
        grid.appendChild(el);
      }
    }

    function addSelectedExercises(){
      if(!activeWorkout || selectedExercises.size === 0) return;

      const exercisesToAdd = Array.from(selectedExercises).map(name => {
        const ex = ALL_EXERCISES.find(e => e.name === name);
        const isTimeDistance = ex.trackingType === "time_distance";
        return {
          name: ex.name,
          muscle: ex.muscle,
          exercise_link: ex.exercise_link,
          trackingType: ex.trackingType || "weight_reps",
          sets: Array.from({ length: ex.defaultSets }, () => (
            isTimeDistance
              ? { time: 0, distance: 0, completed: false }
              : { weight: 0, reps: ex.defaultReps, completed: false }
          ))
        };
      });

      activeWorkout.exercises.push(...exercisesToAdd);
      saveActiveWorkout();
      renderWorkout();
      document.getElementById('exerciseSelectorModal').style.display = 'none';
      selectedExercises.clear();
      showToast(`Added ${exercisesToAdd.length} exercise${exercisesToAdd.length > 1 ? 's' : ''} to workout`);
    }

    // ===== Calendar =====
    function monthLabel(d){
      return d.toLocaleDateString(undefined, { month:"long", year:"numeric" });
    }
    function renderCalendar(){
      const label = document.getElementById("monthLabel");
      label.textContent = monthLabel(calendarCursor);

      const grid = document.getElementById("calendarGrid");
      grid.innerHTML = "";

      const y = calendarCursor.getFullYear();
      const m = calendarCursor.getMonth(); // 0..11
      const first = new Date(y, m, 1);
      const startDow = first.getDay(); // 0..6 Sun..Sat
      const daysInMonth = new Date(y, m+1, 0).getDate();

      // Map history days for quick lookup
      const dayMap = {};
      for(const r of history){
        if(!dayMap[r.dateKey]) dayMap[r.dateKey] = 0;
        dayMap[r.dateKey] += 1;
      }

      // leading blanks
      const prevMonthDays = new Date(y, m, 0).getDate();
      for(let i=0;i<startDow;i++){
        const dnum = prevMonthDays - (startDow - 1) + i;
        const dateKeyStr = todayKey(new Date(y, m-1, dnum));
        grid.appendChild(dayCell(dnum, true, dateKeyStr));
      }
      // current month days
      const todayStr = todayKey();
      for(let d=1; d<=daysInMonth; d++){
        const key = todayKey(new Date(y, m, d));
        const el = dayCell(d, false, key, key === todayStr, dayMap[key] > 0);
        grid.appendChild(el);
      }
      // trailing to fill grid to complete rows (optional)
      const totalCells = startDow + daysInMonth;
      const trailing = (7 - (totalCells % 7)) % 7;
      for(let i=1;i<=trailing;i++){
        const dateKeyStr = todayKey(new Date(y, m+1, i));
        grid.appendChild(dayCell(i, true, dateKeyStr));
      }
    }
    function dayCell(num, muted, key, isToday=false, hasWorkout=false){
      const div = document.createElement("button");
      div.className = "day" + (muted ? " muted" : "") + (isToday ? " today" : "");
      div.setAttribute("data-date", key);
      div.setAttribute("title", fmtDate(key));
      div.innerHTML = `
        <span class="num">${num}</span>
        <span class="dot" style="${hasWorkout ? "" : "visibility:hidden"}"></span>
      `;
      div.addEventListener("click", () => renderDayDetails(key));
      return div;
    }

    function renderDayDetails(dateKey){
      const box = document.getElementById("dayDetails");
      const title = document.getElementById("detailsTitle");
      const summary = document.getElementById("detailsSummary");
      const list = document.getElementById("detailsList");
    
      if(!dateKey){
        box.hidden = true;
        title.textContent = "Date";
        summary.textContent = "0 workouts";
        list.innerHTML = "";
        return;
      }
    
      const items = history.filter(h => h.dateKey === dateKey);
      title.textContent = fmtDate(dateKey);
      summary.textContent = `${items.length} workout${items.length !== 1 ? "s" : ""}`;
    
      // Render each saved workout as a clickable card that opens the detail modal
      list.innerHTML = items.map(r => {
        const totalSets = r.exercises.reduce((a, ex) => a + (ex.sets?.length || 0), 0);
        const doneSets = r.exercises.reduce((a, ex) => a + (ex.sets?.filter(s => s.completed).length || 0), 0);
        const parts = r.exercises.map(ex => {
          const sz = ex.sets?.length || 0;
          const dz = ex.sets?.filter(s => s.completed).length || 0;
          const hasTimeDistance = ex.sets?.some(s => s.time || s.distance);
          if (hasTimeDistance) {
            const totalTime = ex.sets?.reduce((sum, s) => sum + (s.time || 0), 0) || 0;
            const totalDistance = ex.sets?.reduce((sum, s) => sum + (s.distance || 0), 0) || 0;
            const timeStr = totalTime > 0 ? `${totalTime}min` : '';
            const distStr = totalDistance > 0 ? `${totalDistance}km` : '';
            const metrics = [timeStr, distStr].filter(Boolean).join('/');
            return `${ex.name} (${dz}/${sz}${metrics ? ` - ${metrics}` : ''})`;
          }
          return `${ex.name} (${dz}/${sz})`;
        }).join(" • ");
    
        // data-id to identify the record when clicked
        return `
          <button class="workout-item" data-workout-id="${r.id}" style="text-align:left; border: none; background: transparent; padding:0;">
            <div style="border:1px solid var(--border); border-radius:8px; padding:12px; background:var(--panel-2); display:flex; flex-direction:column; gap:8px">
              <div class="row" style="display:flex; align-items:center; justify-content:space-between">
                <div style="font-weight:700">${r.name}</div>
                <div class="muted">${r.minutes} min</div>
              </div>
              <div class="summary-sets">${doneSets}/${totalSets} sets completed</div>
              <div class="muted" style="font-size:12px">${parts}</div>
            </div>
          </button>
        `;
      }).join("");
    
      box.hidden = false;
    
      // Wire up click handlers to open the modal with full details
      list.querySelectorAll('.workout-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const wid = btn.getAttribute('data-workout-id');
          const record = history.find(h => h.id === wid);
          if (!record) return;
    
          const modal = document.getElementById('workoutDetailModal');
          const titleEl = document.getElementById('workoutDetailTitle');
          const body = document.getElementById('workoutDetailBody');
    
          titleEl.textContent = `${record.name} — ${fmtDate(record.dateKey)}`;
    
          // Build breakdown
          body.innerHTML = '';
          const meta = document.createElement('div');
          meta.className = 'muted';
          meta.textContent = `${record.minutes} minutes • ${record.exercises.length} exercise${record.exercises.length !== 1 ? 's' : ''}`;
          body.appendChild(meta);
    
          record.exercises.forEach(ex => {
            const exWrap = document.createElement('div');
            exWrap.style.border = '1px solid var(--border)';
            exWrap.style.borderRadius = '8px';
            exWrap.style.padding = '10px';
            exWrap.style.background = 'var(--panel)';
            exWrap.style.marginTop = '8px';
    
            const exHeader = document.createElement('div');
            exHeader.style.display = 'flex';
            exHeader.style.justifyContent = 'space-between';
            exHeader.style.alignItems = 'center';
            exHeader.innerHTML = `<div style="font-weight:700">${ex.name}</div><div class="muted">${ex.muscle}</div>`;
            exWrap.appendChild(exHeader);
    
            const setList = document.createElement('div');
            setList.style.marginTop = '8px';
            setList.style.display = 'flex';
            setList.style.flexDirection = 'column';
            setList.style.gap = '6px';
    
            (ex.sets || []).forEach((s, i) => {
              const setEl = document.createElement('div');
              setEl.style.display = 'flex';
              setEl.style.justifyContent = 'space-between';
              setEl.style.alignItems = 'center';
              setEl.style.gap = '8px';
    
              const left = document.createElement('div');
              left.textContent = `Set ${i+1}`;
              left.style.fontWeight = '600';
    
              const right = document.createElement('div');
              right.className = 'muted';
              if ('time' in s || 'distance' in s) {
                const timeStr = s.time ? `${s.time}min` : '';
                const distStr = s.distance ? `${s.distance}km` : '';
                right.textContent = [timeStr, distStr].filter(Boolean).join(' / ') || (s.completed ? 'Done' : '—');
              } else {
                right.textContent = `${s.weight || 0}kg × ${s.reps || 0} reps ${s.completed ? '• ✔' : ''}`;
              }
    
              setEl.appendChild(left);
              setEl.appendChild(right);
              setList.appendChild(setEl);
            });
    
            exWrap.appendChild(setList);
            body.appendChild(exWrap);
          });
    
          // Ensure share button exists in modal footer (create if missing)
          const modalContent = modal.querySelector('.modal-content');
          let footer = modalContent.querySelector('.modal-footer');
          if (!footer) {
            footer = document.createElement('div');
            footer.className = 'modal-footer';
            footer.style.display = 'flex';
            footer.style.gap = '8px';
            footer.style.justifyContent = 'flex-end';
            footer.style.marginTop = '12px';
            // append before the close button container if present
            modalContent.appendChild(footer);
          } else {
            footer.innerHTML = '';
          }
    
          // Share button
          const shareBtn = document.createElement('button');
          shareBtn.className = 'btn';
          shareBtn.id = 'shareWorkoutBtn';
          shareBtn.textContent = 'Share';
          shareBtn.addEventListener('click', () => {
            // Build a concise share text
            const parts = [];
            parts.push(`${record.name} • ${record.minutes} min • ${record.exercises.length} exercises`);
            record.exercises.forEach(ex => {
              const sets = (ex.sets || []).map(s => {
                if ('time' in s || 'distance' in s) {
                  return `${s.time || 0}min/${s.distance || 0}km`;
                }
                return `${s.weight || 0}kg×${s.reps || 0}`;
              }).join(', ');
              parts.push(`${ex.name}: ${sets}`);
            });
            const text = parts.join('\n');
            if (navigator.share) {
              navigator.share({ title: record.name, text }).catch(()=>{/* ignore */});
            } else {
              // fallback copy to clipboard
              navigator.clipboard?.writeText(text).then(()=> showToast('Workout copied to clipboard'), ()=> showToast('Copy failed','error'));
            }
          });
    
          // Close button (ensure also present)
          const closeFooterBtn = document.createElement('button');
          closeFooterBtn.className = 'btn secondary';
          closeFooterBtn.textContent = 'Close';
          closeFooterBtn.addEventListener('click', () => {
            modal.style.display = 'none';
          });
    
          footer.appendChild(shareBtn);
          footer.appendChild(closeFooterBtn);
    
          // Show modal
          modal.style.display = 'flex';
    
          // Wire up top-right close (if present)
          const topClose = document.getElementById('closeWorkoutDetail');
          if (topClose) topClose.onclick = () => { modal.style.display = 'none'; };
        });
      });
    }

    function removeIncompleteSets(){
      if(!activeWorkout) return;
      activeWorkout.exercises.forEach(ex => {
        if(ex.sets){
          ex.sets = ex.sets.filter(s => s.completed);
        }
      });
      saveActiveWorkout();
      renderWorkout();
    }

    // Generate custom workout
    async function generateCustomWorkout() {
      const description = document.getElementById('workoutDescription').value.trim();
      if (!description) {
        showToast('Please enter a workout description', 'warn');
        return;
      }
      const apiKey = loadApiKey();
      if (!apiKey) {
        document.getElementById('apiKeyMessage').style.display = 'block';
        document.getElementById('userModal').style.display = 'flex';
        return;
      }
      // Show loading
      document.getElementById('generateBtn').disabled = true;
      document.getElementById('generateBtn').textContent = 'Generating...';
      try {
        const ai = new GoogleGenAI({ apiKey });
        // Parse exercise count from description
        const countMatch = description.match(/(\d+)\s*(?:exercises?|exs?)/i);
        const exerciseCount = countMatch ? parseInt(countMatch[1]) : null;
        const countInstruction = exerciseCount ? `Include exactly ${exerciseCount} exercises.` : 'Include 4-6 exercises.';

        const prompt = `Generate a workout plan based on this description: "${description}".

Output in JSON format with the following structure:

{
 "id": "unique-id",
 "name": "Workout Name",
 "muscles": ["Muscle1", "Muscle2"],
 "exercises": [
   {
     "name": "Exercise Name",
     "muscle": "Muscle",
     "defaultSets": 3,
     "defaultReps": 10,
     "exercise_link": "https://musclewiki.com/exercise/example"
   }
 ]
}

Make sure the exercises are real and have valid musclewiki links. ${countInstruction}`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                muscles: { type: 'array', items: { type: 'string' } },
                exercises: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      muscle: { type: 'string' },
                      defaultSets: { type: 'number' },
                      defaultReps: { type: 'number' },
                      exercise_link: { type: 'string' }
                    },
                    required: ['name', 'muscle', 'defaultSets', 'defaultReps', 'exercise_link']
                  }
                }
              },
              required: ['id', 'name', 'muscles', 'exercises']
            }
          }
        });
        const workout = JSON.parse(response.candidates[0].content.parts[0].text);
        workout.isCustom = true;
        // Add to templates
        WORKOUT_TEMPLATES.push(workout);
        // Close modal
        document.getElementById('generateModal').style.display = 'none';
        document.getElementById('workoutDescription').value = '';
        // Re-render library
        renderLibrary();
        showToast('Custom workout generated!');
      } catch (error) {
        console.error('Error generating workout:', error);
        showToast('Failed to generate workout', 'error');
      } finally {
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('generateBtn').textContent = 'Generate';
      }
    }

    // Generate workout summary
    async function generateWorkoutSummary(currentWorkout) {
      const apiKey = loadApiKey();
      if (!apiKey) {
        showToast('Set Gemini API key for workout summaries', 'warn');
        return;
      }

      // Get past workouts of same name
      const pastWorkouts = history.filter(h => h.name === currentWorkout.name && h.dateKey !== currentWorkout.dateKey).sort((a,b) => b.dateKey.localeCompare(a.dateKey)).slice(0,3);

      const prompt = `Analyze this workout and provide a concise summary with ratings.

Current workout: ${JSON.stringify(currentWorkout)}

Past workouts: ${JSON.stringify(pastWorkouts)}

Provide in JSON:

{
 "rating": "X/10 (brief reason)",
 "keyMetrics": "Brief summary of sets, weights, time",
 "comparison": "How it compares to past (if any)",
 "tips": "2-3 short improvement tips"
}

Keep everything minimal and actionable.`;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                rating: { type: 'string' },
                keyMetrics: { type: 'string' },
                comparison: { type: 'string' },
                tips: { type: 'string' }
              },
              required: ['rating', 'keyMetrics', 'comparison', 'tips']
            }
          }
        });
        const result = JSON.parse(response.candidates[0].content.parts[0].text);
        showWorkoutSummaryModal(result);
      } catch (error) {
        console.error('Error generating summary:', error);
        showToast('Failed to generate workout summary', 'error');
      }
    }

    function showWorkoutSummaryModal(result) {
      document.getElementById('summaryContent').innerHTML = `
        <p><strong>Rating:</strong> ${result.rating}</p>
        <p><strong>Key Metrics:</strong> ${result.keyMetrics}</p>
        <p><strong>Comparison:</strong> ${result.comparison}</p>
        <p><strong>Tips:</strong> ${result.tips}</p>
      `;
      document.getElementById('summaryModal').style.display = 'flex';
    }

    // ===== Event Bindings and Initialization =====
    function bindEvents(){
      // Tabs
      document.getElementById("tab-library").addEventListener("click", () => setTab("library"));
      document.getElementById("tab-workout").addEventListener("click", () => setTab("workout"));
      document.getElementById("tab-calendar").addEventListener("click", () => setTab("calendar"));

      // User modal
        document.getElementById('logoutBtn').addEventListener('click', () => {
          auth.signOut();
          document.getElementById('userModal').style.display = 'none';
        });
        document.getElementById('backBtn').addEventListener('click', () => {
          document.getElementById('userModal').style.display = 'none';
        });
        document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
          const key = document.getElementById('apiKeyInput').value.trim();
          const breakDurationValue = parseInt(document.getElementById('breakDurationSelect').value);
          saveApiKey(key);
          saveBreakDuration(breakDurationValue);
          breakDuration = breakDurationValue;
          document.getElementById('apiKeyMessage').style.display = 'none';
          showToast('Settings saved');
        });

      // Incomplete sets modal
      document.getElementById('continueWorkoutBtn').addEventListener('click', () => {
        document.getElementById('incompleteModal').style.display = 'none';
      });
      document.getElementById('removeIncompleteBtn').addEventListener('click', () => {
        removeIncompleteSets();
        document.getElementById('incompleteModal').style.display = 'none';
        // Small delay to allow UI update
        setTimeout(() => {
          proceedFinishWorkout();
        }, 100);
      });

      // Floating resume
      document.getElementById("floatingResume").addEventListener("click", () => setTab("workout"));

      // Workout persistent actions
      document.getElementById("finishWorkoutBtn").addEventListener("click", finishWorkout);
      document.getElementById("discardWorkoutBtn").addEventListener("click", discardWorkout);
      document.getElementById("breakBtn").addEventListener("click", startBreakTimer);

      // Go to Library buttons (present in different states)
      document.getElementById("gotoLibraryBtn")?.addEventListener("click", () => setTab("library"));
      // The renderWorkout adds #gotoLibraryBtn2 when empty; it binds its own handler after rendering

      // Library filters
      const chips = document.getElementById("muscleChips");
      chips.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if(!chip) return;
        chips.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
        renderLibrary();
      });

      // Library search
      const search = document.getElementById("searchInput");
      search.addEventListener("input", renderLibrary);

      // Library actions (delegated)
      const grid = document.getElementById("libraryGrid");
      grid.addEventListener("click", (e) => {
        const startBtn = e.target.closest("[data-start]");
        if(startBtn){
          startWorkoutFromTemplate(startBtn.getAttribute("data-start"));
          return;
        }
        const prevBtn = e.target.closest("[data-preview]");
        if(prevBtn){
          // Show preview modal for this template id
          const tid = prevBtn.getAttribute("data-preview");
          showTemplatePreview(tid);
          return;
        }
      });

      // Calendar controls
      document.getElementById("prevMonthBtn").addEventListener("click", () => {
        calendarCursor.setMonth(calendarCursor.getMonth() - 1);
        renderCalendar();
        renderDayDetails(null);
      });
      document.getElementById("nextMonthBtn").addEventListener("click", () => {
        calendarCursor.setMonth(calendarCursor.getMonth() + 1);
        renderCalendar();
        renderDayDetails(null);
      });
      document.getElementById("todayBtn").addEventListener("click", () => {
        calendarCursor = new Date();
        renderCalendar();
        const key = todayKey();
        renderDayDetails(key);
      });

      // Generate custom workout
      document.getElementById('floatingGenerate').addEventListener('click', () => {
        document.getElementById('generateModal').style.display = 'flex';
      });
      document.getElementById('cancelGenerateBtn').addEventListener('click', () => {
        document.getElementById('generateModal').style.display = 'none';
      });
      document.getElementById('generateBtn').addEventListener('click', generateCustomWorkout);

      // Suggested prompts (chips)
      const promptSuggestionWrap = document.getElementById('promptSuggestions');
      if (promptSuggestionWrap) {
        promptSuggestionWrap.addEventListener('click', (e) => {
          const chip = e.target.closest('[data-suggest-prompt]');
          if (!chip) return;
          const val = chip.getAttribute('data-suggest-prompt') || '';
          const input = document.getElementById('workoutDescription');
          if (input) input.value = val;
        });
      }

      // Workout summary modal
      const closeSummaryBtn = document.getElementById('closeSummaryModal');
      if (closeSummaryBtn) {
        closeSummaryBtn.addEventListener('click', () => {
          document.getElementById('summaryModal').style.display = 'none';
        });
      }

      // Exercise selector modal
      const exerciseChips = document.getElementById("exerciseChips");
      exerciseChips.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if(!chip) return;
        exerciseChips.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
        renderExerciseSelector();
      });
      document.getElementById("exerciseSearchInput").addEventListener("input", renderExerciseSelector);
      document.getElementById("exerciseSelectorGrid").addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if(!card) return;
        const exerciseName = card.dataset.exercise;
        if(selectedExercises.has(exerciseName)){
          selectedExercises.delete(exerciseName);
          card.classList.remove("selected");
        } else {
          selectedExercises.add(exerciseName);
          card.classList.add("selected");
        }
      });
      document.getElementById('addSelectedExercisesBtn').addEventListener('click', addSelectedExercises);
      document.getElementById('cancelExerciseSelectorBtn').addEventListener('click', () => {
        document.getElementById('exerciseSelectorModal').style.display = 'none';
        selectedExercises.clear();
      });

      // Exercise options modal
      document.getElementById('previewExerciseBtn').addEventListener('click', () => {
        if (selectedExerciseIndex !== null && activeWorkout) {
          const ex = activeWorkout.exercises[selectedExerciseIndex];
          if (ex.exercise_link && ex.exercise_link !== '#') {
            window.open(ex.exercise_link, '_blank');
          } else {
            const query = encodeURIComponent(ex.name + ' exercise');
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
          }
        }
        document.getElementById('exerciseOptionsModal').style.display = 'none';
      });

      document.getElementById('removeExerciseBtn').addEventListener('click', () => {
        if (selectedExerciseIndex !== null && activeWorkout) {
          activeWorkout.exercises.splice(selectedExerciseIndex, 1);
          saveActiveWorkout();
          renderWorkout();
          showToast('Exercise removed from workout');
        }
        document.getElementById('exerciseOptionsModal').style.display = 'none';
      });

      document.getElementById('cancelExerciseOptionsBtn').addEventListener('click', () => {
        document.getElementById('exerciseOptionsModal').style.display = 'none';
      });

      // Break modal
      const breakMinus30 = document.getElementById('breakMinus30');
      if (breakMinus30) breakMinus30.addEventListener('click', () => modifyBreakTime(-30));
      const breakMinus10 = document.getElementById('breakMinus10');
      if (breakMinus10) breakMinus10.addEventListener('click', () => modifyBreakTime(-10));
      const breakEnd = document.getElementById('breakEnd');
      if (breakEnd) breakEnd.addEventListener('click', endBreakTimer);
      const breakPlus10 = document.getElementById('breakPlus10');
      if (breakPlus10) breakPlus10.addEventListener('click', () => modifyBreakTime(10));
      const breakPlus30 = document.getElementById('breakPlus30');
      if (breakPlus30) breakPlus30.addEventListener('click', () => modifyBreakTime(30));
      const closeBreakModal = document.getElementById('closeBreakModal');
      if (closeBreakModal) closeBreakModal.addEventListener('click', endBreakTimer);

      // Global click to revert active delete set
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.set-index-btn')) {
          revertActiveDeleteSet();
        }
      });
    }

    function init(){
       breakDuration = loadBreakDuration();
       calendarCursor = new Date();
       updateResumeChip();
       renderLibrary();
       renderCalendar();
       const today = todayKey();
       renderDayDetails(today);
       bindEvents();

       // Register service worker
       if ('serviceWorker' in navigator) {
         navigator.serviceWorker.register('/sw.js')
           .then((registration) => {
             console.log('Service Worker registered with scope:', registration.scope);
           })
           .catch((error) => {
             console.log('Service Worker registration failed:', error);
           });
       }
     }

    // Kick off
    init();