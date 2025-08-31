# CurlCal - Workout Tracker + Calendar

A modern, progressive web app for tracking workouts, managing exercise routines, and visualizing progress through an integrated calendar view.

## Features

- **Exercise Library**: Browse and filter exercises by muscle groups (Chest, Back, Legs, Shoulders, Arms, Core, Full Body, Custom)
- **Workout Tracking**: Start workouts from templates, track sets, reps, and weights in real-time
- **Calendar Integration**: View workout history and progress over time
- **Custom Workout Generation**: Use AI to generate personalized workout plans based on your description
- **Progress Monitoring**: Track completed sets and workout duration
- **Offline Support**: Works as a PWA with service worker caching
- **Google Authentication**: Secure login with Google accounts
- **Cloud Sync**: Data stored in Firebase Firestore for cross-device access

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore)
- **AI Integration**: Google Generative AI (Gemini) for custom workout generation
- **PWA Features**: Service Worker, Web App Manifest
- **Styling**: Custom CSS with dark theme support

## Installation & Setup

### Prerequisites
- Node.js (for local development server, optional)
- Google account for authentication
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gymday
   ```

2. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google provider
   - Enable Firestore database
   - Copy your Firebase config to `js/config.js`

3. Get Gemini API key:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Generate an API key
   - Enter it in the app when prompted

4. Serve locally:
   ```bash
   # Using Python
   python -m http.server 8000

   # Or using Node.js
   npx serve .
   ```

5. Open `http://localhost:8000` in your browser

### PWA Installation

The app can be installed as a PWA on supported devices:
- Click the install button when prompted by the browser
- Or use the browser's "Add to Home Screen" option

## Usage

### Getting Started
1. **Login**: Click "Login with Google" to authenticate
2. **Set API Key**: Enter your Gemini API key for custom workout generation
3. **Explore Library**: Browse pre-built workout templates
4. **Start Workout**: Select a template and begin tracking

### Key Features

#### Exercise Library
- Filter exercises by muscle group
- Search for specific exercises
- View exercise details and links to tutorials

#### Workout Tracking
- Real-time timer during workouts
- Track weights, reps, and completion status
- Add/remove sets dynamically
- Resume interrupted workouts

#### Calendar View
- Monthly calendar with workout indicators
- Click dates to view workout details
- Track workout frequency and progress

#### Custom Workouts
- Describe your desired workout in natural language
- AI generates personalized exercise plans
- Save and reuse custom templates

## Project Structure

```
CurlCal/
├── index.html          # Main application HTML
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
├── css/
│   └── style.css      # Application styles
├── js/
│   ├── script.js      # Main application logic
│   ├── workoutData.js # Exercise and workout templates
│   └── config.js      # Firebase configuration
└── img/               # App icons and assets
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Privacy & Data

- User data is stored securely in Firebase Firestore
- Authentication handled by Google OAuth
- No personal data is shared with third parties except Firebase and Google services
- Local storage used for API keys and temporary data

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers with PWA support

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions:
- Check the browser console for error messages
- Ensure Firebase configuration is correct
- Verify Gemini API key is valid
- Test in different browsers if issues persist

---

**Built with ❤️ for fitness enthusiasts**