import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  // Home page with all sections
  const HomePage = () => (
    <div className="min-h-screen bg-gray-900">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );

  // About page
  const AboutPage = () => (
    <div className="min-h-screen bg-gray-900">
      <About />
      <Footer />
    </div>
  );

  // Contact page
  const ContactPage = () => (
    <div className="min-h-screen bg-gray-900">
      <Contact />
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  );
}

export default App;