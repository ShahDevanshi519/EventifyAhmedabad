// import React, { useState } from 'react';
import { dummyEvents } from '../data/dummyEvents';
import HeroSlider from '../components/hero/HeroSlider';
import MostLovedEvents from '../components/sections/MostLovedEvents';
import PopularEvents from '../components/sections/PopularEvents';
import TrendingEvents from '../components/sections/TrendingEvents';
import LovedByMillions from '../components/sections/LovedByMillions';
import LiveEvents from '../components/sections/LiveEvents';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSlider />

      {/* Sections */}
      <MostLovedEvents events={dummyEvents} />
      <PopularEvents events={dummyEvents} />
      <LovedByMillions />
      <TrendingEvents events={dummyEvents} />
      <LiveEvents events={dummyEvents} />
    </div>
  );
}