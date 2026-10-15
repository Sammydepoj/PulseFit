// All the site's content lives here as plain data. Components map over
// these arrays, so adding a class or coach never means copy-pasting JSX.

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// period decides the grid row (morning = row 2, evening = row 3), so a
// filtered-out class leaves an empty cell instead of shifting the others.
export const classes = [
    { id: 1, day: "Mon", period: "morning", time: "06:30", name: "Power Lift", coach: "Mateo", level: "hard" },
    { id: 2, day: "Mon", period: "evening", time: "18:00", name: "Easy Strength", coach: "Ingrid", level: "steady" },
    { id: 3, day: "Tue", period: "morning", time: "07:00", name: "Spin Burn", coach: "Kenji", level: "hard" },
    { id: 4, day: "Tue", period: "evening", time: "19:00", name: "Mobility Flow", coach: "Leila", level: "gentle" },
    { id: 5, day: "Wed", period: "morning", time: "06:30", name: "Power Lift", coach: "Mateo", level: "hard" },
    { id: 6, day: "Wed", period: "evening", time: "18:00", name: "Boxing Basics", coach: "Ingrid", level: "steady" },
    { id: 7, day: "Thu", period: "morning", time: "07:00", name: "Steady Spin", coach: "Kenji", level: "steady" },
    { id: 8, day: "Thu", period: "evening", time: "19:00", name: "Yoga Reset", coach: "Leila", level: "gentle" },
    { id: 9, day: "Fri", period: "morning", time: "06:30", name: "Full Body", coach: "Mateo", level: "steady" },
    { id: 10, day: "Fri", period: "evening", time: "17:30", name: "Wind-Down Stretch", coach: "Leila", level: "gentle" },
    { id: 11, day: "Sat", period: "morning", time: "09:00", name: "Team Bootcamp", coach: "Kenji", level: "hard" },
    { id: 12, day: "Sat", period: "evening", time: "11:00", name: "Yoga Reset", coach: "Leila", level: "gentle" },
];

export const levels = ["gentle", "steady", "hard"];

export const trainers = [
    { id: 1, initials: "MA", image: "/images/strength.jpg", imageAlt: "A coach's hands gripping a loaded barbell during a strength class", credit: "Tyler Raye", name: "Mateo Alvarez", specialty: "Strength", bio: "Ex-national powerlifter.", quote: "“Lift heavy, leave with all your joints.”" },
    { id: 2, initials: "IL", image: "/images/boxing.jpg", imageAlt: "A boxer in white gloves hitting a heavy bag", credit: "Pete Alexopoulos", name: "Ingrid Larsen", specialty: "Boxing and conditioning", bio: "Ran a fight camp for six years.", quote: "“Hard work is quieter than you think.”" },
    { id: 3, initials: "KW", image: "/images/cycling.jpg", imageAlt: "A row of people riding stationary bikes in a studio class", credit: "Trust Katsande", name: "Kenji Watanabe", specialty: "Cycling and bootcamp", bio: "Former triathlete.", quote: "“Pace yourself; the week is long.”" },
    { id: 4, initials: "LH", image: "/images/yoga.jpg", imageAlt: "Two people practicing yoga poses in a bright wooden studio", credit: "Carl Barcelo", name: "Leila Haddad", specialty: "Yoga and mobility", bio: "Physio-trained yoga teacher.", quote: "“Recovery is training too.”" },
];

export const plans = [
    { id: 1, name: "Single class", price: "$18", per: "/class", note: "Try us once, no commitment", perks: ["Any class on the schedule", "Book up to 48 hours ahead", "Mat, towel and locker included"], cta: "Book a class", featured: false },
    { id: 2, name: "Steady", price: "$72", per: "/month", note: "Works out to $9 a class", perks: ["8 classes a month", "Book up to 7 days ahead", "Freeze one month a year"], cta: "Join Steady", featured: true },
    { id: 3, name: "Unlimited", price: "$120", per: "/month", note: "For people who live here", perks: ["Every class, any day", "Book up to 14 days ahead", "One free guest pass a month"], cta: "Go Unlimited", featured: false },
];

export const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#schedule", label: "Schedule" },
    { href: "#trainers", label: "Trainers" },
    { href: "#membership", label: "Membership" },
    { href: "#contact", label: "Contact" },
];

export const hero = {
    image: "/images/hero.jpg",
    imageAlt: "A woman setting up a deadlift in a strength studio",
    credit: "Rodrigo Rodrigues",
};
