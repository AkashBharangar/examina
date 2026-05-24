type IconProps = {
  className?: string;
};

function iconClassName(className?: string) {
  return className ?? 'h-4 w-4';
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M4 5.75A1.75 1.75 0 0 1 5.75 4h4.5A1.75 1.75 0 0 1 12 5.75v4.5A1.75 1.75 0 0 1 10.25 12h-4.5A1.75 1.75 0 0 1 4 10.25v-4.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 5.75A1.75 1.75 0 0 1 13.75 4h4.5A1.75 1.75 0 0 1 20 5.75v4.5A1.75 1.75 0 0 1 18.25 12h-4.5A1.75 1.75 0 0 1 12 10.25v-4.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 13.75A1.75 1.75 0 0 1 5.75 12h4.5A1.75 1.75 0 0 1 12 13.75v4.5A1.75 1.75 0 0 1 10.25 20h-4.5A1.75 1.75 0 0 1 4 18.25v-4.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 13.75A1.75 1.75 0 0 1 13.75 12h4.5A1.75 1.75 0 0 1 20 13.75v4.5A1.75 1.75 0 0 1 18.25 20h-4.5A1.75 1.75 0 0 1 12 18.25v-4.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function AssignmentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M8 6.75h8M8 11h8M8 15.25h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.25 3.75h11.5A1.75 1.75 0 0 1 19.5 5.5v13A1.75 1.75 0 0 1 17.75 20.25H6.25A1.75 1.75 0 0 1 4.5 18.5v-13A1.75 1.75 0 0 1 6.25 3.75Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <circle cx="11" cy="11" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.5 15.5 3.25 3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M12 5.5v13M5.5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18l-1.8-5.4L4.7 10.8 10.2 9 12 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M7.5 3.75v2.5M16.5 3.75v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.5 8.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.25 5.5h11.5A1.75 1.75 0 0 1 19.5 7.25v11.5a1.75 1.75 0 0 1-1.75 1.75H6.25A1.75 1.75 0 0 1 4.5 18.75V7.25A1.75 1.75 0 0 1 6.25 5.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M12 15.5V6.75M8.75 10.25 12 7l3.25 3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.75 15.5v2.25A1.75 1.75 0 0 0 7.5 19.5h9A1.75 1.75 0 0 0 18.25 17.75V15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="M9 6.25h6M10 6.25v-1A1.25 1.25 0 0 1 11.25 4h1.5A1.25 1.25 0 0 1 14 5.25v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.75 6.25h10.5M8 6.25l.5 11A1.5 1.5 0 0 0 10 18.75h4a1.5 1.5 0 0 0 1.5-1.5l.5-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClassName(className)} aria-hidden="true">
      <path d="m6.5 9 5.5 5.5L17.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
