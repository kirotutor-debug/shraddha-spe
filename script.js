document.addEventListener('DOMContentLoaded', () => {

  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {

    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  const hamburger = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const animatedTitle = document.getElementById('hero-animated-title');

  if (animatedTitle && typeof gsap !== 'undefined') {

    const originalText = animatedTitle.textContent.trim();
    animatedTitle.innerHTML = '';

    const words = originalText.split(/\s+/);
    words.forEach((wordText, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word-wrapper';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      const characters = wordText.split('');
      characters.forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.className = 'split-char';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });

      animatedTitle.appendChild(wordSpan);
      if (wIdx < words.length - 1) {
        animatedTitle.appendChild(document.createTextNode(' '));
      }
    });

    gsap.fromTo('.split-char',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.03,
        delay: 0.2
      }
    );
  }

  const revealElements = document.querySelectorAll('.reveal');

  const animateStatsNumbers = () => {
    const counters = document.querySelectorAll('.stat-count');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const easeProgress = progress * (2 - progress);

        const currentValue = Math.floor(easeProgress * target);
        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          if (entry.target.id === 'stats') {
            animateStatsNumbers();
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
    animateStatsNumbers();
  }

  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(accItem => {
        accItem.classList.remove('active');
        accItem.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  if (accordionHeaders.length > 0) {
    accordionHeaders[0].click();
  }

  const expandingCards = document.querySelectorAll('.expanding-card');

  expandingCards.forEach(card => {
    const triggerCard = () => {
      expandingCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    };

    card.addEventListener('mouseenter', triggerCard);
    card.addEventListener('click', triggerCard);
    card.addEventListener('focus', triggerCard);
  });

  const stepCards = document.querySelectorAll('.path-step-card');
  const prevBtn = document.getElementById('path-prev-btn');
  const nextBtn = document.getElementById('path-next-btn');
  const paginationDots = document.querySelectorAll('.path-dot');

  if (stepCards.length > 0) {
    let currentStep = 0;
    const totalSteps = stepCards.length;

    const updatePath = (stepIndex) => {
      currentStep = stepIndex;

      stepCards.forEach((card, idx) => {
        card.classList.remove('active', 'left', 'right');

        const offset = idx - currentStep;
        let pos = (offset + totalSteps) % totalSteps;
        if (pos > Math.floor(totalSteps / 2)) {
          pos = pos - totalSteps;
        }

        if (pos === 0) {
          card.classList.add('active');
        } else if (pos === -1) {
          card.classList.add('left');
        } else if (pos === 1) {
          card.classList.add('right');
        }
      });

      paginationDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentStep);
      });

      if (prevBtn) prevBtn.disabled = currentStep === 0;
      if (nextBtn) nextBtn.disabled = currentStep === totalSteps - 1;
    };

    paginationDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const step = parseInt(dot.getAttribute('data-step'), 10);
        updatePath(step);
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
          updatePath(currentStep + 1);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          updatePath(currentStep - 1);
        }
      });
    }

    updatePath(0);
  }

  const applyModal = document.getElementById('apply-modal');
  const successModal = document.getElementById('success-modal');
  const openModalBtns = document.querySelectorAll('.open-apply-modal');
  const closeModalBtn = document.getElementById('close-apply-modal');
  const closeSuccessBtn = document.getElementById('close-success-modal');
  const successOkBtn = document.getElementById('btn-success-ok');
  const applyForm = document.getElementById('apply-form');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeApply = () => {
    applyModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeApply);
  }

  window.addEventListener('click', (e) => {
    if (e.target === applyModal) {
      closeApply();
    }
    if (e.target === successModal) {
      successModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('apply-name');
      const phoneInput = document.getElementById('apply-phone');
      const emailInput = document.getElementById('apply-email');
      const occupationSelect = document.getElementById('apply-occupation');
      const courseSelect = document.getElementById('apply-course');

      let isValid = true;
      const inputs = [nameInput, phoneInput, emailInput, occupationSelect, courseSelect];

      inputs.forEach(input => {
        if (!input.value || input.value.trim() === '') {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });

      if (phoneInput.value && !/^\d{10}$/.test(phoneInput.value.replace(/[^0-9]/g, ''))) {
        phoneInput.classList.add('error');
        isValid = false;
      }

      if (isValid) {

        closeApply();

        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        applyForm.reset();
      }
    });

    applyForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
      input.addEventListener('change', () => {
        input.classList.remove('error');
      });
    });
  }

  const closeSuccess = () => {
    successModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeSuccess);
  }

  if (successOkBtn) {
    successOkBtn.addEventListener('click', closeSuccess);
  }

  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  const pointerHighlights = document.querySelectorAll('.pointer-highlight');
  if (pointerHighlights.length > 0 && typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    pointerHighlights.forEach(ph => {
      const rect = ph.querySelector('.pointer-highlight-rect');
      const cursor = ph.querySelector('.pointer-highlight-cursor');

      if (rect && cursor) {
        gsap.timeline({
          scrollTrigger: {
            trigger: ph,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        })
        .to(rect, {
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(cursor, {
          opacity: 1,
          left: '100%',
          top: '100%',
          x: 4,
          y: 4,
          duration: 1,
          ease: 'power2.inOut'
        }, '<');
      }
    });
  }

  const wobbleCards = document.querySelectorAll('.wobble-card');
  wobbleCards.forEach(card => {
    const inner = card.querySelector('.wobble-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / 20;
      const y = (e.clientY - (rect.top + rect.height / 2)) / 20;

      card.style.transform = `translate3d(${x}px, ${y}px, 0) scale3d(1, 1, 1)`;
      inner.style.transform = `translate3d(${-x}px, ${-y}px, 0) scale3d(1.03, 1.03, 1)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `translate3d(0px, 0px, 0) scale3d(1, 1, 1)`;
      inner.style.transform = `translate3d(0px, 0px, 0) scale3d(1, 1, 1)`;
    });
  });
});