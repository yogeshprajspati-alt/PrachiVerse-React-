import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import LavenderMist from './pages/Diaries/LavenderMist/LavenderMist';
import ChanchalDiary from './pages/Diaries/ChanchalDiary/ChanchalDiary';
import BirthdayMaze from './pages/Games/BirthdayMaze/BirthdayMaze';
import RoseLegacy from './pages/Diaries/RoseLegacy/RoseLegacy';
import GoldenStarlight from './pages/Diaries/GoldenStarlight/GoldenStarlight';
import DiaryViewer from './pages/DiaryViewer/DiaryViewer';
import LegacyViewer from './pages/LegacyViewer/LegacyViewer';
import Jan23Diary from './pages/Diaries/Jan23Diary/Jan23Diary';
import ChristalChronicles from './pages/Diaries/GreenChronicalGame/CrystalChronicles';
import GoldenAnger from './pages/Diaries/GoldenAnger/MagicalDiary';
import WinterEdition from './pages/Diaries/WinterEdition/WinterEdition';
import WinterEdition2 from './pages/Diaries/WinterEdition/WinterEdition2';
import BeforeMarriage from './pages/Diaries/CousinMarrage/BeforeMarriage';
import DuringMarriage from './pages/Diaries/CousinMarrage/DuringMarriage';
import SorryPage from './pages/Diaries/InteractivePages/SorryPage';
import FirstDesign from './pages/Diaries/FirstDayOfDiary/FirstDesign';
import FirstModifiedDairy from './pages/Diaries/FirstDayOfDiary/FirstModifiedDairy';
import BirthdayMain from './pages/BirthdayMain/BirthdayMain';
import BirthdayDairy from './pages/BirthdayMain/BirthdayDairy';
import GameBirthday1 from './pages/BirthdayMain/GameBirthday1';
import GameBirthday2 from './pages/BirthdayMain/GameBirthday2';
import JourneyBreak from './pages/Additional/JourneyBreak';
import NewYear2026 from './pages/Occasions/NewYear2026';
import MockTest1 from './pages/NeetStuff/MockTest1';
import MockTest2 from './pages/NeetStuff/MockTest2';
import NeetBuddy from './pages/Additional/NeetBuddyManual';
import NeetBuddyManual from './pages/Additional/NeetBuddyManual';
import PrachiNeetApp from './pages/Additional/PrachiNeetApp';
import Spiral from './pages/Diaries/SpiralDesign/Spiral';
import ApologyDairy from './pages/Diaries/ApologyDiary/ApologyDairy';
import ExplanationDairy from './pages/Diaries/ExplanationDaies/ExplanationDairy';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              {/* Future routes will be added here */}
              <Route path="/diaries/lavender-mist" element={<LavenderMist />} />
              <Route path="/diaries/chanchal-diary" element={<ChanchalDiary />} />
              <Route path="/games/birthday-maze" element={<BirthdayMaze />} />
              <Route path="/diaries/rose-legacy" element={<RoseLegacy />} />
              <Route path="/diaries/golden-starlight" element={<GoldenStarlight />} />
              <Route path="/diaries/christal-chronicles" element={<ChristalChronicles />} />
              <Route path="/diaries/golden-anger" element={<GoldenAnger />} />
              <Route path="/diaries/winter-edition" element={<WinterEdition />} />
              <Route path="/diaries/winter-edition-2" element={<WinterEdition2 />} />
              <Route path="/diaries/day-before-cousins-marriage" element={<BeforeMarriage />} />
              <Route path="/diaries/during-cousins-marriage" element={<DuringMarriage />} />
              <Route path="/sorry" element={<SorryPage />} />
              <Route path="/diaries/first-design" element={<FirstDesign />} />
              <Route path="/diaries/first-modified" element={<FirstModifiedDairy />} />
              <Route path="/birthday-main" element={<BirthdayMain />} />
              <Route path="/birthday-dairy" element={<BirthdayDairy />} />
              <Route path="/games/birthday-game-1" element={<GameBirthday1 />} />
              <Route path="/games/birthday-game-2" element={<GameBirthday2 />} />
              <Route path="/JourneyBreak" element={<JourneyBreak />} />
              <Route path="/occasions/new-year-2026" element={<NewYear2026 />} />
              <Route path="/neet-stuff/mock-test-1" element={<MockTest1 />} />
              <Route path="/neet-stuff/mock-test-2" element={<MockTest2 />} />
              <Route path="/neet-buddy" element={<NeetBuddyManual />} />
              <Route path="/prachi-neet-app" element={<PrachiNeetApp />} />
              <Route path="/diaries/spiral-design" element={<Spiral />} />
              <Route path="/diaries/apology-diary" element={<ApologyDairy />} />
              <Route path="/diaries/explanation-diary" element={<ExplanationDairy />} />

              <Route path="/view" element={<LegacyViewer />} />
              {/* New Native Diaries */}
              <Route path="/diaries/jan-23-native" element={<Jan23Diary />} />
              {/* Generic Diary Viewer Route */}
              <Route path="/diary/:id" element={<DiaryViewer />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
