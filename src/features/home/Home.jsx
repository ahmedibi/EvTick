import React from 'react';
import HeroSection from './HeroSection';
import ModernAppSection from './ModernAppSection';
import Navbar from './Navbar';
import EventCategoriesSection from './EventCategoriesSection';
import Footer from './Footer';

export default function Home() {
  return (
    <>

      <div className="snap-y snap-mandatory min-h-screen ">




        <HeroSection />

        <ModernAppSection />



        <EventCategoriesSection />




      </div>


    </>
  );
}
