'use client';

import { useState } from 'react';
import { Button, Card, Input, BottomNav, Grid } from './components';
import { SmartphoneIcon, LaptopIcon, PaletteIcon, ZapIcon } from './components/Icons';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    { title: 'Mobile First', desc: 'Touch-friendly with 48px targets', icon: <SmartphoneIcon /> },
    { title: 'Responsive', desc: 'Adapts to tablet & desktop', icon: <LaptopIcon /> },
    { title: 'Accessible', desc: 'Screen reader friendly', icon: <ZapIcon /> },
    { title: 'Fast', desc: 'Optimized performance', icon: <PaletteIcon /> },
  ];

  const recentItems = [
    { title: 'Item 1', desc: 'Description for item 1', icon: <SmartphoneIcon /> },
    { title: 'Item 2', desc: 'Description for item 2', icon: <LaptopIcon /> },
    { title: 'Item 3', desc: 'Description for item 3', icon: <PaletteIcon /> },
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <span className="app-logo">AppName</span>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero */}
        <section className="app-section">
          <h1 className="app-title">Welcome to Your App</h1>
          <p className="app-subtitle">
            Built with Next.js and mobile-first best practices.
          </p>
        </section>

        {/* Search */}
        <section className="app-section">
          <Card>
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </Card>
        </section>

        {/* Features */}
        <section className="app-section">
          <h2 className="section-title">Features</h2>
          <Grid columns={2}>
            {features.map((feature, index) => (
              <Card key={index}>
                <div className="card-image" />
                <div className="card-icon" style={{ marginBottom: '8px' }}>
                  {feature.icon}
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-text">{feature.desc}</p>
              </Card>
            ))}
          </Grid>
        </section>

        {/* Buttons */}
        <section className="app-section">
          <Grid columns={2}>
            <Button variant="primary" onClick={() => alert('Get Started!')}>
              Get Started
            </Button>
            <Button variant="secondary" onClick={() => alert('Learn More!')}>
              Learn More
            </Button>
          </Grid>
        </section>

        {/* Recent Items */}
        <section className="app-section">
          <h2 className="section-title">Recent Items</h2>
          {recentItems.map((item, index) => (
            <Card key={index}>
              <div className="list-item">
                <div className="list-icon">{item.icon}</div>
                <div>
                  <div className="card-title">{item.title}</div>
                  <div className="card-text">{item.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
