import React from 'react';
import Navigation from './components/Navigation';
import HeroSectionCentered from './components/HeroSectionCentered';
import HeroSectionLeftRight from './components/HeroSectionLeftRight';
import LayoutGrids from './components/LayoutGrids';
import CardDeck from './components/CardDeck';
import TabsSection from './components/TabsSection';
import CallToAction from './components/CallToAction';
import CredibilitySection from './components/CredibilitySection';
import Testimonials from './components/Testimonials';
import StepwiseWorkflow from './components/StepwiseWorkflow';
import LogoParade from './components/LogoParade';
import Accordions from './components/Accordions';

export default function DesignGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="flex flex-col gap-[60px]">
        <HeroSectionCentered />
        <HeroSectionLeftRight />
        <LayoutGrids />
        <CardDeck />
        <TabsSection />
        <CallToAction />
        <CredibilitySection />
        <Testimonials />
        <StepwiseWorkflow />
        <LogoParade />
        <Accordions />
      </main>
    </div>
  );
}