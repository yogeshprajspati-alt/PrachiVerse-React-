import React, { Suspense, lazy, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// New Framer Motion Wrappers
import SplashScreen from './components/SplashScreen/SplashScreen';
import PageWrapper from './components/PageWrapper/PageWrapper';
import MagneticCursor from './components/MagneticCursor/MagneticCursor';

// Lazy load route components
const Login = lazy(() => import('./pages/Login/Login'));
const Home = lazy(() => import('./pages/Home/Home'));
const LavenderMist = lazy(() => import('./pages/Diaries/LavenderMist/LavenderMist'));
const ChanchalDiary = lazy(() => import('./pages/Diaries/ChanchalDiary/ChanchalDiary'));
const VelvetNight = lazy(() => import('./pages/Diaries/VelvetNight/VelvetNight'));
const BlossomReverie = lazy(() => import('./pages/Diaries/BlossomReverie/BlossomReverie'));
const BirthdayMaze = lazy(() => import('./pages/Games/BirthdayMaze/BirthdayMaze'));
const RoseLegacy = lazy(() => import('./pages/Diaries/RoseLegacy/RoseLegacy'));
const GoldenStarlight = lazy(() => import('./pages/Diaries/GoldenStarlight/GoldenStarlight'));
const DiaryViewer = lazy(() => import('./pages/DiaryViewer/DiaryViewer'));
const LegacyViewer = lazy(() => import('./pages/LegacyViewer/LegacyViewer'));
const Jan23Diary = lazy(() => import('./pages/Diaries/Jan23Diary/Jan23Diary'));
const ChristalChronicles = lazy(() => import('./pages/Diaries/GreenChronicalGame/CrystalChronicles'));
const GoldenAnger = lazy(() => import('./pages/Diaries/GoldenAnger/MagicalDiary'));
const WinterEdition = lazy(() => import('./pages/Diaries/WinterEdition/WinterEdition'));
const WinterEdition2 = lazy(() => import('./pages/Diaries/WinterEdition/WinterEdition2'));
const BeforeMarriage = lazy(() => import('./pages/Diaries/CousinMarrage/BeforeMarriage'));
const DuringMarriage = lazy(() => import('./pages/Diaries/CousinMarrage/DuringMarriage'));
const SorryPage = lazy(() => import('./pages/Diaries/InteractivePages/SorryPage'));
const FirstDesign = lazy(() => import('./pages/Diaries/FirstDayOfDiary/FirstDesign'));
const FirstModifiedDairy = lazy(() => import('./pages/Diaries/FirstDayOfDiary/FirstModifiedDairy'));
const BirthdayMain = lazy(() => import('./pages/BirthdayMain/BirthdayMain'));
const BirthdayDairy = lazy(() => import('./pages/BirthdayMain/BirthdayDairy'));
const GameBirthday1 = lazy(() => import('./pages/BirthdayMain/GameBirthday1'));
const GameBirthday2 = lazy(() => import('./pages/BirthdayMain/GameBirthday2'));
const NewYear2026 = lazy(() => import('./pages/Occasions/NewYear2026'));
const MockTest1 = lazy(() => import('./pages/NeetStuff/MockTest1'));
const MockTest2 = lazy(() => import('./pages/NeetStuff/MockTest2'));
const Spiral = lazy(() => import('./pages/Diaries/SpiralDesign/Spiral'));
const ApologyDairy = lazy(() => import('./pages/Diaries/ApologyDiary/ApologyDairy'));
const ExplanationDairy = lazy(() => import('./pages/Diaries/ExplanationDaies/ExplanationDairy'));
const AppreciationGallery = lazy(() => import('./pages/AppreciationGallery/AppreciationGallery'));
const AppreciationViewer = lazy(() => import('./pages/AppreciationViewer/AppreciationViewer'));


const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/diaries/blossom-reverie" element={<PageWrapper><BlossomReverie /></PageWrapper>} />
            <Route path="/diaries/lavender-mist" element={<PageWrapper><LavenderMist /></PageWrapper>} />
            <Route path="/diaries/velvet-night" element={<PageWrapper><VelvetNight /></PageWrapper>} />
            <Route path="/diaries/chanchal-diary" element={<PageWrapper><ChanchalDiary /></PageWrapper>} />
            <Route path="/games/birthday-maze" element={<PageWrapper><BirthdayMaze /></PageWrapper>} />
            <Route path="/diaries/rose-legacy" element={<PageWrapper><RoseLegacy /></PageWrapper>} />
            <Route path="/diaries/golden-starlight" element={<PageWrapper><GoldenStarlight /></PageWrapper>} />
            <Route path="/diaries/christal-chronicles" element={<PageWrapper><ChristalChronicles /></PageWrapper>} />
            <Route path="/diaries/golden-anger" element={<PageWrapper><GoldenAnger /></PageWrapper>} />
            <Route path="/diaries/winter-edition" element={<PageWrapper><WinterEdition /></PageWrapper>} />
            <Route path="/diaries/winter-edition-2" element={<PageWrapper><WinterEdition2 /></PageWrapper>} />
            <Route path="/diaries/day-before-cousins-marriage" element={<PageWrapper><BeforeMarriage /></PageWrapper>} />
            <Route path="/diaries/during-cousins-marriage" element={<PageWrapper><DuringMarriage /></PageWrapper>} />
            <Route path="/sorry" element={<PageWrapper><SorryPage /></PageWrapper>} />
            <Route path="/diaries/first-design" element={<PageWrapper><FirstDesign /></PageWrapper>} />
            <Route path="/diaries/first-modified" element={<PageWrapper><FirstModifiedDairy /></PageWrapper>} />
            <Route path="/birthday-main" element={<PageWrapper><BirthdayMain /></PageWrapper>} />
            <Route path="/birthday-dairy" element={<PageWrapper><BirthdayDairy /></PageWrapper>} />
            <Route path="/games/birthday-game-1" element={<PageWrapper><GameBirthday1 /></PageWrapper>} />
            <Route path="/games/birthday-game-2" element={<PageWrapper><GameBirthday2 /></PageWrapper>} />
            <Route path="/occasions/new-year-2026" element={<PageWrapper><NewYear2026 /></PageWrapper>} />
            <Route path="/neet-stuff/mock-test-1" element={<PageWrapper><MockTest1 /></PageWrapper>} />
            <Route path="/neet-stuff/mock-test-2" element={<PageWrapper><MockTest2 /></PageWrapper>} />
            <Route path="/diaries/spiral-design" element={<PageWrapper><Spiral /></PageWrapper>} />
            <Route path="/diaries/apology-diary" element={<PageWrapper><ApologyDairy /></PageWrapper>} />
            <Route path="/diaries/explanation-diary" element={<PageWrapper><ExplanationDairy /></PageWrapper>} />

            <Route path="/view" element={<PageWrapper><LegacyViewer /></PageWrapper>} />
            <Route path="/diaries/jan-23-native" element={<PageWrapper><Jan23Diary /></PageWrapper>} />
            <Route path="/diary/:id" element={<PageWrapper><DiaryViewer /></PageWrapper>} />
            <Route path="/appreciation" element={<PageWrapper><AppreciationGallery /></PageWrapper>} />
            <Route path="/appreciation/:id" element={<PageWrapper><AppreciationViewer /></PageWrapper>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [appReady, setAppReady] = useState(false);

  return (
    <AuthProvider>
      <HashRouter>
        <MagneticCursor />
        {/* Splash screen component */}
        {!appReady && <SplashScreen onComplete={() => setAppReady(true)} />}

        <Suspense fallback={null}>
          {appReady && <AnimatedRoutes />}
        </Suspense>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
