export default function EventCard({ event }) {
  return <article><strong>{event.title}</strong><span>{event.category}</span></article>;
}