# Legacy Feature Parity

The legacy screenshots were used as a functional specification. This matrix separates implemented native behavior from integrations that still need an official data owner.

| Legacy area | Native implementation | Data status | Production follow-up |
| --- | --- | --- | --- |
| Home / global navigation | Native stack, service index, persistent Home/emergency/help/settings rail | Complete | Final institutional copy review |
| Emergency | Confirmation flow for 911 or Campus Public Safety | Current public numbers | Native-device call-flow QA |
| My Pugliese Info | Profile, appointments, transactions, holds, balance, email, Wi-Fi fields | Existing local typed adapter + demo fallback | SSO and official student-record API |
| Academic Calendar | Full current Summer 2026, Fall 2026, and Winter 2027 student-facing Registrar dates, next-date banner, and official source link | Verified official snapshot + typed local service | Refresh when the Registrar publishes changes or another term |
| Student ID | Clearly marked demo credential, live-screen signal, and privacy masking | Demo only; not valid for entry or identification | Signed issuance, revocation, verifier application, and security review |
| Library | Official homepage, OneSearch, databases, research guides, librarian help, and hours | Existing local typed adapter + official destinations | Content-owner review and ongoing link monitoring |
| Directory | Searchable Departments / Employees tabs and contact actions | Realistic seeded records | Official directory feed and record ownership |
| Course Catalog | Search, term selection, online-only toggle, details | Existing local catalog adapter + demo fallback | Official catalog/section availability API |
| Events | Previous/next date navigation, search, counts, empty states | Realistic seeded events | Official calendar API and save/reminder flow |
| Campus Map | Destination picker, room/floor context, Apple Maps handoff | Existing location adapter + seeded destinations | Official campus geometry and accessible indoor routes |
| IT Status | Per-service status, refresh timestamp, support actions | Demo health values | Official incident/status feed |
| Alerts | Alert feed and persisted safety/reminder preferences | Demo feed | CUNY Alert integration and push notifications |
| Pugliese Help | Searchable FAQs, expandable answers, important contacts, official portal links | Seeded help content + public links | Content-owner workflow and live knowledge search |
| Settings | User type, privacy mode, visible-section toggles, notifications, reset | Persisted locally with AsyncStorage | Account-synced preferences after SSO |
| My Career | Tasks/events/videos modes, credit milestones, expandable action groups | Seeded guidance | Magner Career Center feeds and completion tracking |
| Pugliese Fix-it | Issue type, location, description validation, local success state | Local demo only; nothing transmitted | Approved ticketing API, attachments, status tracking |
| Password saving | Not carried forward | Intentionally removed | Use platform-secure SSO tokens only |

## Integration Rule

Screens may use seeded content for interaction and layout testing, but the UI must label demo data and must not imply that a record, alert, incident, or report is official until its production service is connected.
