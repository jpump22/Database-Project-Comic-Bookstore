'use client'

import React, { useEffect, useRef } from 'react'

// =================================================================
// TATES TRADING POST - OPTIMIZED INTERACTIVE FEATURES
// Custom Cursor · 3D Tilt · Scroll Animations · High Performance
// =================================================================

export const TatesInteractive: React.FC = () => {
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // Prevent double initialization
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    // ===== PERFORMANCE DETECTION =====
    function detectPerformance() {
      const cores = navigator.hardwareConcurrency || 4
      const memory = (navigator as any).deviceMemory || 4

      const isLowEnd = cores < 4 || memory < 4

      if (isLowEnd) {
        document.body.classList.add('low-performance')
        document.body.classList.add('manual-perf-mode')
        console.log(
          '%cLOW PERFORMANCE DEVICE - Performance mode auto-enabled',
          'color:#ff9500;font-weight:bold;',
        )
      }

      return !isLowEnd
    }

    const isHighPerformance = detectPerformance()

    initCustomCursor()
    initThemeToggle()
    initPerformanceToggle()
    initFPSMonitor()
    initFPSToggle()
    init3DTilt()
    initScrollAnimations()
    initSmoothScroll()
    initHoverEffects()
    initKonamiCode()
    initLazyLoading()
    printConsoleArt()

    console.log('%cTATES TRADING POST', 'font-size:24px;font-weight:bold;color:#C44536;font-family:Impact;')
    console.log('%c💡 Performance Tips:', 'font-weight:bold;color:#4A7C8C;font-size:12px;')
    console.log('%c  • Disable 3D tilt: localStorage.setItem("disableTilt", "true") then reload', 'color:#888;font-size:11px;')
    console.log('%c  • Re-enable tilt: localStorage.setItem("disableTilt", "false") then reload', 'color:#888;font-size:11px;')

    // ===== OPTIMIZED CUSTOM CURSOR =====
    function initCustomCursor() {
      const cursor = document.querySelector('.custom-cursor')
      const follower = document.querySelector('.cursor-follower')

      if (!cursor || !follower) return

      let mouseX = 0, mouseY = 0
      let followerX = 0, followerY = 0
      let isMoving = false
      let isHovering = false

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
        if (!isMoving) {
          isMoving = true
          requestAnimationFrame(animateCursor)
        }
      }, { passive: true })

      function animateCursor() {
        const dx = mouseX - followerX
        const dy = mouseY - followerY

        followerX += dx * 0.15
        followerY += dy * 0.15

        ;(follower as HTMLElement).style.left = `${followerX}px`
        ;(follower as HTMLElement).style.top = `${followerY}px`

        follower.classList.toggle('hovering', isHovering)

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          requestAnimationFrame(animateCursor)
        } else {
          isMoving = false
        }
      }

      const hoverElements = document.querySelectorAll('a, button, .bento-item, .vintage-card')
      hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          isHovering = true
        }, { passive: true })

        el.addEventListener('mouseleave', () => {
          isHovering = false
        }, { passive: true })
      })
    }

    // ===== CELESTIAL THEME TOGGLE =====
    function initThemeToggle() {
      const toggle = document.getElementById('themeToggle')
      const body = document.body

      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode')
      }

      toggle?.addEventListener('click', () => {
        body.classList.toggle('dark-mode')
        const isDark = body.classList.contains('dark-mode')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
      })

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          body.classList.toggle('dark-mode', e.matches)
        }
      })
    }

    // ===== FPS MONITOR =====
    function initFPSMonitor() {
      const monitor = document.getElementById('fpsMonitor')
      const fpsValue = monitor?.querySelector('.fps-value')

      if (!monitor || !fpsValue) return

      let frames = 0
      let lastTime = performance.now()
      let fps = 60
      let fpsHistory: number[] = []

      function measureFPS() {
        frames++
        const currentTime = performance.now()

        if (currentTime >= lastTime + 1000) {
          fps = Math.round((frames * 1000) / (currentTime - lastTime))
          frames = 0
          lastTime = currentTime

          fpsHistory.push(fps)
          if (fpsHistory.length > 5) fpsHistory.shift()

          fpsValue.textContent = `${fps} FPS`

          monitor.classList.remove('fps-good', 'fps-ok', 'fps-bad')
          if (fps >= 50) {
            monitor.classList.add('fps-good')
          } else if (fps >= 30) {
            monitor.classList.add('fps-ok')
          } else {
            monitor.classList.add('fps-bad')
          }
        }

        requestAnimationFrame(measureFPS)
      }

      requestAnimationFrame(measureFPS)

      // Debug functions
      ;(window as any).disableHeroAnimations = () => {
        document.querySelectorAll('.kinetic-title .word').forEach((el: any) => el.style.animation = 'none')
        console.log('✗ Kinetic typography disabled - Check FPS now')
      }

      ;(window as any).disableParallax = () => {
        const hero = document.querySelector('.hero-main') as HTMLElement
        if (hero) hero.style.transform = 'none'
        console.log('✗ Parallax disabled - Check FPS now')
      }

      ;(window as any).disableFloatingShapes = () => {
        document.querySelectorAll('.float-shape').forEach((el: any) => el.style.display = 'none')
        console.log('✗ Floating shapes disabled - Check FPS now')
      }

      ;(window as any).disableBenday = () => {
        document.querySelectorAll('.benday-overlay').forEach((el: any) => el.style.display = 'none')
        console.log('✗ Ben-Day overlays disabled - Check FPS now')
      }

      ;(window as any).disableAll = () => {
        ;(window as any).disableHeroAnimations()
        ;(window as any).disableParallax()
        ;(window as any).disableFloatingShapes()
        ;(window as any).disableBenday()
        console.log('✗ All hero effects disabled - Check FPS now')
      }

      ;(window as any).enableHeroAnimations = () => {
        document.querySelectorAll('.kinetic-title .word').forEach((el: any) => el.style.animation = '')
        console.log('✓ Kinetic typography enabled - Check FPS now')
      }

      ;(window as any).disableTilt = () => {
        localStorage.setItem('disableTilt', 'true')
        console.log('%c✓ 3D Tilt will be disabled on next page load', 'color:#4CAF50;font-weight:bold;')
        console.log('%c  Reload the page to see the change', 'color:#888;')
      }

      ;(window as any).enableTilt = () => {
        localStorage.setItem('disableTilt', 'false')
        console.log('%c✓ 3D Tilt will be enabled on next page load', 'color:#4CAF50;font-weight:bold;')
        console.log('%c  Reload the page to see the change', 'color:#888;')
      }

      ;(window as any).enableParallax = () => {
        const hero = document.querySelector('.hero-main') as HTMLElement
        if (hero) hero.style.transform = ''
        console.log('✓ Parallax enabled - Check FPS now')
      }

      ;(window as any).enableFloatingShapes = () => {
        document.querySelectorAll('.float-shape').forEach((el: any) => el.style.display = '')
        console.log('✓ Floating shapes enabled - Check FPS now')
      }

      ;(window as any).enableBenday = () => {
        document.querySelectorAll('.benday-overlay').forEach((el: any) => {
          el.style.display = ''
        })
        console.log('✓ Ben-Day overlays enabled (PNG-based, fast in all browsers) - Check FPS now')
      }

      ;(window as any).enableAll = () => {
        ;(window as any).enableHeroAnimations()
        ;(window as any).enableParallax()
        ;(window as any).enableFloatingShapes()
        ;(window as any).enableBenday()
        console.log('✓ All hero effects enabled - Check FPS now')
      }

      // SAFE MODE
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('safemode') === 'true') {
        ;(window as any).disableAll()
        console.log('%c🛡️ SAFE MODE ACTIVATED - All effects disabled', 'font-size:16px;font-weight:bold;color:#4CAF50;background:#f0f0f0;padding:8px;')
        console.log('Type these commands to enable features one by one:')
        console.log('  enableHeroAnimations()')
        console.log('  enableParallax()')
        console.log('  enableFloatingShapes()')
        console.log('  enableBenday()')
      }

      monitor.addEventListener('click', () => {
        const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
        const hasHWAccel = checkHardwareAcceleration()

        console.log('%c=== PERFORMANCE DIAGNOSTICS ===', 'font-size:16px;font-weight:bold;color:#C44536;')
        console.log('Current FPS:', fps)
        console.log('Browser:', isFirefox ? 'Firefox' : 'Chrome/Other')
        console.log('CPU Cores:', navigator.hardwareConcurrency || 'unknown')
        console.log('Device Memory:', (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'unknown')
        console.log('Hardware Acceleration:', hasHWAccel ? 'Likely enabled' : 'May be disabled')
        console.log('Ben-Day overlays:', document.querySelectorAll('.benday-overlay').length)
        console.log('Active animations:', document.getAnimations().length)
        console.log('Glass morph elements:', document.querySelectorAll('.glass-morph').length)

        const bendayEl = document.querySelector('.benday-overlay')
        if (bendayEl) {
          const blendMode = getComputedStyle(bendayEl).mixBlendMode
          const bgImage = getComputedStyle(bendayEl).backgroundImage
          console.log('Ben-Day mix-blend-mode:', blendMode)
          console.log('Ben-Day using PNG:', bgImage.includes('data:image/png') ? 'Yes ✓' : 'No (CSS gradient)')
        }

        if (fps < 30) {
          console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color:#EF5350;')
          console.log('%c   PERFORMANCE ISSUE DETECTED (FPS: ' + fps + ')', 'font-size:14px;font-weight:bold;color:#EF5350;')
          console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color:#EF5350;')
          console.log('\n%c📋 Try these fixes:', 'font-weight:bold;color:#FFA726;')
          console.log('   • Try disabling browser extensions temporarily')
          console.log('   • Click the lightning bolt icon (top-right) for performance mode')
          console.log('   • Update your graphics drivers')
          console.log('   • Use window.disableAll() to test features individually')
          console.log('\n%c🛠 Advanced Debugging:', 'font-weight:bold;color:#4A7C8C;')
          console.log('   Add ?safemode=true to URL to diagnose which feature is slow')
          console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color:#EF5350;')
        }
      })
    }

    // ===== FPS TOGGLE =====
    function initFPSToggle() {
      const fpsToggleBtn = document.getElementById('fpsToggle')
      const body = document.body

      const fpsVisible = localStorage.getItem('fpsVisible') === 'true'
      if (fpsVisible) {
        body.classList.add('fps-visible')
        const span = fpsToggleBtn?.querySelector('span')
        if (span) span.textContent = 'Hide FPS'
      }

      fpsToggleBtn?.addEventListener('click', () => {
        body.classList.toggle('fps-visible')
        const isVisible = body.classList.contains('fps-visible')

        const span = fpsToggleBtn.querySelector('span')
        if (span) span.textContent = isVisible ? 'Hide FPS' : 'Show FPS'

        localStorage.setItem('fpsVisible', String(isVisible))
      })
    }

    function checkHardwareAcceleration() {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (gl) {
          const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info')
          if (debugInfo) {
            const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            return !renderer.toLowerCase().includes('software')
          }
        }
      } catch (e) {
        return false
      }
      return true
    }

    // ===== PERFORMANCE TOGGLE =====
    function initPerformanceToggle() {
      const toggle = document.getElementById('perfToggle')
      const body = document.body

      const savedPerfMode = localStorage.getItem('performanceMode')

      if (savedPerfMode === 'low') {
        body.classList.add('low-performance')
        body.classList.add('manual-perf-mode')
      } else if (savedPerfMode === 'high') {
        body.classList.remove('low-performance')
        body.classList.remove('manual-perf-mode')
      }

      toggle?.addEventListener('click', () => {
        body.classList.toggle('low-performance')
        body.classList.toggle('manual-perf-mode')
        const isLowPerf = body.classList.contains('low-performance')

        localStorage.setItem('performanceMode', isLowPerf ? 'low' : 'high')
        createRipple(toggle)

        if (isLowPerf) {
          console.log('%cPERFORMANCE MODE: ON (all animations disabled)', 'color:#4CAF50;font-weight:bold;')
        } else {
          console.log('%cPERFORMANCE MODE: OFF (all effects enabled)', 'color:#C44536;font-weight:bold;')
        }
      })
    }

    // ===== OPTIMIZED 3D TILT EFFECT =====
    function init3DTilt() {
      const disableTilt = localStorage.getItem('disableTilt') === 'true'
      if (disableTilt) {
        console.log('%c3D Tilt disabled for better performance', 'color:#888;')
        return
      }

      const tiltElements = document.querySelectorAll('[data-tilt]')
      let currentTiltElement: HTMLElement | null = null
      const baseTransforms = new Map<Element, string>()

      function resetAllTilts() {
        tiltElements.forEach((el: any) => {
          el.style.transform = ''
          el.style.zIndex = ''
          el.style.willChange = 'auto'
        })
      }

      tiltElements.forEach((el) => {
        const isBentoItem = el.classList.contains('bento-item')
        const isVintageCard = el.classList.contains('vintage-card')

        let baseTransform = ''
        if (isBentoItem) {
          baseTransform = 'translateY(-8px)'
        } else if (isVintageCard) {
          baseTransform = 'translateY(-12px) rotate(-2deg)'
        }
        baseTransforms.set(el, baseTransform)

        let rafId: number | null = null
        let lastUpdate = 0

        el.addEventListener('mouseenter', function (this: any) {
          resetAllTilts()
          currentTiltElement = this
          this.style.zIndex = '100'
          this.style.willChange = 'transform'
        }, { passive: true })

        el.addEventListener('mousemove', function (this: any, e: MouseEvent) {
          if (currentTiltElement !== this) {
            if (rafId) {
              cancelAnimationFrame(rafId)
              rafId = null
            }
            return
          }

          const now = performance.now()
          if (now - lastUpdate < 33) return
          lastUpdate = now

          if (rafId) return

          rafId = requestAnimationFrame(() => {
            if (currentTiltElement === this) {
              handleTilt.call(this, e)
            }
            rafId = null
          })
        }, { passive: true })

        el.addEventListener('mouseleave', function (this: any) {
          if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = null
          }

          this.style.transform = ''
          this.style.zIndex = ''
          this.style.willChange = 'auto'

          if (currentTiltElement === this) {
            currentTiltElement = null
          }
        }, { passive: true })
      })

      function handleTilt(this: HTMLElement, e: MouseEvent) {
        const rect = this.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = Math.max(-3, Math.min(3, ((y - centerY) / centerY) * 3))
        const rotateY = Math.max(-3, Math.min(3, ((centerX - x) / centerX) * 3))

        const baseTransform = baseTransforms.get(this) || ''

        this.style.transform = `
          ${baseTransform}
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `.replace(/\s+/g, ' ').trim()
      }
    }

    // ===== OPTIMIZED SCROLL ANIMATIONS =====
    function initScrollAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).style.opacity = '1'
            ;(entry.target as HTMLElement).style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      }, observerOptions)

      const bentoItems = document.querySelectorAll('.bento-item')
      bentoItems.forEach((item: any) => {
        item.style.opacity = '0'
        item.style.transform = 'translateY(30px)'
        observer.observe(item)
      })

      const vintageCards = document.querySelectorAll('.vintage-card')
      vintageCards.forEach((card: any) => {
        card.style.opacity = '0'
        card.style.transform = 'translateY(30px)'
        observer.observe(card)
      })

      let parallaxTicking = false
      window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
          requestAnimationFrame(() => {
            const scrolled = window.scrollY
            const hero = document.querySelector('.hero-main') as HTMLElement
            if (hero && scrolled < window.innerHeight) {
              hero.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`
            }
            parallaxTicking = false
          })
          parallaxTicking = true
        }
      }, { passive: true })
    }

    // ===== SMOOTH SCROLL =====
    function initSmoothScroll() {
      const links = document.querySelectorAll('a[href^="#"]')

      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href')
          if (href === '#') return

          e.preventDefault()
          const targetId = href?.slice(1)
          const targetElement = targetId ? document.getElementById(targetId) : null

          if (targetElement) {
            const navHeight = document.querySelector('.main-nav')?.getBoundingClientRect().height || 0
            const targetPosition = targetElement.offsetTop - navHeight - 100

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            })

            history.pushState(null, '', href)
          }
        })
      })
    }

    // ===== OPTIMIZED HOVER EFFECTS =====
    function initHoverEffects() {
      const iconButtons = document.querySelectorAll('.btn-icon')
      iconButtons.forEach((btn) => {
        btn.addEventListener('click', function (this: any, e: MouseEvent) {
          createRipple(this, e)
          this.style.transform = 'scale(0.9) rotate(90deg)'
          setTimeout(() => {
            this.style.transform = ''
          }, 200)
        })
      })
    }

    // ===== RIPPLE EFFECT UTILITY =====
    function createRipple(element: HTMLElement, event?: MouseEvent) {
      const ripple = document.createElement('span')
      const rect = element.getBoundingClientRect()

      const size = Math.max(rect.width, rect.height)
      const x = (event?.clientX || rect.left + rect.width / 2) - rect.left - size / 2
      const y = (event?.clientY || rect.top + rect.height / 2) - rect.top - size / 2

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        z-index: 1000;
      `

      const computedPosition = window.getComputedStyle(element).position
      if (computedPosition === 'static') {
        element.style.position = 'relative'
      }
      element.style.overflow = 'hidden'
      element.appendChild(ripple)

      setTimeout(() => ripple.remove(), 600)
    }

    // Add ripple animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    // ===== EASTER EGG: KONAMI CODE =====
    function initKonamiCode() {
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
      let konamiIndex = 0

      document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
          konamiIndex++
          if (konamiIndex === konamiCode.length) {
            activateEasterEgg()
            konamiIndex = 0
          }
        } else {
          konamiIndex = 0
        }
      })

      function activateEasterEgg() {
        document.body.style.animation = 'rainbow 3s linear infinite'

        const rainbowStyle = document.createElement('style')
        rainbowStyle.textContent = `
          @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
        `
        document.head.appendChild(rainbowStyle)

        setTimeout(() => {
          document.body.style.animation = ''
          rainbowStyle.remove()
        }, 10000)

        console.log('%c🦸 SUPER COLLECTOR MODE ACTIVATED! 🦸', 'font-size:20px;font-weight:bold;color:#ff006e;')
      }
    }

    // ===== LAZY LOADING IMAGES =====
    function initLazyLoading() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                imageObserver.unobserve(img)
              }
            }
          })
        })

        document.querySelectorAll('img[data-src]').forEach((img) => {
          imageObserver.observe(img)
        })
      }
    }

    // ===== CONSOLE ART =====
    function printConsoleArt() {
      console.log('%c                                                                  ', 'font-size:1px;')
      console.log('%c░▀█▀░█▀█░▀█▀░█▀▀░█▀▀░░░▀█▀░█▀▄░█▀█░█▀▄░▀█▀░█▀█░█▀▀░░░█▀█░█▀█░█▀▀░▀█▀', 'font-family:monospace;color:#C44536;font-weight:bold;font-size:14px;')
      console.log('%c░░█░░█▀█░░█░░█▀▀░▀▀█░░░░█░░█▀▄░█▀█░█░█░░█░░█░█░█░█░░░█▀▀░█░█░▀▀█░░█░', 'font-family:monospace;color:#4A7C8C;font-weight:bold;font-size:14px;')
      console.log('%c░░▀░░▀░▀░░▀░░▀▀▀░▀▀▀░░░░▀░░▀░▀░▀░▀░▀▀░░▀▀▀░▀░▀░▀▀▀░░░▀░░░▀▀▀░▀▀▀░░▀░', 'font-family:monospace;color:#D4B53A;font-weight:bold;font-size:14px;')
      console.log('%c                                                                  ', 'font-size:1px;')
      console.log('%cWelcome to the comic universe! 🦸‍♂️', 'color:#6B6B6B;font-size:12px;')
      console.log('%cBuilt with modern 2025 web techniques - OPTIMIZED FOR PERFORMANCE', 'color:#A8A8A8;font-size:10px;font-style:italic;')
    }

    // ===== ACCESSIBILITY =====
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ;(document.activeElement as HTMLElement)?.blur()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        document.getElementById('themeToggle')?.click()
      }
    })

    // Focus trap
    const focusableElements = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusable = Array.from(document.querySelectorAll(focusableElements))
        const firstFocusable = focusable[0] as HTMLElement
        const lastFocusable = focusable[focusable.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    })

    // Cleanup
    return () => {
      isInitializedRef.current = false
    }
  }, [])

  return (
    <>
      {/* Custom Cursor */}
      <div className="custom-cursor"></div>
      <div className="cursor-follower"></div>

      {/* Floating Comic Elements */}
      <div className="floating-elements">
        <div className="float-shape float-circle"></div>
        <div className="float-shape float-star"></div>
        <div className="float-shape float-bolt"></div>
      </div>

      {/* FPS Monitor */}
      <div id="fpsMonitor" className="fps-monitor glass-panel">
        <div className="fps-value">-- FPS</div>
        <div className="fps-label">Performance</div>
      </div>
    </>
  )
}
