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
        document.getElementById('loginBtn').textContent = `Hi, ${user.displayName}`;
        document.getElementById('loginBtn').onclick = () => auth.signOut();
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

    const WORKOUT_TEMPLATES = [
      {
        id: "push-day",
        name: "Push Day (Chest/Shoulders/Triceps)",
        muscles: ["Chest","Shoulders","Arms"],
        exercises: [
          { name:"Barbell Bench Press", muscle:"Chest", defaultSets:3, defaultReps:10 },
          { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:10 },
          { name:"Incline Dumbbell Press", muscle:"Chest", defaultSets:3, defaultReps:10 },
          { name:"Lateral Raises", muscle:"Shoulders", defaultSets:3, defaultReps:12 },
          { name:"Triceps Pushdown", muscle:"Arms", defaultSets:3, defaultReps:12 }
        ]
      },
      {
        id: "pull-day",
        name: "Pull Day (Back/Biceps)",
        muscles: ["Back","Arms","Shoulders"],
        exercises: [
          { name:"Deadlift", muscle:"Back", defaultSets:3, defaultReps:5 },
          { name:"Barbell Row", muscle:"Back", defaultSets:3, defaultReps:8 },
          { name:"Lat Pulldown", muscle:"Back", defaultSets:3, defaultReps:10 },
          { name:"Face Pull", muscle:"Shoulders", defaultSets:3, defaultReps:12 },
          { name:"Barbell Curl", muscle:"Arms", defaultSets:3, defaultReps:10 }
        ]
      },
      {
        id: "leg-day",
        name: "Leg Day (Quads/Glutes/Hamstrings)",
        muscles: ["Legs","Core"],
        exercises: [
          { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:8 },
          { name:"Romanian Deadlift", muscle:"Legs", defaultSets:3, defaultReps:8 },
          { name:"Leg Press", muscle:"Legs", defaultSets:3, defaultReps:10 },
          { name:"Leg Extension", muscle:"Legs", defaultSets:2, defaultReps:12 },
          { name:"Standing Calf Raise", muscle:"Legs", defaultSets:3, defaultReps:15 },
          { name:"Ab Wheel", muscle:"Core", defaultSets:2, defaultReps:10 }
        ]
      },
      {
        id: "full-body",
        name: "Full Body (Classic)",
        muscles: ["Full Body","Legs","Chest","Back"],
        exercises: [
          { name:"Back Squat", muscle:"Legs", defaultSets:3, defaultReps:8 },
          { name:"Bench Press", muscle:"Chest", defaultSets:3, defaultReps:10 },
          { name:"Barbell Row", muscle:"Back", defaultSets:3, defaultReps:8 }
        ]
      },
      {
        id: "upper-body",
        name: "Upper Body",
        muscles: ["Chest","Back","Shoulders","Arms"],
        exercises: [
          { name:"Bench Press", muscle:"Chest", defaultSets:3, defaultReps:10 },
          { name:"Overhead Press", muscle:"Shoulders", defaultSets:3, defaultReps:10 },
          { name:"Pull-ups", muscle:"Back", defaultSets:3, defaultReps:8 },
          { name:"Seated Row", muscle:"Back", defaultSets:3, defaultReps:10 },
          { name:"EZ Bar Curl", muscle:"Arms", defaultSets:2, defaultReps:10 },
          { name:"Dips", muscle:"Arms", defaultSets:2, defaultReps:10 }
        ]
      },
      {
        id: "lower-body",
        name: "Lower Body",
        muscles: ["Legs","Core"],
        exercises: [
          { name:"Back Squat", muscle:"Legs", defaultSets:4, defaultReps:8 },
          { name:"Conventional Deadlift", muscle:"Legs", defaultSets:3, defaultReps:5 },
          { name:"Walking Lunges", muscle:"Legs", defaultSets:2, defaultReps:10 },
          { name:"Hamstring Curl", muscle:"Legs", defaultSets:2, defaultReps:12 },
          { name:"Seated Calf Raise", muscle:"Legs", defaultSets:3, defaultReps:15 }
        ]
      },
      {
        id: "chest-focus",
        name: "Chest Focus",
        muscles: ["Chest","Arms","Shoulders"],
        exercises: [
          { name:"Flat DB Press", muscle:"Chest", defaultSets:3, defaultReps:10 },
          { name:"Incline Bench Press", muscle:"Chest", defaultSets:3, defaultReps:10 },
          { name:"Cable Fly", muscle:"Chest", defaultSets:3, defaultReps:12 },
          { name:"Dips", muscle:"Arms", defaultSets:2, defaultReps:10 },
          { name:"Front Raises", muscle:"Shoulders", defaultSets:2, defaultReps:12 }
        ]
      },
      {
        id: "back-focus",
        name: "Back Focus",
        muscles: ["Back","Arms","Shoulders"],
        exercises: [
          { name:"Deadlift", muscle:"Back", defaultSets:3, defaultReps:5 },
          { name:"Weighted Pull-ups", muscle:"Back", defaultSets:3, defaultReps:8 },
          { name:"Chest Supported Row", muscle:"Back", defaultSets:3, defaultReps:10 },
          { name:"Straight Arm Pulldown", muscle:"Back", defaultSets:2, defaultReps:12 },
          { name:"Dumbbell Shrugs", muscle:"Shoulders", defaultSets:2, defaultReps:12 }
        ]
      }
    ];

    // ===== State =====
    let activeTab = "library"; // "library" | "workout" | "calendar"
    let history = [];
    let activeWorkout = null;
    let calendarCursor = new Date(); // month being viewed

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
    function showToast(text, kind="success"){
      const toast = document.getElementById("toast");
      toast.textContent = text;
      toast.classList.remove("show");
      // color by kind
      if(kind==="success"){
        toast.style.background = "rgba(16,185,129,.18)";
        toast.style.borderColor = "rgba(16,185,129,.4)";
        toast.style.color = "#ecfeff";
      }else if(kind==="warn"){
        toast.style.background = "rgba(245,158,11,.18)";
        toast.style.borderColor = "rgba(245,158,11,.4)";
        toast.style.color = "#fff7ed";
      }else{
        toast.style.background = "rgba(239,68,68,.18)";
        toast.style.borderColor = "rgba(239,68,68,.4)";
        toast.style.color = "#fee2e2";
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
      if(name === "calendar") { renderCalendar(); renderDayDetails(null); }
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

      const items = WORKOUT_TEMPLATES
        .filter(w => activeMuscle==="All" || w.muscles.includes(activeMuscle))
        .filter(w => w.name.toLowerCase().includes(q));

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
            <h3>${w.name}</h3>
            <div class="muted">${w.exercises.length} exercises</div>
          </div>
          <div class="badges">
            ${w.muscles.map(m => `<span class="badge">${m}</span>`).join("")}
          </div>
          ${last ? `<div class="last-performed">Last performed: ${fmtDate(last)}</div>` : `<div class="muted ghost">Not performed yet</div>`}
          <div class="actions">
            <button class="btn" data-start="${w.id}" title="Start this workout">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <span class="btn-text">Start Workout</span>
            </button>
            <button class="btn secondary" data-preview="${w.id}" title="Preview exercises">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 6a9.77 9.77 0 018.94 6A9.77 9.77 0 0112 18a9.77 9.77 0 01-8.94-6A9.77 9.77 0 0112 6zm0 2C8.55 8 5.65 9.82 4.35 12 5.65 14.18 8.55 16 12 16s6.35-1.82 7.65-4C18.35 9.82 15.45 8 12 8zm0 2a2 2 0 110 4 2 2 0 010-4z"/></svg>
              <span class="btn-text">Preview</span>
            </button>
          </div>
        `;
        grid.appendChild(el);
      }
    }

    function getTemplateById(tid){ return WORKOUT_TEMPLATES.find(w => w.id === tid); }

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
          sets: Array.from({ length: ex.defaultSets }, () => ({
            weight: 0,
            reps: ex.defaultReps,
            completed: false
          }))
        }))
      };
      saveActiveWorkout();
      updateResumeChip();
      setTab("workout");
      showToast("Workout started");
    }

    // ===== Workout Rendering =====
    function renderWorkout(){
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
        wrap.querySelector("#gotoLibraryBtn2")?.addEventListener("click", () => setTab("library"));
        return;
      }

      actions.style.display = "flex";
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
          <div class="muted">${doneSets}/${totalSets} sets completed</div>
        </div>
        <div class="exercise-list">
      `;

      activeWorkout.exercises.forEach((ex, ei)=>{
        html += `
          <div class="exercise" data-ex="${ei}">
            <div class="row">
              <div>
                <div class="name">${ex.name}</div>
                <div class="muscle">${ex.muscle}</div>
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
                  <div class="index">${si+1}</div>
                  <input type="number" inputmode="decimal" step="0.5" placeholder="Weight (kg)" value="${s.weight ?? ''}" data-weight />
                  <input type="number" inputmode="numeric" step="1" placeholder="Reps" value="${s.reps ?? ''}" data-reps />
                  <div class="complete ${s.completed?'checked':''}" data-complete title="Mark set complete">
                    ${s.completed ? '&#10003;' : ''}
                  </div>
                  <div class="icon-btn" data-remove title="Remove set">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#cbd5e1"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      });

      html += `</div>`;
      wrap.innerHTML = html;

      // Bind events
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

      // Actions
      document.getElementById("finishWorkoutBtn").disabled = doneSets === 0;
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
      ex.sets.push({ weight: 0, reps: 0, completed: false });
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
    }
    function completeAllSets(ei){
      const ex = activeWorkout.exercises[ei];
      if(!ex?.sets?.length) return;
      ex.sets.forEach(s => s.completed = true);
      saveActiveWorkout();
      renderWorkout();
    }

    function discardWorkout(){
      const ok = confirm("Discard current workout? This cannot be undone.");
      if(!ok) return;
      activeWorkout = null;
      saveActiveWorkout();
      updateResumeChip();
      renderWorkout();
      showToast("Workout discarded", "warn");
    }

    function finishWorkout(){
      if(!activeWorkout) return;
      const totalDone = countCompletedSets(activeWorkout);
      if(totalDone === 0){
        showToast("Mark at least one set complete before finishing", "warn");
        return;
      }
      const ok = confirm("Finish workout and save to calendar?");
      if(!ok) return;

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
          sets: ex.sets.filter(s => s.reps || s.weight || s.completed).map(s => ({
            weight: Number(s.weight || 0),
            reps: Number(s.reps || 0),
            completed: !!s.completed
          }))
        }))
      };
      history.push(record);
      saveHistory();

      // Clear active
      activeWorkout = null;
      saveActiveWorkout();
      updateResumeChip();

      setTab("calendar");
      renderCalendar();
      // Focus details on today
      const today = todayKey();
      renderDayDetails(today);
      showToast("Workout saved to calendar");
    }

    function updateResumeChip(){
      const chip = document.getElementById("resumeChip");
      if(activeWorkout){
        chip.style.display = "inline-flex";
      }else{
        chip.style.display = "none";
      }
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

      list.innerHTML = items.map(r => {
        const totalSets = r.exercises.reduce((a, ex) => a + (ex.sets?.length || 0), 0);
        const doneSets = r.exercises.reduce((a, ex) => a + (ex.sets?.filter(s => s.completed).length || 0), 0);
        const parts = r.exercises.map(ex => {
          const sz = ex.sets?.length || 0;
          const dz = ex.sets?.filter(s => s.completed).length || 0;
          return `${ex.name} (${dz}/${sz})`;
        }).join(" • ");
        return `
          <div class="workout-item">
            <div class="row">
              <div>${r.name}</div>
              <div class="muted">${r.minutes} min</div>
            </div>
            <div class="summary-sets">${doneSets}/${totalSets} sets completed</div>
            <div class="muted" style="font-size:12px">${parts}</div>
          </div>
        `;
      }).join("");

      box.hidden = false;
    }

    // ===== Event Bindings and Initialization =====
    function bindEvents(){
      // Tabs
      document.getElementById("tab-library").addEventListener("click", () => setTab("library"));
      document.getElementById("tab-workout").addEventListener("click", () => setTab("workout"));
      document.getElementById("tab-calendar").addEventListener("click", () => setTab("calendar"));

      // Resume chip
      document.getElementById("resumeChip").addEventListener("click", () => setTab("workout"));

      // Workout persistent actions
      document.getElementById("finishWorkoutBtn").addEventListener("click", finishWorkout);
      document.getElementById("discardWorkoutBtn").addEventListener("click", discardWorkout);

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
          const t = getTemplateById(prevBtn.getAttribute("data-preview"));
          if(t){
            const lines = t.exercises.map(ex => `• ${ex.name} — ${ex.muscle}`).join("\n");
            alert(`${t.name}\n\n${lines}`);
          }
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
    }

    function init(){
      updateResumeChip();
      renderLibrary();
      renderCalendar();
      renderDayDetails(null);
      bindEvents();
    }

    // Kick off
    init();