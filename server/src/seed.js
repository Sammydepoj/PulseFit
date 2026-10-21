import { pool } from "./db.js";

// The content that used to be hardcoded in the React app (client/src/data/studio.js).
// Upserts by id, so re-running updates rows in place and keeps users' saved classes.

const coaches = [
    {
        id: 1,
        initials: "MA",
        image: "/images/strength.jpg",
        imageAlt:
            "A coach's hands gripping a loaded barbell during a strength class",
        credit: "Tyler Raye",
        name: "Mateo Alvarez",
        specialty: "Strength",
        bio: "Ex-national powerlifter.",
        quote: "“Lift heavy, leave with all your joints.”",
    },
    {
        id: 2,
        initials: "IL",
        image: "/images/boxing.jpg",
        imageAlt: "A boxer in white gloves hitting a heavy bag",
        credit: "Pete Alexopoulos",
        name: "Ingrid Larsen",
        specialty: "Boxing and conditioning",
        bio: "Ran a fight camp for six years.",
        quote: "“Hard work is quieter than you think.”",
    },
    {
        id: 3,
        initials: "KW",
        image: "/images/cycling.jpg",
        imageAlt: "A row of people riding stationary bikes in a studio class",
        credit: "Trust Katsande",
        name: "Kenji Watanabe",
        specialty: "Cycling and bootcamp",
        bio: "Former triathlete.",
        quote: "“Pace yourself; the week is long.”",
    },
    {
        id: 4,
        initials: "LH",
        image: "/images/yoga.jpg",
        imageAlt: "Two people practicing yoga poses in a bright wooden studio",
        credit: "Carl Barcelo",
        name: "Leila Haddad",
        specialty: "Yoga and mobility",
        bio: "Physio-trained yoga teacher.",
        quote: "“Recovery is training too.”",
    },
];

// [id, day, period, time, name, coach_id, level]
const classes = [
    [1, "Mon", "morning", "06:30", "Power Lift", 1, "hard"],
    [2, "Mon", "evening", "18:00", "Easy Strength", 2, "steady"],
    [3, "Tue", "morning", "07:00", "Spin Burn", 3, "hard"],
    [4, "Tue", "evening", "19:00", "Mobility Flow", 4, "gentle"],
    [5, "Wed", "morning", "06:30", "Power Lift", 1, "hard"],
    [6, "Wed", "evening", "18:00", "Boxing Basics", 2, "steady"],
    [7, "Thu", "morning", "07:00", "Steady Spin", 3, "steady"],
    [8, "Thu", "evening", "19:00", "Yoga Reset", 4, "gentle"],
    [9, "Fri", "morning", "06:30", "Full Body", 1, "steady"],
    [10, "Fri", "evening", "17:30", "Wind-Down Stretch", 4, "gentle"],
    [11, "Sat", "morning", "09:00", "Team Bootcamp", 3, "hard"],
    [12, "Sat", "evening", "11:00", "Yoga Reset", 4, "gentle"],
];

const plans = [
    {
        id: 1,
        name: "Single class",
        priceCents: 1800,
        per: "/class",
        note: "Try us once, no commitment",
        perks: [
            "Any class on the schedule",
            "Book up to 48 hours ahead",
            "Mat, towel and locker included",
        ],
        cta: "Book a class",
        featured: false,
    },
    {
        id: 2,
        name: "Steady",
        priceCents: 7200,
        per: "/month",
        note: "Works out to $9 a class",
        perks: [
            "8 classes a month",
            "Book up to 7 days ahead",
            "Freeze one month a year",
        ],
        cta: "Join Steady",
        featured: true,
    },
    {
        id: 3,
        name: "Unlimited",
        priceCents: 12000,
        per: "/month",
        note: "For people who live here",
        perks: [
            "Every class, any day",
            "Book up to 14 days ahead",
            "One free guest pass a month",
        ],
        cta: "Go Unlimited",
        featured: false,
    },
];

const client = await pool.connect();
try {
    await client.query("BEGIN");

    for (const c of coaches) {
        await client.query(
            `INSERT INTO coaches (id, name, initials, specialty, bio, quote, image, image_alt, credit)
             OVERRIDING SYSTEM VALUE
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             ON CONFLICT (id) DO UPDATE SET
                name=EXCLUDED.name, initials=EXCLUDED.initials, specialty=EXCLUDED.specialty,
                bio=EXCLUDED.bio, quote=EXCLUDED.quote, image=EXCLUDED.image,
                image_alt=EXCLUDED.image_alt, credit=EXCLUDED.credit`,
            [c.id, c.name, c.initials, c.specialty, c.bio, c.quote, c.image, c.imageAlt, c.credit],
        );
    }

    for (const [id, day, period, time, name, coachId, level] of classes) {
        await client.query(
            `INSERT INTO classes (id, day, period, time, name, coach_id, level)
             OVERRIDING SYSTEM VALUE
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             ON CONFLICT (id) DO UPDATE SET
                day=EXCLUDED.day, period=EXCLUDED.period, time=EXCLUDED.time,
                name=EXCLUDED.name, coach_id=EXCLUDED.coach_id, level=EXCLUDED.level`,
            [id, day, period, time, name, coachId, level],
        );
    }

    for (const [i, p] of plans.entries()) {
        await client.query(
            `INSERT INTO plans (id, name, price_cents, per, note, perks, cta, featured, position)
             OVERRIDING SYSTEM VALUE
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
             ON CONFLICT (id) DO UPDATE SET
                name=EXCLUDED.name, price_cents=EXCLUDED.price_cents, per=EXCLUDED.per,
                note=EXCLUDED.note, perks=EXCLUDED.perks, cta=EXCLUDED.cta,
                featured=EXCLUDED.featured, position=EXCLUDED.position`,
            [p.id, p.name, p.priceCents, p.per, p.note, p.perks, p.cta, p.featured, i],
        );
    }

    // Explicit ids don't advance the identity counters; do it so future inserts don't collide.
    for (const table of ["coaches", "classes", "plans"]) {
        await client.query(
            `SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT max(id) FROM ${table}))`,
        );
    }

    await client.query("COMMIT");
    console.log(
        `Seeded ${coaches.length} coaches, ${classes.length} classes, ${plans.length} plans.`,
    );
} catch (err) {
    await client.query("ROLLBACK");
    throw err;
} finally {
    client.release();
    await pool.end();
}
