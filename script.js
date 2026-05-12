// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Update ARIA attribute for accessibility
    menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
  });

  // Close menu when clicking a link - moved outside toggle click to prevent duplicate listeners
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Calculate header offset based on actual navbar height
      const navbar = document.querySelector('.navbar');
      const headerOffset = navbar ? navbar.offsetHeight : 70;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset - 20; // Extra 20px padding
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      navLinks.classList.remove('active');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Add scroll effect to navbar with debouncing for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  
  scrollTimeout = window.requestAnimationFrame(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
      navbar.style.background = 'rgba(255,255,255,0.98)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
      navbar.style.background = 'rgba(255,255,255,0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      // Optionally stop observing after animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Animate multiple elements on scroll
document.querySelectorAll('.project-card, .skill-category, .stat-card, .timeline-content').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(element);
});

// Add resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }, 250);
});

// Keyboard accessibility - close menu with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus(); // Return focus to menu button
    }
  }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Dynamic year in footer
  const footerText = document.querySelector('.footer p');
  if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = footerText.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      menuToggle && 
      !menuToggle.contains(e.target) && 
      !navLinks.contains(e.target) && 
      navLinks.classList.contains('active')
    ) {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add ARIA attributes for accessibility
  if (menuToggle) {
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'nav-menu');
    navLinks.setAttribute('id', 'nav-menu');
  }
  
  // Add smooth scroll behavior for older browsers
  document.documentElement.style.scrollBehavior = 'smooth';
  
  console.log('Portfolio loaded successfully!');
});
