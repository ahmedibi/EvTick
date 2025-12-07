import React from 'react';
import HeroSection from './HeroSection';
import ModernAppSection from './ModernAppSection';
import Navbar from './Navbar';
import EventCategoriesSection from './EventCategoriesSection';
import Footer from './Footer';

export default function Home() {
  return (
    <>

      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">

        <Navbar />


        <HeroSection />

        <ModernAppSection />



        <EventCategoriesSection />


        <Footer />

      </div>


    </>
  );
}
