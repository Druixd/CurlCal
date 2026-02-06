    import { GoogleGenAI } from 'https://esm.run/@google/genai';

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    let currentUser = null;
    
    // ===== Token Management =====
    const LS_AUTH_TOKEN = "GYM_AUTH_TOKEN_V1";
    const LS_AUTH_TOKEN_EXPIRY = "GYM_AUTH_TOKEN_EXPIRY_V1";
    const LS_USER_DISPLAY_NAME = "GYM_USER_DISPLAY_NAME_V1";
    const LS_USER_UID = "GYM_USER_UID_V1";
    const TOKEN_EXPIRY_DAYS = 30;
    
    function generateAuthToken() {
      // Generate a unique token and store with expiry
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const expiryTime = Date.now() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      localStorage.setItem(LS_AUTH_TOKEN, token);
      localStorage.setItem(LS_AUTH_TOKEN_EXPIRY, expiryTime.toString());
      return token;
    }
    
    function isTokenValid() {
      const token = localStorage.getItem(LS_AUTH_TOKEN);
      const expiry = localStorage.getItem(LS_AUTH_TOKEN_EXPIRY);
      
      if (!token || !expiry) return false;
      
      const expiryTime = parseInt(expiry);
      return Date.now() < expiryTime;
    }
    
    function clearAuthToken() {
      localStorage.removeItem(LS_AUTH_TOKEN);
      localStorage.removeItem(LS_AUTH_TOKEN_EXPIRY);
      localStorage.removeItem(LS_USER_DISPLAY_NAME);
      localStorage.removeItem(LS_USER_UID);
    }
    
    function saveUserSession(user) {
      generateAuthToken();
      localStorage.setItem(LS_USER_DISPLAY_NAME, user.displayName || '');
      localStorage.setItem(LS_USER_UID, user.uid);
    }
    
    function loadUserSession() {
      if (!isTokenValid()) return null;
      return {
        displayName: localStorage.getItem(LS_USER_DISPLAY_NAME),
        uid: localStorage.getItem(LS_USER_UID)
      };
    }
    
    function openUserModal() {
      document.getElementById('apiKeyInput').value = loadApiKey();
      document.getElementById('breakDurationSelect').value = loadBreakDuration().toString();
      document.getElementById('autoRestTimerToggle').checked = loadAutoRest();
      document.getElementById('soundEffectsToggle').checked = loadSoundEffects();
      document.getElementById('inlineCalcToggle').checked = loadInlineCalc();
      document.getElementById('weightInput').value = loadUserWeight().toString();
      document.getElementById('heightInput').value = loadUserHeight().toString();
      document.getElementById('apiKeyMessage').style.display = loadApiKey() ? 'none' : 'block';

      // Update BMR display
      const bmr = calculateBMR();
      document.getElementById('bmrDisplay').textContent = `BMR: ${bmr} cal/day • Weight: ${loadUserWeight()}kg • Height: ${loadUserHeight()}ft`;
      document.getElementById('userModal').style.display = 'flex';
    }
    
    // Check for valid token on app load (no Firebase call needed)
    function initializeAuthState() {
      const sessionUser = loadUserSession();
      
      if (sessionUser && sessionUser.uid) {
        // Token is valid, use cached user data
        currentUser = {
          displayName: sessionUser.displayName,
          uid: sessionUser.uid
        };
        console.log('User restored from token:', currentUser.displayName);
        document.getElementById('loginBtn').textContent = truncateName(currentUser.displayName);
        document.getElementById('loginBtn').onclick = openUserModal;
        loadUserData(currentUser.uid);
      } else {
        // No valid token, user is logged out
        currentUser = null;
        document.getElementById('loginBtn').textContent = 'Login with Google';
        document.getElementById('loginBtn').onclick = loginWithGoogle;
        // Load from localStorage
        history = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
        activeWorkout = JSON.parse(localStorage.getItem(LS_ACTIVE) || "null");
        userCustomWorkouts = loadCustomWorkouts();
        userCustomExercises = loadCustomExercises();
        favoriteWorkoutIds = new Set(loadFavoriteWorkoutIds());
        syncUserCustomData();
        updateResumeChip();
        renderLibrary();
        renderCalendar();
        renderDayDetails(null);
      }
    }
    
    // Auth state observer - only for real-time updates after login/logout
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User just logged in via Firebase
        currentUser = user;
        console.log('User signed in via Firebase:', user.displayName);
        saveUserSession(user);
        document.getElementById('loginBtn').textContent = truncateName(user.displayName);
        document.getElementById('loginBtn').onclick = openUserModal;
        loadUserData(user.uid);
      } else {
        // User just logged out
        currentUser = null;
        clearAuthToken();
        document.getElementById('loginBtn').textContent = 'Login with Google';
        document.getElementById('loginBtn').onclick = loginWithGoogle;
        // Load from localStorage
        history = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
        activeWorkout = JSON.parse(localStorage.getItem(LS_ACTIVE) || "null");
        userCustomWorkouts = loadCustomWorkouts();
        userCustomExercises = loadCustomExercises();
        favoriteWorkoutIds = new Set(loadFavoriteWorkoutIds());
        syncUserCustomData();
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
          // Try to close popup window if it exists
          try {
            if (window.opener) {
              window.close();
            }
          } catch (e) {
            // Ignore Cross-Origin-Opener-Policy errors
            console.log('Popup close blocked by browser policy');
          }
        })
        .catch((error) => {
          console.error('Login error:', error);
          showToast('Login failed', 'error');
          // Try to close popup window on error too
          try {
            if (window.opener) {
              window.close();
            }
          } catch (e) {
            // Ignore Cross-Origin-Opener-Policy errors
          }
        });
    }
    
    // Load user data from Firestore
    async function loadUserData(uid) {
      try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
          const data = doc.data() || {};
          history = Array.isArray(data.history) ? data.history : [];
          activeWorkout = data.activeWorkout || null;
          userCustomWorkouts = Array.isArray(data.customWorkouts) ? data.customWorkouts : [];
          userCustomExercises = Array.isArray(data.customExercises) ? data.customExercises : [];
          favoriteWorkoutIds = new Set(Array.isArray(data.favoriteWorkoutIds) ? data.favoriteWorkoutIds : []);
          syncUserCustomData();
          updateResumeChip();
          renderLibrary();
          renderCalendar();
        } else {
          // First time user - initialize with empty data
          history = [];
          activeWorkout = null;
          userCustomWorkouts = [];
          userCustomExercises = [];
          favoriteWorkoutIds = new Set(loadFavoriteWorkoutIds());
          syncUserCustomData();
          updateResumeChip();
          renderLibrary();
          renderCalendar();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to localStorage data
        history = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
        activeWorkout = JSON.parse(localStorage.getItem(LS_ACTIVE) || "null");
        userCustomWorkouts = loadCustomWorkouts();
        userCustomExercises = loadCustomExercises();
        favoriteWorkoutIds = new Set(loadFavoriteWorkoutIds());
        syncUserCustomData();
        updateResumeChip();
        renderLibrary();
        renderCalendar();
      }
    }
    
    // Save user data to Firestore
    function saveUserData() {
      if (!currentUser) return;
      const data = cleanObject({
        history: history || [],
        activeWorkout: activeWorkout || null,
        customWorkouts: userCustomWorkouts || [],
        customExercises: userCustomExercises || [],
        favoriteWorkoutIds: Array.from(favoriteWorkoutIds || [])
      });
      db.collection('users').doc(currentUser.uid).set(data, { merge: true })
        .catch((error) => {
          console.error('Error saving user data to Firestore:', error);
          // Fallback to localStorage
          if (activeWorkout) {
            localStorage.setItem(LS_ACTIVE, JSON.stringify(activeWorkout));
          } else {
            localStorage.removeItem(LS_ACTIVE);
          }
          localStorage.setItem(LS_HISTORY, JSON.stringify(history || []));
          saveCustomWorkoutsLocal();
          saveCustomExercisesLocal();
          saveFavoriteWorkoutIdsLocal();
        });
    }
    
    // ===== Constants and Data =====
    const LS_HISTORY = "GYM_HISTORY_V1";
    const LS_ACTIVE  = "GYM_ACTIVE_WORKOUT_V1";
    const LS_API_KEY = "GYM_GEMINI_API_KEY_V1";
    const LS_BREAK_DURATION = "GYM_BREAK_DURATION_V1";
    const LS_AUTO_REST = "GYM_AUTO_REST_V1";
    const LS_EXERCISE_PREFS = "GYM_EXERCISE_PREFS_V1";
    const LS_USER_WEIGHT = "GYM_USER_WEIGHT_V1";
    const LS_USER_HEIGHT = "GYM_USER_HEIGHT_V1";
    const LS_SOUND_EFFECTS = "GYM_SOUND_EFFECTS_V1";
    const LS_INLINE_CALC = "GYM_INLINE_CALC_V1";
    const LS_CUSTOM_WORKOUTS = "GYM_CUSTOM_WORKOUTS_V1";
    const LS_CUSTOM_EXERCISES = "GYM_CUSTOM_EXERCISES_V1";
    const LS_FAVORITE_WORKOUT_IDS = "GYM_FAVORITE_WORKOUT_IDS_V1";

    // Use comprehensive exercise database
    const ALL_EXERCISES = COMPREHENSIVE_EXERCISES.map(ex => ({
      ...ex,
      muscles: [ex.muscle] // Convert muscle to muscles array for consistency
    })).sort((a, b) => a.name.localeCompare(b.name));
    const BASE_WORKOUT_TEMPLATES = WORKOUT_TEMPLATES.map(w => ({ ...w }));
    const BASE_ALL_EXERCISES = ALL_EXERCISES.map(ex => ({ ...ex }));
    const COMMON_WORKOUT_PRIORITY_IDS = [
      "bodyweight-only",
      "home-workout",
      "strength-endurance",
      "chest-beginner",
      "back-beginner",
      "shoulders-beginner",
      "legs-beginner",
      "push-superset-blast",
      "pull-superset-builder",
      "leg-superset-density"
    ];

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
    let selectedStructuredExerciseRef = null; // { bi, ri, ei }
    let activeDeleteSet = null; // {ei, si} or null
    let breakTimerInterval = null;
    let breakTimeRemaining = 0;
    let breakDuration = 90; // default 90 seconds
    let breakStartTime = null; // for accurate timing when app is backgrounded
    let userCustomWorkouts = [];
    let userCustomExercises = [];
    let favoriteWorkoutIds = new Set();
    let favoritesOnly = false;

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
    function saveCustomProfileData(){
      if(currentUser){
        saveUserData();
      } else {
        saveCustomWorkoutsLocal();
        saveCustomExercisesLocal();
        saveFavoriteWorkoutIdsLocal();
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
    function hasStructuredBlocks(workout){
      return !!(workout && Array.isArray(workout.blocks) && workout.blocks.length);
    }

    function getStructuredBlockExerciseNameSet(workout){
      const names = new Set();
      if(!hasStructuredBlocks(workout)) return names;
      (workout.blocks || []).forEach(block => {
        (block.exercises || []).forEach(ex => {
          if(ex?.name) names.add(String(ex.name).toLowerCase());
        });
      });
      return names;
    }

    function forEachWorkoutSet(workout, cb){
      if(!workout) return;
      if(hasStructuredBlocks(workout)){
        const groupedNames = getStructuredBlockExerciseNameSet(workout);
        workout.blocks.forEach((block, bi) => {
          (block.roundEntries || []).forEach((round, ri) => {
            (round.exercises || []).forEach((ex, ei) => {
              (ex.sets || []).forEach((set, si) => cb(set, ex, { bi, ri, ei, si, block, round }));
            });
          });
        });
        (workout.exercises || []).forEach((ex, ei) => {
          if(groupedNames.has(String(ex?.name || "").toLowerCase())) return;
          (ex.sets || []).forEach((set, si) => cb(set, ex, { ei, si, standalone: true }));
        });
        return;
      }
      (workout.exercises || []).forEach((ex, ei) => {
        (ex.sets || []).forEach((set, si) => cb(set, ex, { ei, si }));
      });
    }

    function countTotalSets(workout){
      let count = 0;
      forEachWorkoutSet(workout, () => { count += 1; });
      return count;
    }

    function countCompletedSets(workout){
      let count = 0;
      forEachWorkoutSet(workout, (set) => { if(set.completed) count += 1; });
      return count;
    }

    function createSetFromExercise(ex, pref = {}, completed = false){
      const isTimeDistance = ex.trackingType === "time_distance";
      if(ex.name === "Plank"){
        return { weight: pref.lastWeight || 0, time: pref.lastTime || 0, completed };
      }
      if(isTimeDistance){
        return { time: pref.lastTime || 0, distance: pref.lastDistance || 0, completed };
      }
      return { weight: pref.lastWeight || 0, reps: pref.lastReps || ex.defaultReps || 0, completed };
    }

    function blockTypeLabel(type){
      switch(type){
        case "superset": return "Superset";
        case "compound_set": return "Compound Set";
        case "tri_set": return "Tri-Set";
        case "drop_set": return "Drop Set";
        default: return "Block";
      }
    }

    function getDropSetWeightPlaceholder(block, ex, si){
      if(block?.type !== "drop_set" || si <= 0) return "Weight (kg)";
      const topWeight = Number(ex?.sets?.[0]?.weight || 0);
      if(!topWeight) return "Weight (kg)";
      const percent = Number(block?.dropConfig?.dropPercent || 20);
      const target = Math.max(0, Math.round((topWeight * (1 - ((percent * si) / 100))) * 10) / 10);
      return `Weight (~${target}kg)`;
    }

    function normalizeTemplateBlocks(template){
      if(!Array.isArray(template?.blocks)) return [];
      return template.blocks
        .map((block, idx) => {
          const exercises = Array.isArray(block?.exercises) ? block.exercises : [];
          if(exercises.length === 0) return null;
          return {
            id: String(block.id || String.fromCharCode(65 + idx)),
            type: block.type || "superset",
            rounds: Math.max(1, Number(block.rounds) || 3),
            restSec: Math.max(0, Number(block.restSec) || 60),
            dropConfig: block.type === "drop_set"
              ? {
                  drops: Math.max(1, Number(block.dropConfig?.drops) || 2),
                  dropPercent: Math.max(5, Number(block.dropConfig?.dropPercent) || 20)
                }
              : null,
            exercises: exercises.map(ex => ({
              name: ex.name,
              muscle: ex.muscle,
              defaultSets: Number(ex.defaultSets) || 1,
              defaultReps: Number(ex.defaultReps) || 10,
              trackingType: ex.trackingType || "weight_reps",
              exercise_link: ex.exercise_link || "",
              met: Number(ex.met) || 5
            }))
          };
        })
        .filter(Boolean);
    }

    function flattenTemplateExercisesFromBlocks(blocks){
      const byName = new Map();
      blocks.forEach(block => {
        block.exercises.forEach(ex => {
          const key = ex.name.toLowerCase();
          const current = byName.get(key);
          if(!current){
            byName.set(key, { ...ex });
            return;
          }
          current.defaultSets = Math.max(Number(current.defaultSets) || 1, Number(ex.defaultSets) || 1);
          current.defaultReps = Math.max(Number(current.defaultReps) || 1, Number(ex.defaultReps) || 1);
        });
      });
      return Array.from(byName.values());
    }

    function buildActiveBlocksFromTemplate(template){
      const blocks = normalizeTemplateBlocks(template);
      return blocks.map(block => ({
        ...block,
        roundEntries: Array.from({ length: block.rounds }, () => ({
          exercises: block.exercises.map(ex => {
            const pref = getExercisePref(ex.name);
            const topSet = createSetFromExercise(ex, pref, false);
            if(block.type !== "drop_set"){
              return { ...ex, sets: [topSet] };
            }
            const drops = [];
            const dropCount = block.dropConfig?.drops || 2;
            const dropPercent = block.dropConfig?.dropPercent || 20;
            for(let di = 1; di <= dropCount; di++){
              const dropSet = createSetFromExercise(ex, pref, false);
              dropSet.dropIndex = di;
              dropSet.dropPercent = dropPercent;
              drops.push(dropSet);
            }
            topSet.dropIndex = 0;
            topSet.dropPercent = 0;
            return { ...ex, sets: [topSet, ...drops] };
          })
        }))
      }));
    }

    function nextBlockId(blocks){
      const used = new Set((blocks || []).map(b => String(b.id || "").toUpperCase()));
      for(let i = 0; i < 26; i++){
        const id = String.fromCharCode(65 + i);
        if(!used.has(id)) return id;
      }
      return `B${(blocks || []).length + 1}`;
    }

    function buildRuntimeExerciseForBlock(ex, blockType, dropConfig){
      const pref = getExercisePref(ex.name);
      const topSet = createSetFromExercise(ex, pref, false);
      if(blockType !== "drop_set"){
        return {
          name: ex.name,
          muscle: ex.muscle,
          exercise_link: ex.exercise_link,
          trackingType: ex.trackingType || "weight_reps",
          met: ex.met,
          defaultSets: 1,
          defaultReps: ex.defaultReps || 10,
          sets: [topSet]
        };
      }
      const drops = [];
      const dropCount = dropConfig?.drops || 2;
      const dropPercent = dropConfig?.dropPercent || 20;
      for(let di = 1; di <= dropCount; di++){
        const dropSet = createSetFromExercise(ex, pref, false);
        dropSet.dropIndex = di;
        dropSet.dropPercent = dropPercent;
        drops.push(dropSet);
      }
      topSet.dropIndex = 0;
      topSet.dropPercent = 0;
      return {
        name: ex.name,
        muscle: ex.muscle,
        exercise_link: ex.exercise_link,
        trackingType: ex.trackingType || "weight_reps",
        met: ex.met,
        defaultSets: 1,
        defaultReps: ex.defaultReps || 10,
        sets: [topSet, ...drops]
      };
    }

// Inline calculation evaluator: supports digits, spaces, + - * / . and parentheses.
// Returns a finite number (rounded to 3 decimals) or null if not evaluable/safe.
function evaluateInlineCalc(raw){
  if (raw == null) return null;
  const str = String(raw).trim()
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  // Allow only safe characters
  if (!/^[\d+\-*/().\s]+$/.test(str)) return null;
  // Must contain at least one digit
  if (!/\d/.test(str)) return null;

  try {
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict";return (' + str + ')')();
    if (typeof result === 'number' && isFinite(result)) {
      // Round to 3 decimals to avoid floating point noise
      return Math.round(result * 1000) / 1000;
    }
  } catch (_) {
    // ignore
  }
  return null;
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

    // Auto rest timer utilities
    function loadAutoRest(){
      return localStorage.getItem(LS_AUTO_REST) !== "false"; // default true
    }
    function saveAutoRest(enabled){
      localStorage.setItem(LS_AUTO_REST, enabled.toString());
    }

    // Exercise preferences utilities
    function loadExercisePrefs(){
      try{ return JSON.parse(localStorage.getItem(LS_EXERCISE_PREFS) || "{}"); }catch{ return {} }
    }
    function saveExercisePrefs(prefs){
      localStorage.setItem(LS_EXERCISE_PREFS, JSON.stringify(prefs));
    }

    // User weight utilities
    function loadUserWeight(){
      return parseFloat(localStorage.getItem(LS_USER_WEIGHT) || "70");
    }
    function saveUserWeight(weight){
      localStorage.setItem(LS_USER_WEIGHT, weight.toString());
    }

    // User height utilities
    function loadUserHeight(){
      return parseFloat(localStorage.getItem(LS_USER_HEIGHT) || "5.8");
    }
    function saveUserHeight(height){
      localStorage.setItem(LS_USER_HEIGHT, height.toString());
    }

    // Sound effects utilities
    function loadSoundEffects(){
      return localStorage.getItem(LS_SOUND_EFFECTS) !== "false"; // default true
    }
    function saveSoundEffects(enabled){
      localStorage.setItem(LS_SOUND_EFFECTS, enabled.toString());
    }

    // Inline calculator utilities
    function loadInlineCalc(){
      return localStorage.getItem(LS_INLINE_CALC) === "true"; // default false
    }
    function saveInlineCalc(enabled){
      localStorage.setItem(LS_INLINE_CALC, enabled.toString());
    }
    function loadCustomWorkouts(){
      try{ return JSON.parse(localStorage.getItem(LS_CUSTOM_WORKOUTS) || "[]"); }catch{ return [] }
    }
    function saveCustomWorkoutsLocal(){
      localStorage.setItem(LS_CUSTOM_WORKOUTS, JSON.stringify(userCustomWorkouts || []));
    }
    function loadCustomExercises(){
      try{ return JSON.parse(localStorage.getItem(LS_CUSTOM_EXERCISES) || "[]"); }catch{ return [] }
    }
    function saveCustomExercisesLocal(){
      localStorage.setItem(LS_CUSTOM_EXERCISES, JSON.stringify(userCustomExercises || []));
    }
    function loadFavoriteWorkoutIds(){
      try{
        const ids = JSON.parse(localStorage.getItem(LS_FAVORITE_WORKOUT_IDS) || "[]");
        return Array.isArray(ids) ? ids.filter(id => typeof id === "string" && id.trim()) : [];
      }catch{
        return [];
      }
    }
    function saveFavoriteWorkoutIdsLocal(){
      localStorage.setItem(LS_FAVORITE_WORKOUT_IDS, JSON.stringify(Array.from(favoriteWorkoutIds || [])));
    }
    function saveFavoriteWorkoutIds(){
      if(currentUser){
        saveUserData();
      } else {
        saveFavoriteWorkoutIdsLocal();
      }
    }
    function isWorkoutFavorited(workoutId){
      return !!workoutId && favoriteWorkoutIds.has(workoutId);
    }
    function toggleWorkoutFavorite(workoutId){
      if(!workoutId) return;
      if(favoriteWorkoutIds.has(workoutId)){
        favoriteWorkoutIds.delete(workoutId);
      } else {
        favoriteWorkoutIds.add(workoutId);
      }
      saveFavoriteWorkoutIds();
    }
    function updateFavoritesOnlyButton(){
      const btn = document.getElementById('favoritesOnlyBtn');
      if(!btn) return;
      btn.setAttribute('aria-pressed', String(favoritesOnly));
      if(favoritesOnly){
        btn.style.background = '#fbbf24';
        btn.style.borderColor = '#fbbf24';
        btn.style.color = '#111827';
      } else {
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }
    }
    function removeWorkoutFromFavorites(workoutId){
      if(!workoutId || !favoriteWorkoutIds.has(workoutId)) return;
      favoriteWorkoutIds.delete(workoutId);
      saveFavoriteWorkoutIds();
    }
    function addOrReplaceCustomWorkout(workout){
      if(!workout?.id) return;
      const idx = userCustomWorkouts.findIndex(w => w.id === workout.id);
      if(idx >= 0) userCustomWorkouts[idx] = workout;
      else userCustomWorkouts.push(workout);
    }
    function addOrReplaceCustomExercise(exercise){
      if(!exercise?.name) return;
      const idx = userCustomExercises.findIndex(ex => ex.name.toLowerCase() === exercise.name.toLowerCase());
      if(idx >= 0) userCustomExercises[idx] = exercise;
      else userCustomExercises.push(exercise);
    }
    function normalizeCustomExercise(ex){
      if(!ex || !ex.name || !ex.muscle) return null;
      return {
        ...ex,
        defaultSets: Number(ex.defaultSets) || 3,
        defaultReps: Number(ex.defaultReps) || 10,
        trackingType: ex.trackingType || "weight_reps",
        muscles: [ex.muscle]
      };
    }
    function syncUserCustomData(){
      const byWorkoutId = new Map();
      BASE_WORKOUT_TEMPLATES.forEach(w => byWorkoutId.set(w.id, { ...w }));
      (userCustomWorkouts || []).forEach(w => {
        if(w?.id) byWorkoutId.set(w.id, { ...w, isCustom: true });
      });
      WORKOUT_TEMPLATES.length = 0;
      WORKOUT_TEMPLATES.push(...Array.from(byWorkoutId.values()));

      const byExerciseName = new Map();
      BASE_ALL_EXERCISES.forEach(ex => byExerciseName.set(ex.name.toLowerCase(), { ...ex }));
      (userCustomExercises || []).forEach(ex => {
        const normalized = normalizeCustomExercise(ex);
        if(normalized){
          byExerciseName.set(normalized.name.toLowerCase(), normalized);
        }
      });
      ALL_EXERCISES.length = 0;
      ALL_EXERCISES.push(...Array.from(byExerciseName.values()).sort((a,b)=>a.name.localeCompare(b.name)));
    }
    function deleteCustomWorkoutById(workoutId){
      if(!workoutId) return;
      const target = WORKOUT_TEMPLATES.find(w => w.id === workoutId);
      if(!target || !target.isCustom){
        showToast('Only custom workouts can be deleted', 'warn');
        return;
      }
      const beforeCount = userCustomWorkouts.length;
      userCustomWorkouts = userCustomWorkouts.filter(w => w.id !== workoutId);
      if(userCustomWorkouts.length === beforeCount){
        showToast('Workout not found', 'warn');
        return;
      }
      removeWorkoutFromFavorites(workoutId);
      syncUserCustomData();
      saveCustomProfileData();
      renderLibrary();
      showToast('Custom workout deleted', 'success');
    }
    function deleteCustomExerciseByName(exerciseName){
      if(!exerciseName) return;
      const target = ALL_EXERCISES.find(ex => ex.name === exerciseName);
      if(!target || !target.isCustom){
        showToast('Only custom exercises can be deleted', 'warn');
        return;
      }
      const beforeCount = userCustomExercises.length;
      userCustomExercises = userCustomExercises.filter(ex => ex.name.toLowerCase() !== exerciseName.toLowerCase());
      if(userCustomExercises.length === beforeCount){
        showToast('Exercise not found', 'warn');
        return;
      }
      selectedExercises.delete(exerciseName);
      syncUserCustomData();
      saveCustomProfileData();
      renderExerciseSelector();
      showToast('Custom exercise deleted', 'success');
    }

    // Calorie calculation utilities
    function calculateWorkoutCalories(workout){
      if(!workout) return 0;
      const userWeight = loadUserWeight();
      let totalCalories = 0;

      const counted = new Set();
      forEachWorkoutSet(workout, (set, ex, refs) => {
        // Avoid double counting mirrored sets if a future migration keeps both blocks and exercises in sync.
        const key = refs?.bi != null ? `b-${refs.bi}-${refs.ri}-${refs.ei}-${refs.si}` : `e-${refs.ei}-${refs.si}`;
        if(counted.has(key)) return;
        counted.add(key);
        const met = ex.met || 5; // default MET if not specified
        if(set.completed){
          let timeHours = 0;
          if(ex.name === 'Plank' || ex.trackingType === 'time_distance'){
            // For time-based exercises, use actual time in hours
            timeHours = (set.time || 0) / 60; // convert minutes to hours
          } else {
            // For weight/reps exercises, estimate time per set (1 minute including rest)
            timeHours = 1 / 60;
          }
          totalCalories += met * userWeight * timeHours;
        }
      });

      return Math.round(totalCalories);
    }

    // BMR calculation using Harris-Benedict equation
    function calculateBMR(){
      const weight = loadUserWeight(); // kg
      const height = loadUserHeight() * 30.48; // convert feet to cm
      const age = 30; // default age, could be made configurable later

      // Harris-Benedict equation for men (could add gender selection later)
      // BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
      const bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      return Math.round(bmr);
    }

    // Sound effect utilities
    function playSound(soundFile){
      if(!loadSoundEffects()) return;
      const audio = new Audio(`sfx/${soundFile}`);
      audio.play().catch(e => console.log('Sound play failed:', e));
    }
    function cleanObject(obj) {
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) {
        return obj.map(cleanObject);
      }
      const cleaned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (value === undefined) {
            cleaned[key] = null;
          } else {
            cleaned[key] = cleanObject(value);
          }
        }
      }
      return cleaned;
    }

    function getExercisePref(exerciseName){
      const prefs = loadExercisePrefs();
      return prefs[exerciseName] || {};
    }
    function setExercisePref(exerciseName, pref){
      const prefs = loadExercisePrefs();
      prefs[exerciseName] = pref;
      saveExercisePrefs(prefs);
    }

    function startBreakTimer(){
      if(breakTimerInterval) clearInterval(breakTimerInterval);
      breakStartTime = Date.now();
      breakTimeRemaining = breakDuration;
      updateBreakDisplay();
      document.getElementById('breakModal').style.display = 'flex';

      breakTimerInterval = setInterval(() => {
        // Calculate remaining time based on elapsed time for accuracy when app is backgrounded
        const elapsed = Math.floor((Date.now() - breakStartTime) / 1000);
        breakTimeRemaining = Math.max(0, breakDuration - elapsed);
        updateBreakDisplay();
        if(breakTimeRemaining <= 0){
          endBreakTimer();
        }
      }, 1000);
    }

    function endBreakTimer(){
      if(breakTimerInterval) clearInterval(breakTimerInterval);
      breakTimerInterval = null;
      breakStartTime = null;
      document.getElementById('breakModal').style.display = 'none';
      showToast("Break ended", "success");
      // Play sound effect when timer ends
      playSound('timer_end.mp3');
    }

    function updateBreakDisplay(){
      const minutes = Math.floor(breakTimeRemaining / 60);
      const seconds = breakTimeRemaining % 60;
      const display = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      document.getElementById('breakCountdown').textContent = display;
    }

    function modifyBreakTime(seconds){
      // Adjust the start time to account for manual time changes
      if (breakStartTime) {
        breakStartTime += seconds * 1000; // adjust start time by the seconds added/subtracted
      }
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
    function workoutUsageCount(workoutName){
      return history.filter(h => h.name === workoutName).length;
    }
    function commonWorkoutRank(workout){
      const idx = COMMON_WORKOUT_PRIORITY_IDS.indexOf(workout.id);
      if(idx >= 0) return idx;
      const name = String(workout.name || "").toLowerCase();
      if(name.includes("beginner")) return 100;
      if(name.includes("full body") || name.includes("home workout") || name.includes("bodyweight")) return 110;
      return 999;
    }
    function renderLibrary(){
      const grid = document.getElementById("libraryGrid");
      const activeMuscle = document.querySelector(".chip.active")?.dataset.muscle || "All";
      const q = document.getElementById("searchInput").value.trim().toLowerCase();

      let items = WORKOUT_TEMPLATES
        .filter(w => {
          if(favoritesOnly && !isWorkoutFavorited(w.id)) return false;
          if(favoritesOnly) return true;
          if(activeMuscle === "All") return true;
          if(activeMuscle === "Custom") return w.isCustom;
          if(activeMuscle === "Favorites") return isWorkoutFavorited(w.id);
          return w.muscles.includes(activeMuscle);
        })
        .filter(w => w.name.toLowerCase().includes(q));

      // Sort favorites first, then custom, then common/good workouts, then user-popular, then name.
      items.sort((a,b) => {
        const favA = isWorkoutFavorited(a.id) ? 1 : 0;
        const favB = isWorkoutFavorited(b.id) ? 1 : 0;
        if(favA !== favB) return favB - favA;
        const customA = a.isCustom ? 1 : 0;
        const customB = b.isCustom ? 1 : 0;
        if(customA !== customB) return customB - customA;
        const commonA = commonWorkoutRank(a);
        const commonB = commonWorkoutRank(b);
        if(commonA !== commonB) return commonA - commonB;
        const useA = workoutUsageCount(a.name);
        const useB = workoutUsageCount(b.name);
        if(useA !== useB) return useB - useA;
        const lastA = lastPerformedDate(a.name) || "";
        const lastB = lastPerformedDate(b.name) || "";
        if(lastA !== lastB) return lastB.localeCompare(lastA);
        return a.name.localeCompare(b.name);
      });

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
      const favorited = isWorkoutFavorited(t.id);
      // Remove existing preview if present
      const existing = document.getElementById('templatePreviewModal');
      if(existing) existing.remove();

      const normalizedBlocks = normalizeTemplateBlocks(t);
      const previewExercises = normalizedBlocks.length ? flattenTemplateExercisesFromBlocks(normalizedBlocks) : (t.exercises || []);

      // Calculate estimated calories for preview
      const userWeight = loadUserWeight();
      let estimatedCalories = 0;
      previewExercises.forEach(ex => {
        const met = ex.met || 5;
        const sets = ex.defaultSets || 3;
        // Assume 1 minute per set
        estimatedCalories += met * userWeight * (sets / 60);
      });
      estimatedCalories = Math.round(estimatedCalories);

      const modal = document.createElement('div');
      modal.id = 'templatePreviewModal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-labelledby="templatePreviewTitle" style="max-width:640px">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:12px">
            <h3 id="templatePreviewTitle" style="margin:0">${t.name}</h3>
            <div style="display:flex; align-items:center; gap:8px">
              <button id="togglePreviewFavoriteBtn" class="icon-btn" title="${favorited ? 'Remove from favorites' : 'Add to favorites'}" aria-label="${favorited ? 'Remove from favorites' : 'Add to favorites'}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="${favorited ? '#fbbf24' : '#cbd5e1'}" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </button>
              ${t.isCustom ? `
                <button id="deletePreviewCustomBtn" class="icon-btn" aria-label="Delete custom workout" title="Delete custom workout">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#fca5a5" aria-hidden="true"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              ` : ''}
            </div>
          </div>
          <div style="margin-top:8px; color:var(--muted)">Muscles: ${t.muscles.join(', ')} • Est. ${estimatedCalories} cal</div>
          ${normalizedBlocks.length ? `
            <div class="template-blocks-preview">
              ${normalizedBlocks.map(block => `
                <div class="template-block-item">
                  <div style="font-weight:700">${block.id} ${blockTypeLabel(block.type)} x${block.rounds}</div>
                  <div class="muted" style="font-size:12px; margin-top:3px">${block.exercises.map((ex, i) => `${block.id}${i + 1} ${ex.name}`).join(' • ')}</div>
                </div>
              `).join("")}
            </div>
          ` : ``}
          <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px; max-height:60vh; overflow:auto; padding-right:8px">
            ${previewExercises.map(ex => `
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
          <div class="modal-footer">
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
      const favoriteBtn = modal.querySelector('#togglePreviewFavoriteBtn');
      if(favoriteBtn){
        favoriteBtn.addEventListener('click', () => {
          toggleWorkoutFavorite(t.id);
          renderLibrary();
          modal.remove();
          showTemplatePreview(t.id);
        });
      }
      const deleteBtn = modal.querySelector('#deletePreviewCustomBtn');
      if(deleteBtn){
        deleteBtn.addEventListener('click', () => {
          const ok = confirm(`Delete custom workout "${t.name}"?`);
          if(!ok) return;
          deleteCustomWorkoutById(t.id);
          modal.remove();
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

      const normalizedBlocks = normalizeTemplateBlocks(t);
      const sourceExercises = normalizedBlocks.length ? flattenTemplateExercisesFromBlocks(normalizedBlocks) : (t.exercises || []);
      const exercises = sourceExercises.map(ex => {
        const pref = getExercisePref(ex.name);
        return {
          name: ex.name,
          muscle: ex.muscle,
          exercise_link: ex.exercise_link,
          trackingType: ex.trackingType || "weight_reps",
          met: ex.met,
          sets: Array.from({ length: pref.lastSets || ex.defaultSets }, () => createSetFromExercise(ex, pref, false))
        };
      });

      activeWorkout = {
        id: id(),
        templateId: t.id,
        name: t.name,
        muscles: [...t.muscles],
        workoutType: t.workoutType || "standard",
        startTime: new Date().toISOString(),
        exercises,
        blocks: normalizedBlocks.length ? buildActiveBlocksFromTemplate(t) : null
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
      const totalSets = countTotalSets(activeWorkout);
      const doneSets = countCompletedSets(activeWorkout);
      const estimatedCalories = calculateWorkoutCalories(activeWorkout);

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
           <div class="muted">Est. ${estimatedCalories} cal</div>
            <button class="btn secondary" id="editWorkoutBtn" title="Add exercises to workout">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
          </div>
        </div>
         <div class="exercise-list">
       `;

      const appendStandardExerciseCard = (ex, ei) => {
        const isTimeDistance = ex.trackingType === "time_distance";
        html += `
          <div class="exercise" data-ex="${ei}">
            <div class="row">
              <div>
                <div style="display:flex; align-items:center; gap:8px">
                  <button class="exercise-link-btn" data-link="${ex.exercise_link || '#'}" title="View Exercise Demo">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
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
                  ${ex.name === 'Plank' ? `
                    <input type="${loadInlineCalc() ? 'text' : 'text'}" inputmode="${loadInlineCalc() ? 'text' : 'decimal'}" step="0.5" placeholder="Weight (kg)" value="${s.weight ?? ''}" data-weight />
                    <input type="text" inputmode="numeric" step="1" placeholder="Time (sec)" value="${s.time ?? ''}" data-time />
                  ` : isTimeDistance ? `
                    <input type="text" inputmode="decimal" step="0.1" placeholder="Time (min)" value="${s.time ?? ''}" data-time />
                    <input type="text" inputmode="decimal" step="0.1" placeholder="Distance (km)" value="${s.distance ?? ''}" data-distance />
                  ` : `
                    <input type="${loadInlineCalc() ? 'text' : 'text'}" inputmode="${loadInlineCalc() ? 'text' : 'decimal'}" step="0.5" placeholder="Weight (kg)" value="${s.weight ?? ''}" data-weight />
                    <input type="text" inputmode="numeric" step="1" placeholder="Reps" value="${s.reps ?? ''}" data-reps />
                  `}
                  <div class="complete ${s.completed?'checked':''}" data-complete title="Mark set complete">
                    ${s.completed ? '&#10003;' : ''}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      };

      if(hasStructuredBlocks(activeWorkout)){
        const groupedNames = getStructuredBlockExerciseNameSet(activeWorkout);
        activeWorkout.blocks.forEach((block, bi) => {
          html += `
            <div class="exercise block-container" data-block="${bi}">
              <div class="row">
                <div>
                  <div class="name">${block.id} ${blockTypeLabel(block.type)}</div>
                  <div class="muscle">${block.roundEntries.length} rounds • Rest ${block.restSec}s</div>
                </div>
                <div class="block-actions">
                  <button class="btn secondary round-action-btn" data-add-round="${bi}" aria-label="Add round">
                    <span class="round-mobile-icon" aria-hidden="true">+</span>
                    <span class="round-mobile-label" aria-hidden="true">Round</span>
                    <span class="btn-text">Add Round</span>
                  </button>
                  <button class="btn secondary round-action-btn" data-remove-round="${bi}" aria-label="Remove round">
                    <span class="round-mobile-icon" aria-hidden="true">−</span>
                    <span class="round-mobile-label" aria-hidden="true">Round</span>
                    <span class="btn-text">Remove Round</span>
                  </button>
                </div>
              </div>
              <div class="block-rounds">
                ${(block.roundEntries || []).map((round, ri) => `
                  <div class="block-round" data-block="${bi}" data-round="${ri}">
                    <div class="block-round-head">
                      <div class="block-round-title">${block.id}${ri + 1}</div>
                      <div class="block-round-subtitle">${(round.exercises || []).length} exercises</div>
                    </div>
                    <div class="block-round-grid">
                      ${(round.exercises || []).map((ex, ei) => `
                        <div class="block-exercise exercise-like">
                          <div class="row">
                            <div>
                              <div style="display:flex; align-items:center; gap:8px">
                                <button class="exercise-link-btn" data-block="${bi}" data-round="${ri}" data-bex="${ei}" data-link="${ex.exercise_link || '#'}" title="View Exercise Demo">
                                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </button>
                                <div>
                                  <div class="name exercise-name-btn" data-block="${bi}" data-round="${ri}" data-bex="${ei}">${ex.name}</div>
                                  <div class="muscle">${ex.muscle}</div>
                                </div>
                              </div>
                            </div>
                            <div class="block-link-chip">E${ei + 1}</div>
                          </div>
                          <div class="set-list">
                            ${(ex.sets || []).map((s, si) => `
                              <div class="set" data-block="${bi}" data-round="${ri}" data-bex="${ei}" data-set="${si}">
                                <div class="index set-index-btn">${block.type === "drop_set" ? (si === 0 ? "T" : `D${si}`) : "1"}</div>
                                ${ex.name === 'Plank' ? `
                                  <input type="text" inputmode="decimal" placeholder="Weight (kg)" value="${s.weight ?? ''}" data-weight />
                                  <input type="text" inputmode="numeric" placeholder="Time (sec)" value="${s.time ?? ''}" data-time />
                                ` : ex.trackingType === "time_distance" ? `
                                  <input type="text" inputmode="decimal" placeholder="Time (min)" value="${s.time ?? ''}" data-time />
                                  <input type="text" inputmode="decimal" placeholder="Distance (km)" value="${s.distance ?? ''}" data-distance />
                                ` : `
                                  <input type="text" inputmode="decimal" placeholder="${getDropSetWeightPlaceholder(block, ex, si)}" value="${s.weight ?? ''}" data-weight />
                                  <input type="text" inputmode="numeric" placeholder="Reps" value="${s.reps ?? ''}" data-reps />
                                `}
                                <div class="complete ${s.completed?'checked':''}" data-complete title="Mark set complete">${s.completed ? '&#10003;' : ''}</div>
                              </div>
                            `).join("")}
                          </div>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `;
        });
        activeWorkout.exercises.forEach((ex, ei) => {
          if(groupedNames.has(String(ex?.name || "").toLowerCase())) return;
          appendStandardExerciseCard(ex, ei);
        });
      } else {
        activeWorkout.exercises.forEach((ex, ei)=> appendStandardExerciseCard(ex, ei));
      }

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
            let exName = '';
            if(this.hasAttribute("data-block")){
              const bi = Number(this.getAttribute("data-block"));
              const ri = Number(this.getAttribute("data-round"));
              const bei = Number(this.getAttribute("data-bex"));
              exName = activeWorkout?.blocks?.[bi]?.roundEntries?.[ri]?.exercises?.[bei]?.name || '';
            } else {
              const exerciseEl = this.closest('.exercise');
              const ei = Number(exerciseEl?.getAttribute('data-ex'));
              exName = activeWorkout?.exercises?.[ei]?.name || '';
            }
            const query = encodeURIComponent((exName || 'exercise') + ' exercise');
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
      wrap.querySelectorAll("[data-add-round]").forEach(btn=>{
        btn.addEventListener("click", () => {
          const bi = Number(btn.getAttribute("data-add-round"));
          addBlockRound(bi);
        });
      });
      wrap.querySelectorAll("[data-remove-round]").forEach(btn=>{
        btn.addEventListener("click", () => {
          const bi = Number(btn.getAttribute("data-remove-round"));
          removeBlockRound(bi);
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
          if(this.hasAttribute("data-block")) return;
          const ei = Number(this.getAttribute('data-ei'));
          const si = Number(this.getAttribute('data-si'));
          if(!Number.isFinite(ei) || !Number.isFinite(si)) return;
          handleSetIndexClick(ei, si, this);
        });
      });

      // Exercise name buttons
      wrap.querySelectorAll('.exercise-name-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if(this.hasAttribute("data-block")){
            selectedExerciseIndex = null;
            selectedStructuredExerciseRef = {
              bi: Number(this.getAttribute("data-block")),
              ri: Number(this.getAttribute("data-round")),
              ei: Number(this.getAttribute("data-bex"))
            };
          } else {
            selectedStructuredExerciseRef = null;
            selectedExerciseIndex = Number(this.getAttribute('data-ex'));
          }
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
      if(!activeWorkout) return;
    
      const raw = String(target.value ?? '');
      const trimmed = raw.trim();
    
      // If the input ends with an operator or a trailing decimal point,
      // don't evaluate yet to allow typing decimals like "22.5" or "10+"
      const trailingOperator = /[+\-*/.]$/.test(trimmed);
      const evaluated = loadInlineCalc() && !trailingOperator ? evaluateInlineCalc(raw) : null;
    
      // Decide value to persist
      let val;
      if (evaluated !== null) {
        val = evaluated;
      } else {
        // Try parsing current raw text without forcing UI replacement
        const parsed = parseFloat(raw);
        val = Number.isFinite(parsed) ? parsed : (raw === '' ? 0 : 0);
      }
    
      // Reps should be an integer
      if (target.hasAttribute("data-reps")) {
        val = Math.round(val);
      }
    
      // Only replace the field when we got a clean evaluation and it's not an incomplete expression
      if (loadInlineCalc() && evaluated !== null) {
        target.value = String(val);
      }
    
      let ex;
      let s;
      if(setEl.hasAttribute("data-block")){
        const bi = Number(setEl.getAttribute("data-block"));
        const ri = Number(setEl.getAttribute("data-round"));
        const ei = Number(setEl.getAttribute("data-bex"));
        const si = Number(setEl.getAttribute("data-set"));
        ex = activeWorkout.blocks?.[bi]?.roundEntries?.[ri]?.exercises?.[ei];
        s = ex?.sets?.[si];
      } else {
        const ei = Number(setEl.getAttribute("data-ex"));
        const si = Number(setEl.getAttribute("data-set"));
        ex = activeWorkout.exercises?.[ei];
        s = ex?.sets?.[si];
      }
      if(!s) return;
      if(target.hasAttribute("data-weight"))   s.weight   = val;
      if(target.hasAttribute("data-reps"))     s.reps     = val;
      if(target.hasAttribute("data-time"))     s.time     = val;
      if(target.hasAttribute("data-distance")) s.distance = val;
    
      saveActiveWorkout();
      updateWorkoutProgressBar();
    }
    function onSetClick(e){
      const btn = e.target.closest("[data-remove],[data-complete]");
      if(!btn) return;
      const setEl = e.target.closest(".set");
      if(!setEl) return;

      if(setEl.hasAttribute("data-block")){
        const bi = Number(setEl.getAttribute("data-block"));
        const ri = Number(setEl.getAttribute("data-round"));
        const ei = Number(setEl.getAttribute("data-bex"));
        const si = Number(setEl.getAttribute("data-set"));
        if(btn.hasAttribute("data-complete")) toggleBlockSetComplete(bi, ri, ei, si, btn);
        return;
      }

      const ei = Number(setEl.getAttribute("data-ex"));
      const si = Number(setEl.getAttribute("data-set"));
      if(btn.hasAttribute("data-remove")) removeSet(ei, si);
      if(btn.hasAttribute("data-complete")) toggleSetComplete(ei, si, btn);
    }
    function updateWorkoutProgressBar(){
      const content = document.getElementById("workoutContent");
      if(!activeWorkout || !content) return;
      const total = countTotalSets(activeWorkout);
      const done = countCompletedSets(activeWorkout);
      const head = content.querySelector(".workout-head .muted");
      if(head) head.textContent = `${done}/${total} sets completed`;
      const finishBtn = document.getElementById("finishWorkoutBtn");
      if(finishBtn) finishBtn.disabled = done < total;
      saveActiveWorkout();
    }

    function addBlockRound(bi){
      if(!activeWorkout?.blocks?.[bi]) return;
      const block = activeWorkout.blocks[bi];
      const round = {
        exercises: block.exercises.map(ex => {
          const pref = getExercisePref(ex.name);
          const topSet = createSetFromExercise(ex, pref, false);
          if(block.type !== "drop_set") return { ...ex, sets: [topSet] };
          const drops = [];
          const dropCount = block.dropConfig?.drops || 2;
          const dropPercent = block.dropConfig?.dropPercent || 20;
          for(let di = 1; di <= dropCount; di++){
            const dropSet = createSetFromExercise(ex, pref, false);
            dropSet.dropIndex = di;
            dropSet.dropPercent = dropPercent;
            drops.push(dropSet);
          }
          topSet.dropIndex = 0;
          topSet.dropPercent = 0;
          return { ...ex, sets: [topSet, ...drops] };
        })
      };
      block.roundEntries.push(round);
      block.rounds = block.roundEntries.length;
      saveActiveWorkout();
      renderWorkout();
    }

    function removeBlockRound(bi){
      if(!activeWorkout?.blocks?.[bi]) return;
      const block = activeWorkout.blocks[bi];
      if((block.roundEntries || []).length <= 1) return;
      block.roundEntries.pop();
      block.rounds = block.roundEntries.length;
      saveActiveWorkout();
      renderWorkout();
    }

    function addSet(ei){
      if(!activeWorkout) return;
      const ex = activeWorkout.exercises[ei];
      if(!ex.sets) ex.sets = [];
      const pref = getExercisePref(ex.name);
      ex.sets.push(createSetFromExercise(ex, pref, false));
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
      if(!s) return;
      s.completed = !s.completed;
      saveActiveWorkout();
      btnEl.classList.toggle("checked", s.completed);
      btnEl.innerHTML = s.completed ? "&#10003;" : "";
      updateWorkoutProgressBar();

      // Play sound effect when set is completed
      if(s.completed){
        playSound('set_complete.mp3');
      }

      // Auto-trigger break if set is completed and auto rest is enabled
      if(s.completed && loadAutoRest()){
        startBreakTimer();
      }
    }
    function toggleBlockSetComplete(bi, ri, ei, si, btnEl){
      const s = activeWorkout?.blocks?.[bi]?.roundEntries?.[ri]?.exercises?.[ei]?.sets?.[si];
      if(!s) return;
      s.completed = !s.completed;
      saveActiveWorkout();
      btnEl.classList.toggle("checked", s.completed);
      btnEl.innerHTML = s.completed ? "&#10003;" : "";
      updateWorkoutProgressBar();
      if(s.completed) playSound('set_complete.mp3');
      if(s.completed && loadAutoRest()) startBreakTimer();
    }
    function completeAllSets(ei){
      const ex = activeWorkout.exercises[ei];
      if(!ex?.sets?.length) return;
      ex.sets.forEach(s => s.completed = true);
      saveActiveWorkout();
      renderWorkout();
      // Play sound effect when all sets of exercise are completed
      playSound('all_sets_complete.mp3');
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

    function buildRecordExercisesFromWorkout(workout){
      if(hasStructuredBlocks(workout)){
        const groupedNames = getStructuredBlockExerciseNameSet(workout);
        const byName = new Map();
        workout.blocks.forEach(block => {
          (block.roundEntries || []).forEach(round => {
            (round.exercises || []).forEach(ex => {
              const key = ex.name.toLowerCase();
              if(!byName.has(key)){
                byName.set(key, { name: ex.name, muscle: ex.muscle, met: ex.met, trackingType: ex.trackingType, sets: [] });
              }
              const target = byName.get(key);
              (ex.sets || []).forEach(s => {
                if(s.reps || s.weight || s.time || s.distance || s.completed){
                  const out = { completed: !!s.completed };
                  if("weight" in s) out.weight = Number(s.weight || 0);
                  if("reps" in s) out.reps = Number(s.reps || 0);
                  if("time" in s) out.time = Number(s.time || 0);
                  if("distance" in s) out.distance = Number(s.distance || 0);
                  if("dropIndex" in s) out.dropIndex = Number(s.dropIndex || 0);
                  target.sets.push(out);
                }
              });
            });
          });
        });
        (workout.exercises || []).forEach(ex => {
          if(groupedNames.has(String(ex?.name || "").toLowerCase())) return;
          const key = ex.name.toLowerCase();
          if(!byName.has(key)){
            byName.set(key, { name: ex.name, muscle: ex.muscle, met: ex.met, trackingType: ex.trackingType, sets: [] });
          }
          const target = byName.get(key);
          (ex.sets || []).forEach(s => {
            if(s.reps || s.weight || s.time || s.distance || s.completed){
              const out = { completed: !!s.completed };
              if("weight" in s) out.weight = Number(s.weight || 0);
              if("reps" in s) out.reps = Number(s.reps || 0);
              if("time" in s) out.time = Number(s.time || 0);
              if("distance" in s) out.distance = Number(s.distance || 0);
              target.sets.push(out);
            }
          });
        });
        return Array.from(byName.values());
      }
      return (workout.exercises || []).map(ex => ({
        name: ex.name,
        muscle: ex.muscle,
        met: ex.met,
        trackingType: ex.trackingType,
        sets: (ex.sets || []).filter(s => s.reps || s.weight || s.time || s.distance || s.completed).map(s => {
          if(ex.name === 'Plank'){
            return { weight: Number(s.weight || 0), time: Number(s.time || 0), completed: !!s.completed };
          }
          if(ex.trackingType === "time_distance"){
            return { time: Number(s.time || 0), distance: Number(s.distance || 0), completed: !!s.completed };
          }
          return { weight: Number(s.weight || 0), reps: Number(s.reps || 0), completed: !!s.completed };
        })
      }));
    }

    function buildRecordBlocksFromWorkout(workout){
      if(!hasStructuredBlocks(workout)) return null;
      return workout.blocks.map(block => ({
        id: block.id,
        type: block.type,
        rounds: block.roundEntries?.length || block.rounds || 0,
        restSec: block.restSec,
        dropConfig: block.dropConfig || null,
        roundEntries: (block.roundEntries || []).map(round => ({
          exercises: (round.exercises || []).map(ex => ({
            name: ex.name,
            muscle: ex.muscle,
            met: ex.met,
            trackingType: ex.trackingType,
            sets: (ex.sets || []).map(s => ({
              weight: Number(s.weight || 0),
              reps: Number(s.reps || 0),
              time: Number(s.time || 0),
              distance: Number(s.distance || 0),
              completed: !!s.completed,
              dropIndex: Number(s.dropIndex || 0),
              dropPercent: Number(s.dropPercent || 0)
            }))
          }))
        }))
      }));
    }

    function finishWorkout(){
      if(!activeWorkout) return;
      const totalSets = countTotalSets(activeWorkout);
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
      const calories = calculateWorkoutCalories(activeWorkout);
      const recordExercises = buildRecordExercisesFromWorkout(activeWorkout);
      const recordBlocks = buildRecordBlocksFromWorkout(activeWorkout);
      const record = {
        id: activeWorkout.id,
        templateId: activeWorkout.templateId,
        name: activeWorkout.name,
        workoutType: activeWorkout.workoutType || "standard",
        dateKey: todayKey(),
        startTime: activeWorkout.startTime,
        endTime,
        minutes: minutesBetween(activeWorkout.startTime, endTime),
        calories,
        exercises: recordExercises,
        blocks: recordBlocks
      };
      history.push(record);
      saveHistory();

      // Generate AI summary
      generateWorkoutSummary(record.id);

      // Update exercise preferences
      recordExercises.forEach(ex => {
        const completedSets = ex.sets.filter(s => s.completed);
        if(completedSets.length > 0){
          const lastSet = completedSets[completedSets.length - 1];
          const pref = {
            lastSets: ex.sets.length,
            lastWeight: lastSet.weight || 0,
            lastReps: lastSet.reps || 0,
            lastTime: lastSet.time || 0,
            lastDistance: lastSet.distance || 0
          };
          setExercisePref(ex.name, pref);
        }
      });

      // Clear active
      activeWorkout = null;
      saveActiveWorkout();
      updateResumeChip();
      clearInterval(workoutTimerInterval);

      // Play sound effect when workout is completed
      playSound('workout_complete.mp3');

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

      if(replaceMode.active){
        renderReplaceExerciseSelector(activeWorkout.exercises[replaceMode.ei].muscle, activeWorkout.exercises[replaceMode.ei].name);
        return;
      }

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
            ${ex.isCustom ? `
              <button class="icon-btn" data-delete-custom-exercise="${ex.name}" title="Delete custom exercise" aria-label="Delete custom exercise">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#fca5a5" aria-hidden="true"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            ` : ''}
          </div>
          <div class="badges">
            ${ex.muscles.map(m => `<span class="badge">${m}</span>`).join("")}
          </div>
        `;
        grid.appendChild(el);
      }

      // Reset modal title for add mode
      document.querySelector('#exerciseSelectorModal h3').textContent = 'Add Exercises to Workout';
      document.getElementById('addSelectedExercisesBtn').textContent = 'Add Selected';
      document.querySelector('#exerciseSelectorModal .filters').style.display = 'block';
    }

    let replaceMode = { ei: null, active: false };

    function openReplaceExerciseSelector(ei){
      if(!activeWorkout) return;
      const currentEx = activeWorkout.exercises[ei];
      replaceMode = { ei, active: true };
      selectedExercises.clear();
      // Hide filters for replace mode
      document.querySelector('#exerciseSelectorModal .filters').style.display = 'none';
      renderReplaceExerciseSelector(currentEx.muscle, currentEx.name);
      document.getElementById('exerciseSelectorModal').style.display = 'flex';
    }

    function renderReplaceExerciseSelector(muscle, excludeName){
      const grid = document.getElementById("exerciseSelectorGrid");
      const activeMuscle = muscle; // Fixed to current muscle
      const q = document.getElementById("exerciseSearchInput").value.trim().toLowerCase();

      let items = ALL_EXERCISES
        .filter(ex => ex.muscle === activeMuscle && ex.name !== excludeName)
        .filter(ex => ex.name.toLowerCase().includes(q));

      grid.innerHTML = "";
      if(items.length === 0){
        grid.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; text-align:center">
            <div class="muted">No similar exercises found.</div>
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
            ${ex.isCustom ? `
              <button class="icon-btn" data-delete-custom-exercise="${ex.name}" title="Delete custom exercise" aria-label="Delete custom exercise">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#fca5a5" aria-hidden="true"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            ` : ''}
          </div>
          <div class="badges">
            ${ex.muscles.map(m => `<span class="badge">${m}</span>`).join("")}
          </div>
        `;
        grid.appendChild(el);
      }

      // Update modal title
      document.querySelector('#exerciseSelectorModal h3').textContent = 'Replace with Similar Exercise';
      document.getElementById('addSelectedExercisesBtn').textContent = 'Replace Exercise';
    }

    function addSelectedExercises(){
      if(!activeWorkout || selectedExercises.size === 0) return;

      if(replaceMode.active){
        // Replace mode
        const ei = replaceMode.ei;
        const selectedName = Array.from(selectedExercises)[0]; // Only one for replacement
        const newEx = ALL_EXERCISES.find(e => e.name === selectedName);
        const pref = getExercisePref(newEx.name);
        const isTimeDistance = newEx.trackingType === "time_distance";
        const currentSets = activeWorkout.exercises[ei].sets.length;

        const replacedExercise = {
          name: newEx.name,
          muscle: newEx.muscle,
          exercise_link: newEx.exercise_link,
          trackingType: newEx.trackingType || "weight_reps",
          met: newEx.met,
          sets: Array.from({ length: currentSets }, (_, i) => {
            const existingSet = activeWorkout.exercises[ei].sets[i];
            if(newEx.name === 'Plank'){
              return { weight: existingSet?.weight || pref.lastWeight || 0, time: existingSet?.time || pref.lastTime || 0, completed: existingSet?.completed || false };
            } else if(isTimeDistance){
              return { time: existingSet?.time || pref.lastTime || 0, distance: existingSet?.distance || pref.lastDistance || 0, completed: existingSet?.completed || false };
            } else {
              return { weight: existingSet?.weight || pref.lastWeight || 0, reps: existingSet?.reps || pref.lastReps || newEx.defaultReps, completed: existingSet?.completed || false };
            }
          })
        };

        activeWorkout.exercises[ei] = replacedExercise;
        saveActiveWorkout();
        renderWorkout();
        document.getElementById('exerciseSelectorModal').style.display = 'none';
        selectedExercises.clear();
        replaceMode = { ei: null, active: false };
        showToast('Exercise replaced');
      } else {
        // Add mode
        const exercisesToAdd = Array.from(selectedExercises).map(name => {
          const ex = ALL_EXERCISES.find(e => e.name === name);
          const pref = getExercisePref(ex.name);
          const isTimeDistance = ex.trackingType === "time_distance";
          return {
            name: ex.name,
            muscle: ex.muscle,
            exercise_link: ex.exercise_link,
            trackingType: ex.trackingType || "weight_reps",
            met: ex.met,
            sets: Array.from({ length: pref.lastSets || ex.defaultSets }, () => {
              if(ex.name === 'Plank'){
                return { weight: pref.lastWeight || 0, time: pref.lastTime || 0, completed: false };
              } else if(isTimeDistance){
                return { time: pref.lastTime || 0, distance: pref.lastDistance || 0, completed: false };
              } else {
                return { weight: pref.lastWeight || 0, reps: pref.lastReps || ex.defaultReps, completed: false };
              }
            })
          };
        });

        activeWorkout.exercises.push(...exercisesToAdd);
        saveActiveWorkout();
        renderWorkout();
        document.getElementById('exerciseSelectorModal').style.display = 'none';
        selectedExercises.clear();
        showToast(`Added ${exercisesToAdd.length} exercise${exercisesToAdd.length > 1 ? 's' : ''} to workout`);
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

    // Populate comprehensive workout detail modal
    function populateWorkoutDetailModal(record) {
      const modal = document.getElementById('workoutDetailModal');
      const titleEl = document.getElementById('workoutDetailTitle');

      // Set workout title in summary section
      titleEl.textContent = `${record.name} — ${fmtDate(record.dateKey)}`;

      // Populate workout summary section
      populateWorkoutSummary(record);

      // Populate AI summary section if available
      populateAISummary(record);

      // Populate exercise breakdown
      populateExerciseBreakdown(record);

      // Set up modal buttons
      setupModalButtons(record);

      // Show modal
      modal.style.display = 'flex';
    }

    function populateWorkoutSummary(record) {
      // Calculate workout statistics
      const totalSets = record.exercises.reduce((a, ex) => a + (ex.sets?.length || 0), 0);
      const completedSets = record.exercises.reduce((a, ex) => a + (ex.sets?.filter(s => s.completed).length || 0), 0);
      const startTime = new Date(record.startTime);
      const endTime = new Date(record.endTime);
      const durationMinutes = record.minutes || minutesBetween(record.startTime, record.endTime);

      // Format date and time
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      const formattedDate = startTime.toLocaleDateString(undefined, dateOptions);
      const startTimeStr = startTime.toLocaleTimeString(undefined, timeOptions);
      const endTimeStr = endTime.toLocaleTimeString(undefined, timeOptions);

      // Helper function to safely update DOM elements
      function safeUpdateElement(id, content, fallbackContent = '-') {
        const element = document.getElementById(id);
        if (element) {
          if (typeof content === 'string' && content.includes('<div')) {
            element.innerHTML = content;
          } else {
            element.textContent = content;
          }
        } else {
          console.warn(`Element with ID '${id}' not found. Available to populate workout summary.`);
        }
      }

      // Update summary fields with null checks
      try {
        safeUpdateElement('workoutDateTime',
          `<div style="font-size: 14px; margin-bottom: 4px;">${formattedDate}</div><div style="font-size: 12px; color: var(--muted);">${startTimeStr} - ${endTimeStr}</div>`
        );
        safeUpdateElement('workoutDuration', `${durationMinutes} min`);
        safeUpdateElement('workoutExerciseCount', record.exercises.length);
        safeUpdateElement('workoutCalories', `${record.calories || 0} cal`);
        safeUpdateElement('workoutTotalSets', totalSets);
        safeUpdateElement('workoutCompletedSets', `${completedSets}/${totalSets}`);
      } catch (error) {
        console.error('Error populating workout summary:', error);
        // Fallback: try to populate with basic content
        safeUpdateElement('workoutDateTime', 'Date & Time not available');
        safeUpdateElement('workoutDuration', 'Duration not available');
        safeUpdateElement('workoutExerciseCount', record.exercises?.length || 0);
        safeUpdateElement('workoutCalories', `${record.calories || 0} cal`);
        safeUpdateElement('workoutTotalSets', totalSets || 0);
        safeUpdateElement('workoutCompletedSets', `${completedSets}/${totalSets}`);
      }
    }

    function populateAISummary(record) {
      // Helper function to safely update DOM elements
      function safeUpdateElement(id, property, value) {
        const element = document.getElementById(id);
        if (element && element[property] !== undefined) {
          element[property] = value;
        } else {
          console.warn(`Element with ID '${id}' not found or property '${property}' not available for AI summary.`);
        }
      }

      function safeSetInnerHTML(id, content) {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = content;
        } else {
          console.warn(`Element with ID '${id}' not found for AI summary content.`);
        }
      }

      try {
        const aiSection = document.getElementById('aiSummarySection');
        const aiContent = document.getElementById('aiSummaryContent');

        if (hasUsableSummary(record)) {
          // Show AI section if elements exist
          if (aiSection) {
            aiSection.style.display = 'block';
          }

          let content = '';

          if (record.summary.rating) {
            content += `<div style="margin-bottom: 8px;"><strong>Rating:</strong> ${record.summary.rating}</div>`;
          }

          if (record.summary.keyMetrics) {
            content += `<div style="margin-bottom: 8px;"><strong>Key Metrics:</strong> ${record.summary.keyMetrics}</div>`;
          }

          if (record.summary.comparison) {
            content += `<div style="margin-bottom: 8px;"><strong>Comparison:</strong> ${record.summary.comparison}</div>`;
          }

          if (record.summary.tips) {
            const tips = splitSummaryTextToItems(record.summary.tips);
            if (tips.length > 0) {
              content += `<div style="margin-bottom: 8px;"><strong>Tips:</strong></div><ul>`;
              tips.forEach(tip => {
                content += `<li>${tip}</li>`;
              });
              content += `</ul>`;
            }
          }

          // Safely set content
          if (aiContent) {
            aiContent.innerHTML = content;
          }
        } else {
          // Hide AI section if elements exist
          if (aiSection) {
            aiSection.style.display = 'none';
          }
        }
      } catch (error) {
        console.error('Error populating AI summary:', error);
        // Fallback: try to hide the section if it exists
        try {
          const aiSection = document.getElementById('aiSummarySection');
          if (aiSection) {
            aiSection.style.display = 'none';
          }
        } catch (fallbackError) {
          console.error('Error in AI summary fallback:', fallbackError);
        }
      }
    }

    function populateExerciseBreakdown(record) {
      const exerciseList = document.getElementById('workoutExerciseList');
      exerciseList.innerHTML = '';

      record.exercises.forEach(ex => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';

        const exerciseHeader = document.createElement('div');
        exerciseHeader.className = 'exercise-header';

        const exerciseName = document.createElement('div');
        exerciseName.className = 'exercise-name';
        exerciseName.textContent = ex.name;

        const exerciseMuscle = document.createElement('div');
        exerciseMuscle.className = 'exercise-muscle';
        exerciseMuscle.textContent = ex.muscle;

        exerciseHeader.appendChild(exerciseName);
        exerciseHeader.appendChild(exerciseMuscle);

        const setsGrid = document.createElement('div');
        setsGrid.className = 'sets-grid';

        (ex.sets || []).forEach((set, index) => {
          const setItem = document.createElement('div');
          setItem.className = 'set-item';

          const setNumber = document.createElement('div');
          setNumber.className = 'set-number';
          setNumber.textContent = `Set ${index + 1}`;

          const setData = document.createElement('div');
          setData.className = 'set-data';

          // Format set data based on exercise type
          if (ex.name === 'Plank') {
            const weightStr = set.weight ? `${set.weight}kg` : '';
            const timeStr = set.time ? `${set.time}s` : '';
            setData.textContent = [weightStr, timeStr].filter(Boolean).join(' / ') || (set.completed ? 'Completed' : '—');
          } else if ('time' in set || 'distance' in set) {
            const timeStr = set.time ? `${set.time}min` : '';
            const distStr = set.distance ? `${set.distance}km` : '';
            setData.textContent = [timeStr, distStr].filter(Boolean).join(' / ') || (set.completed ? 'Completed' : '—');
          } else {
            setData.textContent = `${set.weight || 0}kg × ${set.reps || 0} reps`;
          }

          const setCompleted = document.createElement('div');
          setCompleted.className = 'set-completed';
          if (set.completed) {
            setCompleted.textContent = '✓';
          }

          setItem.appendChild(setNumber);
          setItem.appendChild(setData);
          setItem.appendChild(setCompleted);
          setsGrid.appendChild(setItem);
        });

        exerciseItem.appendChild(exerciseHeader);
        exerciseItem.appendChild(setsGrid);
        exerciseList.appendChild(exerciseItem);
      });
    }

    function setupModalButtons(record) {
      // Remove existing footer buttons
      const existingFooter = document.querySelector('#workoutDetailModal .modal-footer');
      if (existingFooter) {
        existingFooter.remove();
      }

      // Create new footer
      const footer = document.createElement('div');
      footer.className = 'modal-footer';

      // Share button
      const shareBtn = document.createElement('button');
      shareBtn.className = 'btn';
      shareBtn.id = 'shareWorkoutBtn';
      shareBtn.textContent = 'Share';
      shareBtn.addEventListener('click', () => shareWorkout(record));

      if (!hasUsableSummary(record)) {
        const summaryBtn = document.createElement('button');
        summaryBtn.className = 'btn';
        summaryBtn.id = 'generateSummaryBtn';
        summaryBtn.textContent = 'Generate AI Summary';
        summaryBtn.addEventListener('click', async () => {
          summaryBtn.disabled = true;
          summaryBtn.textContent = 'Generating...';
          await generateWorkoutSummary(record.id);
          const latestRecord = history.find(h => h.id === record.id) || record;
          populateWorkoutDetailModal(latestRecord);
        });
        footer.appendChild(summaryBtn);
      }

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'btn secondary';
      closeBtn.textContent = 'Close';
      closeBtn.addEventListener('click', () => {
        document.getElementById('workoutDetailModal').style.display = 'none';
      });

      // Close button in header
      const closeHeaderBtn = document.getElementById('closeWorkoutDetailBtn');
      if (closeHeaderBtn) {
        closeHeaderBtn.addEventListener('click', () => {
          document.getElementById('workoutDetailModal').style.display = 'none';
        });
      }

      footer.appendChild(shareBtn);
      footer.appendChild(closeBtn);

      // Add footer to modal
      const modalContent = document.querySelector('#workoutDetailModal .modal-content');
      modalContent.appendChild(footer);
    }
    function hasUsableSummary(record){
      if(!record || !record.summary || typeof record.summary !== 'object') return false;
      return !!(
        (typeof record.summary.rating === 'string' && record.summary.rating.trim()) ||
        (typeof record.summary.keyMetrics === 'string' && record.summary.keyMetrics.trim()) ||
        (typeof record.summary.comparison === 'string' && record.summary.comparison.trim()) ||
        (Array.isArray(record.summary.tips) && record.summary.tips.some(t => typeof t === 'string' && t.trim())) ||
        (typeof record.summary.tips === 'string' && record.summary.tips.trim())
      );
    }
    // Normalize mixed summary text into list items (supports numbered strings like "1. ... 2. ...").
    function splitSummaryTextToItems(val, { bySentences = false } = {}){
      const normalizeItem = (text) => String(text || '')
        .replace(/^\s*(?:[-•]|\d+[\).\:-])\s*/, '')
        .trim();

      if (Array.isArray(val)) {
        return val
          .flatMap(v => splitSummaryTextToItems(v, { bySentences }))
          .filter(Boolean);
      }
      if (typeof val !== 'string') return [];

      const s = val.trim();
      if (!s) return [];

      let items = [];
      if (bySentences) {
        items = s.split(/(?<=[.!?])\s+/g);
      } else if (/\d+[\).\:-]\s+/.test(s)) {
        items = s.split(/\s+(?=\d+[\).\:-]\s+)/g);
      } else if (s.includes('\n')) {
        items = s.split(/\n+/g);
      } else if (s.includes('•') || s.includes('â€¢')) {
        items = s.split(/(?:•|â€¢)/g);
      } else if (s.includes(';')) {
        items = s.split(';');
      } else if (s.includes(',')) {
        items = s.split(',');
      } else {
        items = [s];
      }

      return items.map(normalizeItem).filter(Boolean);
    }

    function shareWorkout(record) {
      // Build a concise share text
      const parts = [];
      parts.push(`${record.name} • ${record.minutes} min • ${record.calories || 0} cal`);

      record.exercises.forEach(ex => {
        const sets = (ex.sets || []).map(s => {
          if (ex.name === 'Plank') {
            return `${s.weight || 0}kg/${s.time || 0}s`;
          } else if ('time' in s || 'distance' in s) {
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
        navigator.clipboard?.writeText(text).then(
          () => showToast('Workout copied to clipboard'),
          () => showToast('Copy failed','error')
        );
      }
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
          if (ex.name === 'Plank') {
            const totalTime = ex.sets?.reduce((sum, s) => sum + (s.time || 0), 0) || 0;
            const totalWeight = ex.sets?.reduce((sum, s) => sum + (s.weight || 0), 0) || 0;
            const timeStr = totalTime > 0 ? `${totalTime}s` : '';
            const weightStr = totalWeight > 0 ? `${totalWeight}kg` : '';
            const metrics = [weightStr, timeStr].filter(Boolean).join('/');
            return `${ex.name} (${dz}/${sz}${metrics ? ` - ${metrics}` : ''})`;
          } else if (hasTimeDistance) {
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
                <div class="muted">${r.minutes} min • ${r.calories || 0} cal</div>
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

          populateWorkoutDetailModal(record);
        });
      });
    }

    function removeIncompleteSets(){
      if(!activeWorkout) return;
      if(hasStructuredBlocks(activeWorkout)){
        const groupedNames = getStructuredBlockExerciseNameSet(activeWorkout);
        activeWorkout.blocks.forEach(block => {
          (block.roundEntries || []).forEach(round => {
            (round.exercises || []).forEach(ex => {
              if(ex.sets) ex.sets = ex.sets.filter(s => s.completed);
            });
          });
        });
        activeWorkout.exercises.forEach(ex => {
          if(groupedNames.has(String(ex?.name || "").toLowerCase())) return;
          if(ex.sets) ex.sets = ex.sets.filter(s => s.completed);
        });
      } else {
        activeWorkout.exercises.forEach(ex => {
          if(ex.sets) ex.sets = ex.sets.filter(s => s.completed);
        });
      }
      saveActiveWorkout();
      renderWorkout();
    }

    function getSelectedExerciseFromOptions(){
      if(!activeWorkout) return null;
      if(selectedStructuredExerciseRef){
        const { bi, ri, ei } = selectedStructuredExerciseRef;
        const ex = activeWorkout?.blocks?.[bi]?.roundEntries?.[ri]?.exercises?.[ei];
        if(!ex) return null;
        return { ex, mode: "block", bi, ri, ei };
      }
      if(selectedExerciseIndex === null) return null;
      const ex = activeWorkout?.exercises?.[selectedExerciseIndex];
      if(!ex) return null;
      return { ex, mode: "standard", exerciseIndex: selectedExerciseIndex };
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
        document.getElementById('generateModal').style.display = 'none';
        document.getElementById('userModal').style.display = 'flex';
        return;
      }
      // Show loading
      document.getElementById('generateBtn').disabled = true;
      document.getElementById('generateBtn').textContent = 'Generating...';

      // Hide input and suggestions, show loading
      document.getElementById('workoutDescription').style.display = 'none';
      document.getElementById('promptSuggestions').style.display = 'none';
      document.getElementById('loadingContainer').style.display = 'block';
      document.getElementById('statusText').textContent = 'Preparing request...';

      try {
        document.getElementById('statusText').textContent = 'Connecting to API...';
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
  "workoutType": "standard",
  "muscles": ["Muscle1", "Muscle2"],
  "exercises": [
    {
      "name": "Exercise Name",
      "muscle": "Muscle",
      "defaultSets": 3,
      "defaultReps": 10,
      "exercise_link": "https://musclewiki.com/exercise/example",
      "met": 6
    }
  ]
}

Make sure the exercises are real and have valid musclewiki links. Include appropriate MET (Metabolic Equivalent of Task) values for calorie estimation. ${countInstruction}`;

        document.getElementById('statusText').textContent = 'Sending request to AI...';

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                workoutType: { type: 'string' },
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
                      exercise_link: { type: 'string' },
                      met: { type: 'number' }
                    },
                    required: ['name', 'muscle', 'defaultSets', 'defaultReps', 'exercise_link', 'met']
                  }
                }
              },
              required: ['id', 'name', 'muscles', 'exercises']
            }
          }
        });

        document.getElementById('statusText').textContent = 'AI is generating workout...';

        const workout = JSON.parse(response.candidates[0].content.parts[0].text);
        const allowedWorkoutTypes = new Set(["standard", "superset", "compound_set", "tri_set", "drop_set"]);
        if(!allowedWorkoutTypes.has(String(workout.workoutType || "").toLowerCase())){
          workout.workoutType = "standard";
        } else {
          workout.workoutType = String(workout.workoutType).toLowerCase();
        }

        document.getElementById('statusText').textContent = 'Parsing workout data...';

        // Fix broken AI-generated exercise links by matching with comprehensive database
        workout.exercises.forEach(ex => {
          const matchingEx = COMPREHENSIVE_EXERCISES.find(ce => ce.name.toLowerCase() === ex.name.toLowerCase());
          if (matchingEx) {
            ex.exercise_link = matchingEx.exercise_link;
          } else {
            ex.exercise_link = '';
          }
        });

        workout.isCustom = true;
        workout.id = `custom-${id()}`;

        document.getElementById('statusText').textContent = 'Saving workout to library...';

        addOrReplaceCustomWorkout(workout);
        syncUserCustomData();
        saveCustomProfileData();

        document.getElementById('statusText').textContent = 'Finalizing...';
        // Close modal
        document.getElementById('generateModal').style.display = 'none';
        document.getElementById('workoutDescription').value = '';
        // Re-render library
        renderLibrary();
        showToast('Custom workout generated!');
      } catch (error) {
        console.error('Error generating workout:', error);
        document.getElementById('statusText').textContent = 'Error: ' + (error.message || 'Unknown error');
        showToast('Failed to generate workout', 'error');
        // Hide loading on error
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('workoutDescription').style.display = 'block';
        document.getElementById('promptSuggestions').style.display = 'flex';
      } finally {
        // Hide loading, show back inputs
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('workoutDescription').style.display = 'block';
        document.getElementById('promptSuggestions').style.display = 'flex';
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('generateBtn').textContent = 'Generate';
      }
    }

    // Generate workout summary and persist it to the corresponding history record
    // New signature: generateWorkoutSummary(recordId?)
    // - recordId optional for backward safety. If an object is passed (legacy), use it; if missing, fallback to last history entry.
    async function generateWorkoutSummary(recordId) {
      const apiKey = loadApiKey();
      if (!apiKey) {
        showToast('Set Gemini API key for workout summaries', 'warn');
        return false;
      }

      // Resolve target record for summary + past workouts
      let rec = null;
      if (typeof recordId === 'string') {
        rec = history.find(r => r.id === recordId) || history[history.length - 1] || null;
      } else if (recordId && typeof recordId === 'object') {
        // Backward compatibility: old callers may pass the full record
        rec = recordId;
        recordId = rec.id;
      } else {
        rec = history[history.length - 1] || null;
      }

      // Build prompt context
      const pastWorkouts = rec
        ? history
            .filter(h => h.name === rec.name && h.dateKey !== rec.dateKey)
            .sort((a,b) => b.dateKey.localeCompare(a.dateKey))
            .slice(0,3)
        : [];

      const prompt = `You are a Gym master who gives valuable feedback and points out critical and important things, Analyze this workout and provide a concise summary with ratings.

Current workout: ${JSON.stringify(rec || {})}

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
          model: 'gemini-2.5-flash-lite',
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

        // Build sanitized summary object (strings/arrays only) + timestamp
        const sanitizedSummary = {};
        if (typeof result.rating === 'string' && result.rating.trim()) {
          sanitizedSummary.rating = result.rating.trim();
        }
        if (typeof result.keyMetrics === 'string' && result.keyMetrics.trim()) {
          sanitizedSummary.keyMetrics = result.keyMetrics.trim();
        }
        if (typeof result.comparison === 'string' && result.comparison.trim()) {
          sanitizedSummary.comparison = result.comparison.trim();
        }
        if (Array.isArray(result.tips)) {
          const tips = result.tips
            .filter(t => typeof t === 'string' && t.trim())
            .map(t => t.trim());
          if (tips.length) sanitizedSummary.tips = tips;
        } else if (typeof result.tips === 'string' && result.tips.trim()) {
          sanitizedSummary.tips = result.tips.trim();
        }
        sanitizedSummary.generatedAt = Date.now();

        // Attach to in-memory record and persist if available
        if (rec) {
          rec.summary = sanitizedSummary;
          saveHistory(); // lets saveHistory handle Firestore vs localStorage
        }

        // Continue existing UX: show summary modal
        const calories = Number.isFinite(rec?.calories) ? rec.calories : (rec ? calculateWorkoutCalories({ exercises: rec.exercises }) : 0);
        showWorkoutSummaryModal(result, calories);
        return true;
      } catch (error) {
        console.error('Error generating summary:', error);
        // Do not block UX; notify and exit
        showToast('Failed to generate workout summary', 'error');
        return false;
      }
    }

    function showWorkoutSummaryModal(result, calories) {
      const container = document.getElementById('summaryContent');
      // Clear any previous content
      container.innerHTML = '';

      // Guard against missing or malformed result
      const isObject = result && typeof result === 'object';
      if (!isObject) {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        li.textContent = 'Summary unavailable.';
        ul.appendChild(li);
        container.appendChild(ul);
        document.getElementById('summaryModal').style.display = 'flex';
        return;
      }

      // Helper to normalize possibly-string fields into string arrays
      const splitToItems = (val, { bySentences = false } = {}) => {
        if (Array.isArray(val)) {
          return val.map(v => String(v).trim()).filter(Boolean);
        }
        if (typeof val === 'string') {
          let items = [];
          const s = val.trim();
          if (!s) return [];
          if (bySentences) {
            items = s.split(/(?<=[.!?])\s+/g);
          } else {
            // Split on newline, bullet, semicolon, or comma if it looks enumerated
            if (s.includes('\n')) items = s.split('\n');
            else if (s.includes('•')) items = s.split('•');
            else if (s.includes(';')) items = s.split(';');
            else if (s.includes(',')) items = s.split(',');
            else items = [s];
          }
          return items.map(t => t.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean);
        }
        return [];
      };

      const root = document.createElement('ul');

      // Rating
      if (typeof result.rating === 'string' && result.rating.trim()) {
        const li = document.createElement('li');
        li.textContent = `Rating: ${result.rating.trim()}`;
        root.appendChild(li);
      }

      // Calories
      if (Number.isFinite(calories)) {
        const li = document.createElement('li');
        li.textContent = `Calories Burned: ${calories} cal`;
        root.appendChild(li);
      }

      // Key Metrics
      const metricsItems = splitSummaryTextToItems(result.keyMetrics);
      if (metricsItems.length > 0) {
        const li = document.createElement('li');
        li.textContent = 'Key Metrics:';
        const ul = document.createElement('ul');
        metricsItems.forEach(m => {
          const mi = document.createElement('li');
          mi.textContent = m;
          ul.appendChild(mi);
        });
        li.appendChild(ul);
        root.appendChild(li);
      }

      // Comparison
      const comparisonItems = splitSummaryTextToItems(result.comparison, { bySentences: true });
      if (comparisonItems.length > 0) {
        const li = document.createElement('li');
        li.textContent = 'Comparison:';
        const ul = document.createElement('ul');
        comparisonItems.forEach(c => {
          const ci = document.createElement('li');
          ci.textContent = c;
          ul.appendChild(ci);
        });
        li.appendChild(ul);
        root.appendChild(li);
      } else if (typeof result.comparison === 'string' && result.comparison.trim()) {
        const li = document.createElement('li');
        li.textContent = `Comparison: ${result.comparison.trim()}`;
        root.appendChild(li);
      }

      // Tips
      const tipsItems = splitSummaryTextToItems(result.tips);
      if (tipsItems.length > 0) {
        const li = document.createElement('li');
        li.textContent = 'Tips:';
        const ul = document.createElement('ul');
        tipsItems.forEach(t => {
          const ti = document.createElement('li');
          ti.textContent = t;
          ul.appendChild(ti);
        });
        li.appendChild(ul);
        root.appendChild(li);
      }

      // If nothing was added, show a generic fallback
      if (!root.children.length) {
        const li = document.createElement('li');
        li.textContent = 'Summary unavailable.';
        root.appendChild(li);
      }

      container.appendChild(root);
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
          clearAuthToken();
          auth.signOut();
          document.getElementById('userModal').style.display = 'none';
        });
        document.getElementById('backBtn').addEventListener('click', () => {
          document.getElementById('userModal').style.display = 'none';
        });
        document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
          const key = document.getElementById('apiKeyInput').value.trim();
          const breakDurationValue = parseInt(document.getElementById('breakDurationSelect').value);
          const autoRestEnabled = document.getElementById('autoRestTimerToggle').checked;
          const soundEffectsEnabled = document.getElementById('soundEffectsToggle').checked;
          const inlineCalcEnabled = document.getElementById('inlineCalcToggle').checked;
          const weightValue = parseFloat(document.getElementById('weightInput').value) || 70;
          const heightValue = parseFloat(document.getElementById('heightInput').value) || 5.8;
          saveApiKey(key);
          saveBreakDuration(breakDurationValue);
          saveAutoRest(autoRestEnabled);
          saveSoundEffects(soundEffectsEnabled);
          saveInlineCalc(inlineCalcEnabled);
          saveUserWeight(weightValue);
          saveUserHeight(heightValue);
          breakDuration = breakDurationValue;
          document.getElementById('apiKeyMessage').style.display = 'none';

          // Update BMR display with new values
          const bmr = calculateBMR();
          document.getElementById('bmrDisplay').textContent = `BMR: ${bmr} cal/day • Weight: ${weightValue}kg • Height: ${heightValue}ft`;

          document.getElementById('userModal').style.display = 'none';
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
      const favoritesOnlyBtn = document.getElementById("favoritesOnlyBtn");
      if(favoritesOnlyBtn){
        favoritesOnlyBtn.addEventListener("click", () => {
          favoritesOnly = !favoritesOnly;
          updateFavoritesOnlyButton();
          renderLibrary();
        });
      }

      // Open custom exercise modal (replaces inline toggle)
      document.getElementById("toggleCustomExerciseFormBtn").addEventListener("click", () => {
        const modal = document.getElementById('customExerciseModal');
        if (modal) {
          // Reset fields to sensible defaults
          const nameEl = document.getElementById('customExerciseNameInput');
          const linkEl = document.getElementById('customLinkSelector');
          const setsEl = document.getElementById('customDefaultSetsSelector');
          const repsEl = document.getElementById('customDefaultRepsSelector');
          if (nameEl) nameEl.value = '';
          if (linkEl) linkEl.value = '';
          if (setsEl) setsEl.value = '3';
          if (repsEl) repsEl.value = '10';
          modal.style.display = 'flex';
        }
      });

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
        const deleteCustomExerciseBtn = e.target.closest("[data-delete-custom-exercise]");
        if(deleteCustomExerciseBtn){
          const exerciseName = deleteCustomExerciseBtn.getAttribute("data-delete-custom-exercise");
          const target = ALL_EXERCISES.find(ex => ex.name === exerciseName);
          if(target && target.isCustom){
            const ok = confirm(`Delete custom exercise "${exerciseName}"?`);
            if(ok) deleteCustomExerciseByName(exerciseName);
          } else {
            showToast('Only custom exercises can be deleted', 'warn');
          }
          return;
        }
        const card = e.target.closest(".card");
        if(!card) return;
        const exerciseName = card.dataset.exercise;
        if(replaceMode.active){
          // Single selection for replace
          selectedExercises.clear();
          document.querySelectorAll('#exerciseSelectorGrid .card').forEach(c => c.classList.remove('selected'));
          selectedExercises.add(exerciseName);
          card.classList.add("selected");
        } else {
          if(selectedExercises.has(exerciseName)){
            selectedExercises.delete(exerciseName);
            card.classList.remove("selected");
          } else {
            selectedExercises.add(exerciseName);
            card.classList.add("selected");
          }
        }
      });
      document.getElementById('addSelectedExercisesBtn').addEventListener('click', addSelectedExercises);
      document.getElementById('cancelExerciseSelectorBtn').addEventListener('click', () => {
        document.getElementById('exerciseSelectorModal').style.display = 'none';
        selectedExercises.clear();
        replaceMode = { ei: null, active: false };
      });

      // Custom exercise modal save
      document.getElementById('customExerciseSaveBtn').addEventListener('click', () => {
        const name = document.getElementById('customExerciseNameInput').value.trim();
        const muscle = document.getElementById('customMuscleSelector').value;
        const trackingType = document.getElementById('customTrackingTypeSelector').value;
        const defaultSets = parseInt(document.getElementById('customDefaultSetsSelector').value) || 3;
        const defaultReps = parseInt(document.getElementById('customDefaultRepsSelector').value) || 10;
        const exercise_link = document.getElementById('customLinkSelector').value.trim() || '';

        if (!name) {
          showToast('Please enter an exercise name', 'warn');
          return;
        }

        // Create the exercise object (same schema as before)
        const newExercise = {
          name,
          muscle,
          defaultSets,
          defaultReps,
          exercise_link,
          trackingType,
          isCustom: true,
          muscles: [muscle] // For consistency
        };

        addOrReplaceCustomExercise(newExercise);
        syncUserCustomData();
        saveCustomProfileData();

        // Mark as selected in current selector context
        selectedExercises.add(name);

        // Close and clear modal
        const modal = document.getElementById('customExerciseModal');
        if (modal) modal.style.display = 'none';
        const nameEl = document.getElementById('customExerciseNameInput');
        const linkEl = document.getElementById('customLinkSelector');
        if (nameEl) nameEl.value = '';
        if (linkEl) linkEl.value = '';

        // Update selector grid
        renderExerciseSelector();

        showToast('Custom exercise created and selected!', 'success');
      });

      // Custom exercise modal cancel
      document.getElementById('customExerciseCancelBtn').addEventListener('click', () => {
        const modal = document.getElementById('customExerciseModal');
        if (modal) modal.style.display = 'none';
        const nameEl = document.getElementById('customExerciseNameInput');
        const linkEl = document.getElementById('customLinkSelector');
        const setsEl = document.getElementById('customDefaultSetsSelector');
        const repsEl = document.getElementById('customDefaultRepsSelector');
        if (nameEl) nameEl.value = '';
        if (linkEl) linkEl.value = '';
        if (setsEl) setsEl.value = '3';
        if (repsEl) repsEl.value = '10';
      });

      // Exercise options modal
      document.getElementById('previewExerciseBtn').addEventListener('click', () => {
        const selected = getSelectedExerciseFromOptions();
        if (selected && activeWorkout) {
          const ex = selected.ex;
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
        const selected = getSelectedExerciseFromOptions();
        if (selected && activeWorkout) {
          if(selected.mode === "block"){
            const nameToRemove = selected.ex.name;
            activeWorkout.blocks.forEach(block => {
              block.exercises = (block.exercises || []).filter(ex => ex.name !== nameToRemove);
              (block.roundEntries || []).forEach(round => {
                round.exercises = (round.exercises || []).filter(ex => ex.name !== nameToRemove);
              });
            });
            activeWorkout.exercises = (activeWorkout.exercises || []).filter(ex => ex.name !== nameToRemove);
            selectedStructuredExerciseRef = null;
            showToast('Exercise removed from block workout');
          } else {
            activeWorkout.exercises.splice(selected.exerciseIndex, 1);
            selectedExerciseIndex = null;
            showToast('Exercise removed from workout');
          }
          saveActiveWorkout();
          renderWorkout();
        }
        document.getElementById('exerciseOptionsModal').style.display = 'none';
      });

      document.getElementById('replaceExerciseBtn').addEventListener('click', () => {
        const selected = getSelectedExerciseFromOptions();
        if (selected && activeWorkout) {
          if(selected.mode === "block"){
            showToast('Use Add Exercises and then remove old one for block workouts', 'warn');
            document.getElementById('exerciseOptionsModal').style.display = 'none';
            return;
          }
          openReplaceExerciseSelector(selected.exerciseIndex);
        }
        document.getElementById('exerciseOptionsModal').style.display = 'none';
      });

      document.getElementById('cancelExerciseOptionsBtn').addEventListener('click', () => {
        selectedExerciseIndex = null;
        selectedStructuredExerciseRef = null;
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
       favoriteWorkoutIds = new Set(loadFavoriteWorkoutIds());
       
       // Initialize auth state from token (no Firebase call needed)
       initializeAuthState();
       
       updateResumeChip();
       renderLibrary();
       renderCalendar();
       const today = todayKey();
       renderDayDetails(today);
       bindEvents();
       updateFavoritesOnlyButton();

       // Register service worker
       if ('serviceWorker' in navigator) {
         navigator.serviceWorker.register('/sw.js')
           .then((registration) => {
             console.log('Service Worker registered with scope:', registration.scope);
           })
           .catch((error) => {
             console.log('Service Worker registration failed:', error.message);
             // Service worker is optional, so we don't show an error to the user
           });
       }
     }

    // Kick off
    init();
