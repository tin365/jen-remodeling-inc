

'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample project data - replace with your actual images
  const projects = [
    {
      id: 1,
      category: 'basement',
      title: 'Modern Basement Entertainment Room',
      before: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
      description: 'Transformed an unused basement into a modern entertainment space with custom lighting and built-in shelving.'
    },
    {
      id: 2,
      category: 'kitchen',
      title: 'Contemporary Kitchen Renovation',
      before: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop',
      description: 'Complete kitchen overhaul with new cabinets, quartz countertops, and modern appliances.'
    },
    {
      id: 3,
      category: 'bathroom',
      title: 'Luxury Spa Bathroom',
      before: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
      description: 'Converted outdated bathroom into a luxurious spa retreat with walk-in shower and custom vanity.'
    },
    {
      id: 4,
      category: 'living-room',
      title: 'Open Concept Living Room',
      before: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
      description: 'Opened up the living space by removing walls and adding modern hardwood flooring.'
    },
    {
      id: 5,
      category: 'kitchen',
      title: 'Farmhouse Kitchen Remodel',
      before: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      description: 'Classic farmhouse kitchen with shaker cabinets, butcher block island, and subway tile backsplash.'
    },
    {
      id: 6,
      category: 'basement',
      title: 'Basement Home Office',
      before: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
      description: 'Created a productive home office space with custom built-ins and professional lighting.'
    },
    {
      id: 7,
      category: 'bathroom',
      title: 'Master Bathroom Suite',
      before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop',
      description: 'Luxurious master bathroom with dual vanities, soaking tub, and marble tile.'
    },
    {
      id: 8,
      category: 'living-room',
      title: 'Modern Living Space',
      before: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
      after: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
      description: 'Contemporary living room with statement fireplace and custom entertainment center.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'basement', label: 'Basement' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'living-room', label: 'Living Room' }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);


  return (
    <div className="gallery-page">
      {/* Header */}
      <header className="gallery-header">
        <div className="header-pattern"></div>
        <div className="header-content">
          <h1 className="header-title">Before & After Gallery</h1>
          <p className="header-subtitle">
            Explore our portfolio of stunning home transformations. See how we turn ordinary spaces into extraordinary living environments.
          </p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="category-filter">
        <div className="filter-container">
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-container">
        <div className="gallery-grid">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => {
                setSelectedProject(project);
              }}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-wrapper">
                {/* Thumbnail Preview */}
                <div className="card-image-container">
                  <img
                    src={project.before}
                    alt={`${project.title} - Before`}
                    className="card-image before"
                  />
                  <img
                    src={project.after}
                    alt={`${project.title} - After`}
                    className="card-image after"
                  />
                  
                  {/* Before/After Labels */}
                  <div className="image-label before-label">BEFORE</div>
                  <div className="image-label after-label">AFTER</div>
                  
                  {/* Click to View Overlay */}
                  <div className="card-overlay">
                    <span className="overlay-text">Click to Compare</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="card-content">
                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-description">{project.description}</p>
                  <div className="card-tag">
                    <span className="tag">{project.category.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div className="lightbox-modal">
          <button
            onClick={() => setSelectedProject(null)}
            className="close-button"
          >
            <X size={32} />
          </button>

          <div className="lightbox-content">
            {/* Project Title */}
            <div className="lightbox-header">
              <h2 className="lightbox-title">{selectedProject.title}</h2>
              <p className="lightbox-description">{selectedProject.description}</p>
            </div>

            {/* Before/After Side-by-Side */}
            <div className="slider-container">
              {/* Before Image */}
              <div className="before-image-wrapper">
                <img
                  src={selectedProject.before}
                  alt="Before"
                  className="slider-image before-image"
                  draggable="false"
                />
                <div className="slider-label before-slider-label">BEFORE</div>
              </div>

              {/* After Image */}
              <div className="after-image-wrapper">
                <img
                  src={selectedProject.after}
                  alt="After"
                  className="slider-image after-image"
                  draggable="false"
                />
                <div className="slider-label after-slider-label">AFTER</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Home?</h2>
          <p className="cta-subtitle">
            Let's create your perfect before and after story. Get a free consultation today.
          </p>
          <div className="cta-buttons">
            <a href="#contact" className="cta-btn primary">
              Get Free Estimate
            </a>
            <a href="tel:+1234567890" className="cta-btn secondary">
              Call (123) 456-7890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
