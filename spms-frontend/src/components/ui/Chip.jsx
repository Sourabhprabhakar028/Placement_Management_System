const MAP = {
  // Placement status
  PLACED:       'chip-green',
  NOT_PLACED:   'chip-rose',
  IN_PROCESS:   'chip-teal',
  // Application status
  APPLIED:      'chip-amber',
  SHORTLISTED:  'chip-blue',
  SELECTED:     'chip-green',
  REJECTED:     'chip-rose',
  // Interview result
  PASS:         'chip-green',
  FAIL:         'chip-rose',
  PENDING:      'chip-amber',
  // General
  ACTIVE:       'chip-green',
  HIRING:       'chip-green',
  PROCESS:      'chip-amber',
  COMING:       'chip-blue',
  NEW:          'chip-violet',
  LIVE:         'chip-teal',
  OFFER_ACCEPTED:'chip-green',
  OFFER_DECLINED:'chip-rose',
}

export default function Chip({ label }) {
  const cls = MAP[label?.toUpperCase()] || 'chip-blue'
  return <span className={`chip ${cls}`}>{label}</span>
}
