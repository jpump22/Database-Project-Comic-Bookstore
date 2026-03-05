import React from 'react'
import type { EventsSectionBlock, Event } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const EventsSectionBlock: React.FC<EventsSectionBlock> = async (props) => {
  // Extract events (up to 3)
  const events =
    props.events
      ?.filter((e): e is Event => typeof e === 'object' && e !== null)
      .slice(0, 3) || []

  // Fetch site settings for store hours and contact info
  const siteSettings = await getCachedGlobal('site-settings', 1)()

  // Helper to format date (e.g., "08" for day)
  const formatDay = (dateString: string): string => {
    const date = new Date(dateString)
    return date.getDate().toString().padStart(2, '0')
  }

  // Helper to format month (e.g., "FEB")
  const formatMonth = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  }

  // Helper to format time range
  const formatTimeRange = (timeStart?: string | null, timeEnd?: string | null): string => {
    if (timeStart && timeEnd) {
      return `${timeStart} - ${timeEnd}`
    } else if (timeStart) {
      return timeStart
    }
    return ''
  }

  // Store hours
  const hours = {
    monTue: 'Closed',
    wedSat: '12:00 PM - 6:00 PM',
    sunday: 'Closed',
  }
  const phone = '(301) 338-2274'
  const email = 'georgeedavisiii@hotmail.com'

  return (
    <section className="events-section" id="events">
      <div className="events-split">
        {/* Events Content */}
        <div className="events-content">
          <div className="glass-panel event-panel">
            <h2 className="events-title">
              <span className="title-small">Upcoming</span>
              <span className="title-big">EVENTS</span>
            </h2>
            <ul className="events-list">
              {events.length > 0 ? (
                events.map((event) => (
                  <li key={event.id} className="event-item">
                    <div className="event-date glass-panel">
                      <span className="date-num">{formatDay(event.date)}</span>
                      <span className="date-month">{formatMonth(event.date)}</span>
                    </div>
                    <div className="event-details">
                      <h4>{event.title}</h4>
                      <p>
                        {event.description}
                        {event.timeStart && ` · ${formatTimeRange(event.timeStart, event.timeEnd)}`}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="event-item">
                    <div className="event-date glass-panel">
                      <span className="date-num">08</span>
                      <span className="date-month">FEB</span>
                    </div>
                    <div className="event-details">
                      <h4>Mike Mignola Signing</h4>
                      <p>Meet the Hellboy creator · 2-5 PM</p>
                    </div>
                  </li>
                  <li className="event-item">
                    <div className="event-date glass-panel">
                      <span className="date-num">15</span>
                      <span className="date-month">FEB</span>
                    </div>
                    <div className="event-details">
                      <h4>Vintage Appraisal Day</h4>
                      <p>Free expert valuations · 12-6 PM</p>
                    </div>
                  </li>
                  <li className="event-item">
                    <div className="event-date glass-panel">
                      <span className="date-num">22</span>
                      <span className="date-month">FEB</span>
                    </div>
                    <div className="event-details">
                      <h4>Cosplay Contest</h4>
                      <p>Prizes & comic swap · 4-8 PM</p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Events Visual */}
        <div className="events-visual">
          <div className="visual-card glass-panel">
            <div className="benday-overlay benday-yellow"></div>
            <div className="visual-content">
              <span className="visual-label">Store Hours</span>
              <div className="hours-grid">
                <div className="hours-item">
                  <span>Mon-Tue</span>
                  <strong>{hours.monTue}</strong>
                </div>
                <div className="hours-item">
                  <span>Wed-Sat</span>
                  <strong>{hours.wedSat}</strong>
                </div>
                <div className="hours-item">
                  <span>Sunday</span>
                  <strong>{hours.sunday}</strong>
                </div>
              </div>
              <div className="location-info">
                <p>
                  <strong>Location</strong>
                </p>
                <p>
                  10801 Kreighbaum Road
                  <br />
                  Corriganville, MD 21524
                </p>
                <p>
                  <strong>Contact</strong>
                </p>
                <p>
                  <a href="tel:+13013382274">{phone}</a>
                </p>
                <p>
                  <a href="mailto:georgeedavisiii@hotmail.com">{email}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
