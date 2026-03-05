import type { Metadata } from 'next'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import { getDatabase } from '@/utilities/db'

export const metadata: Metadata = {
  title: 'Events | Tates Trading Post',
  description: 'Upcoming events, signings, and special occasions at Tates Trading Post',
}

export default async function EventsPage() {
  // Raw SQL approach - comment out Payload API
  // const payload = await getPayload({ config: configPromise })

  // Use singleton database connection
  const db = getDatabase()

  // Fetch all published events
  // const events = await payload.find({
  //   collection: 'events',
  //   limit: 100,
  //   where: {
  //     status: {
  //       equals: 'published',
  //     },
  //   },
  //   sort: 'date',
  //   depth: 2,
  // })
  const eventsRaw = db.prepare(`
    SELECT e.*, m.url as image_url, m.alt as image_alt
    FROM events e
    LEFT JOIN media m ON e.image_id = m.id
    WHERE e.status = 'published'
    ORDER BY e.date ASC
    LIMIT 100
  `).all()

  // Get site settings for store info
  // const siteSettings = await payload.findGlobal({
  //   slug: 'site-settings',
  // })
  const siteSettings = db.prepare(`
    SELECT * FROM site_settings LIMIT 1
  `).get()

  // No db.close() - singleton connection is reused

  // Transform events to match expected format
  const events = {
    docs: eventsRaw.map((e: any) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      timeStart: e.time_start,
      timeEnd: e.time_end,
      description: e.description,
      status: e.status,
      slug: e.slug,
      image: e.image_id ? {
        id: e.image_id,
        url: e.image_url,
        alt: e.image_alt
      } : null
    }))
  }

  return (
    <main className="events-page">
      {/* Hero Section */}
      <div className="events-hero">
        <div className="events-hero-content">
          <div className="events-hero-badge">UPCOMING EVENTS</div>
          <h1 className="events-hero-title">
            <span className="gradient-text">JOIN</span> THE COMMUNITY
          </h1>
          <p className="events-hero-subtitle">
            Meet artists, get signatures, and connect with fellow collectors
          </p>
        </div>
      </div>

      <div className="events-container">
        {events.docs.length === 0 ? (
          <div className="no-events">
            <h3>No upcoming events</h3>
            <p>Check back soon for new events and signings!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.docs.map((event, index) => {
              const eventDate = new Date(event.date)
              const month = eventDate.toLocaleDateString('en-US', { month: 'short' })
              const day = eventDate.getDate()

              return (
                <div key={event.id} className="event-card">
                  <div className="event-date-badge">
                    <span className="event-month">{month}</span>
                    <span className="event-day">{day}</span>
                  </div>

                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>

                    <div className="event-meta">
                      {event.timeStart && event.timeEnd && (
                        <div className="event-time">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>{event.timeStart} - {event.timeEnd}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Store Information */}
        <div className="store-info-card">
          <h2>Visit Our Store</h2>
          <div className="store-details">
            <div className="store-detail-item">
              <h3>Location</h3>
              <p>
                <a href="https://www.google.com/maps/search/?api=1&query=10801+Kreighbaum+Road,+Corriganville,+MD" target="_blank" rel="noopener noreferrer">
                  10801 Kreighbaum Road<br />
                  Corriganville, MD 21524
                </a>
              </p>
            </div>

            <div className="store-detail-item">
              <h3>Hours</h3>
              <div className="store-hours-list">
                <div className="hours-row">
                  <span className="hours-day">Monday</span>
                  <span className="hours-time">Closed</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Tuesday</span>
                  <span className="hours-time">Closed</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Wednesday</span>
                  <span className="hours-time">12:00 PM - 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Thursday</span>
                  <span className="hours-time">12:00 PM - 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Friday</span>
                  <span className="hours-time">12:00 PM - 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Saturday</span>
                  <span className="hours-time">12:00 PM - 6:00 PM</span>
                </div>
                <div className="hours-row">
                  <span className="hours-day">Sunday</span>
                  <span className="hours-time">Closed</span>
                </div>
              </div>
            </div>

            <div className="store-detail-item">
              <h3>Contact</h3>
              <p>
                <a href="tel:+13013382274">(301) 338-2274</a>
              </p>
              <p>
                <a href="mailto:georgeedavisiii@hotmail.com">georgeedavisiii@hotmail.com</a>
              </p>
              <p>
                <a href="https://instagram.com/tatestradingpost" target="_blank" rel="noopener noreferrer">@tatestradingpost</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
