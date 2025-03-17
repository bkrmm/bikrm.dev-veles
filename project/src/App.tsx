import React from 'react';
import { CustomCursor } from './components/Cursor';
import { Hero } from './components/Hero';
import { Certifications } from './components/Certifications';
import { Research } from './components/Research';

function App() {
  return (
    <main className="bg-neutral-900">
      <CustomCursor />
      <Hero />
      <Certifications />
      <Research />
    </main>
  );
}

export default App;