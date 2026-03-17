/**
 * Lens Deep Content — Enrichment Layer
 * ────────────────────────────────────────────
 * The "secret sauce" for the Integrated Map's 6-lens narrative system.
 * Each domain × lens combination provides deeply rich content:
 *   - Soulful: Jungian, archetypal, poetic, ecopsychological
 *   - Therapeutic: Multi-model clinical depth (EFT, ACT, DBT, IFS, Polyvagal, etc.)
 *   - Practical: Atomic habits, micro-changes, bold action steps
 *   - Developmental: Integral theory, Kegan, Erikson, Spiral Dynamics
 *   - Relational: The partner's experience, the "we" space, I-Thou
 *   - Simple: No jargon, concrete, real
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface DeepLensContent {
  quotes: string[];            // 5-8 attributed quotes
  archetypes: string[];        // Jungian archetypes relevant to this domain
  ecoPsychology: string;       // Ecopsychological metaphor
  poetry: string;              // A short poetic passage
  microPractice: string;       // The ONE atomic habit
  therapyModels: string[];     // Which models illuminate this domain
  developmentalStage: string;  // Relevant developmental framework
  simpleMetaphor: string;      // A one-line metaphor a 20-year-old would get
}

export type LensLibrary = Record<string, Record<string, DeepLensContent>>;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THE LIBRARY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LENS_DEEP_CONTENT: LensLibrary = {

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃ DOMAIN 1: FOUNDATION (Attachment — ECR-R)           ┃
  // ┃ Anxiety, Avoidance, Window, Attachment Style        ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  foundation: {

    soulful: {
      quotes: [
        '"The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed." — Carl Jung',
        '"Perhaps everything terrible is in its deepest being something helpless that wants help from us." — Rainer Maria Rilke, Letters to a Young Poet',
        '"Love is the whole thing. We are only pieces." — Rumi',
        '"Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift." — Mary Oliver',
        '"The soul is placed in the body like a rough diamond, and must be polished, or the luster of it will never appear." — Daniel Defoe',
        '"In a real sense all life is interrelated. All men are caught in an inescapable network of mutuality." — Martin Luther King Jr.',
        '"Where you stumble, there lies your treasure." — Joseph Campbell',
      ],
      archetypes: ['The Orphan', 'The Lover', 'The Great Mother', 'The Wounded Child', 'The Self'],
      ecoPsychology: `Your attachment style is like the root system of an ancient tree. Some roots grow deep and straight into the earth — secure, drawing water from the dark soil without hesitation. Other roots grow sideways, spreading wide but shallow, searching frantically for moisture along the surface (anxious attachment). And some roots learn to grow inward, curling back on themselves, drawing from their own stored reserves rather than trusting the ground will provide (avoidant attachment). None of these are broken. Every root system is a record of the soil it grew in. The question is not whether your roots are right — it is whether the soil you are planted in now can nourish a new kind of growth. Ecopsychology teaches us that we are not separate from our relational environment. Just as a forest communicates through mycorrhizal networks underground, your attachment system is a living network shaped by every hand that held you and every hand that let go.`,
      poetry: `You came into love carrying a map\ndrawn by hands that were not always steady.\nSome rooms were marked "safe."\nSome hallways were marked "run."\nAnd you have been navigating ever since\nwith a cartography of the heart\nthat was never fully yours.\n\nBut here is the secret the map doesn't show:\nyou can redraw it.\nNot by forgetting the old corridors,\nbut by walking new ones\nuntil your body believes\nthe door will open\nwhen you knock.`,
      microPractice: 'Each morning, place your hand on your chest for 10 seconds and say internally: "I am here. I am safe enough." This is not affirmation — it is somatic re-patterning. Your vagus nerve responds to touch and warmth. Do it before you check your phone. Stack it onto the moment your feet hit the floor.',
      therapyModels: ['EFT (Sue Johnson)', 'Polyvagal Theory (Stephen Porges)', 'AEDP (Diana Fosha)', 'Somatic Experiencing (Peter Levine)', 'Schema Therapy (Jeffrey Young)'],
      developmentalStage: 'In Erikson\'s framework, attachment maps directly to Trust vs. Mistrust (Stage 1) — the earliest developmental question: "Is the world safe? Will my needs be met?" But it reverberates through every subsequent stage. In Kegan\'s model, secure attachment correlates with the capacity to move from the Socialized Mind (Order 3) to the Self-Authoring Mind (Order 4), because only when you trust that connection survives disagreement can you risk having your own voice.',
      simpleMetaphor: 'Your attachment style is like your phone\'s default Wi-Fi settings — it was configured by your first network, and now it auto-connects to familiar signals, even when the connection is bad.',
    },

    therapeutic: {
      quotes: [
        '"Are you there for me? Can I count on you? Will you respond when I need you?" — Sue Johnson, Hold Me Tight',
        '"The body keeps the score." — Bessel van der Kolk',
        '"Safety is not the absence of threat, it is the presence of connection." — Stephen Porges',
        '"What is most personal is most universal." — Carl Rogers',
        '"Between stimulus and response there is a space. In that space is our freedom." — Viktor Frankl',
        '"The curious paradox is that when I accept myself just as I am, then I can change." — Carl Rogers',
      ],
      archetypes: ['The Healer', 'The Wounded Healer', 'The Caregiver'],
      ecoPsychology: 'In polyvagal terms, your attachment system is the oldest social engagement system in your body — it predates language, predates thought. It lives in the brainstem, in the vagus nerve, in the muscles of your face and throat.',
      poetry: `The wound is where the light enters.\nBut first, the wound is where the wound is.\nHonor that.`,
      microPractice: 'When you feel activated (heart racing, stomach tight, mind spinning), name the state: "This is my attachment alarm. It is real. It is old. I am safe right now." This interrupts the amygdala hijack and activates prefrontal processing. Research shows naming emotions reduces their intensity by up to 50% (Lieberman et al., 2007).',
      therapyModels: ['EFT (Sue Johnson)', 'IFS (Richard Schwartz)', 'ACT (Steven Hayes)', 'Polyvagal Theory (Stephen Porges)', 'AEDP (Diana Fosha)', 'Somatic Experiencing (Peter Levine)', 'Schema Therapy (Jeffrey Young)', 'DBT (Marsha Linehan)'],
      developmentalStage: `In EFT, attachment distress follows a predictable cycle: one partner pursues (protest behavior — driven by anxiety), the other withdraws (deactivation — driven by avoidance). Sue Johnson calls this the "Demon Dialogue." It is not about the dishes. It is never about the dishes. It is about the primal question: "Are you there for me?"

In IFS terms, your attachment style reflects which protector parts are most active. Anxious attachment often involves a firefighter part that floods you with pursuit energy — texting, checking, seeking reassurance — to manage the exile's terror of abandonment. Avoidant attachment involves a manager part that preemptively distances to protect the exile that learned closeness equals engulfment or disappointment.

Polyvagal theory (Porges) maps this onto the autonomic nervous system. Secure attachment correlates with ventral vagal activation — the "social engagement system" — where you can be present, curious, and connected. Anxious attachment often involves sympathetic activation (fight-or-flight), while avoidant attachment may involve dorsal vagal shutdown (freeze, collapse, numbing).

Schema therapy identifies Early Maladaptive Schemas formed in childhood — Abandonment/Instability, Mistrust/Abuse, Emotional Deprivation — that drive attachment behavior in adult relationships. The schema feels like truth ("People always leave") but it is a lens, not a fact.

AEDP (Diana Fosha) offers a powerful reframe: attachment wounds create "aloneness in the face of overwhelming emotion." Healing happens through "dyadic affect regulation" — experiencing difficult feelings in the presence of someone who stays. Every time your partner stays present with your distress, it rewrites the neural code.`,
      simpleMetaphor: 'Attachment is your emotional immune system — it was trained by early experiences to detect threats to connection, and sometimes it fires false alarms.',
    },

    practical: {
      quotes: [
        '"You do not rise to the level of your goals. You fall to the level of your systems." — James Clear, Atomic Habits',
        '"Make it obvious, attractive, easy, and satisfying." — James Clear',
        '"After I [CURRENT HABIT], I will [NEW HABIT]." — BJ Fogg, Tiny Habits',
        '"People do not decide their futures. They decide their habits, and their habits decide their futures." — F. M. Alexander',
        '"The secret of change is to focus all your energy not on fighting the old, but on building the new." — Socrates (via Dan Millman)',
      ],
      archetypes: ['The Builder', 'The Warrior'],
      ecoPsychology: 'Think of your attachment system like a garden — it needs daily tending, not a one-time planting. Small, consistent actions reshape neural pathways the way water reshapes stone.',
      poetry: `Do the next right thing.\nThen do it again tomorrow.`,
      microPractice: `THE ONE STEP: Create a "Connection Bid Response" habit. When your partner reaches toward you — a touch, a comment, a look — respond within 3 seconds. Not with a speech. Just turn toward them. Make eye contact. Say "mm-hmm" or "tell me more." Gottman's research shows couples who respond to bids 86% of the time stay together. Couples who respond 33% of the time don't. That's the gap. It's not grand gestures. It's three seconds of turning toward, fifty times a day.

HABIT STACK: After your partner says anything to you (cue), turn your body toward them and make eye contact (behavior), and notice the micro-moment of warmth (reward).

THIS WEEK: Track it. Put 5 small objects (coins, paper clips) in your left pocket each morning. Every time you consciously turn toward a bid, move one to your right pocket. Goal: move all 5 by dinner. That's your minimum viable connection.`,
      therapyModels: ['Gottman Method (John Gottman)', 'Tiny Habits (BJ Fogg)', 'Atomic Habits (James Clear)', 'Stages of Change (Prochaska & DiClemente)'],
      developmentalStage: 'In the Stages of Change model (Prochaska), awareness of your attachment pattern moves you from Precontemplation to Contemplation. The micro-practice moves you from Contemplation to Preparation. Doing it once is Action. Doing it for six months is Maintenance. You only need to be in Action right now. One bid, one turn, one moment.',
      simpleMetaphor: 'Fixing your attachment style isn\'t a renovation — it\'s more like going to the gym. Small reps, every day, and one day you realize you\'re stronger than you thought.',
    },

    developmental: {
      quotes: [
        '"The subject of one stage becomes the object of the next." — Robert Kegan, The Evolving Self',
        '"We do not grow absolutely, chronologically. We grow sometimes in one dimension, and not in another; unevenly." — Anaïs Nin',
        '"The privilege of a lifetime is to become who you truly are." — Carl Jung',
        '"Development is not about leaving stages behind, but about transcending and including them." — Ken Wilber',
        '"We are not what happened to us. We are what we choose to become." — Carl Jung',
      ],
      archetypes: ['The Hero on the Journey', 'The Self', 'The Wise Old Man/Woman'],
      ecoPsychology: 'In nature, growth rings tell the story of every season — drought, abundance, fire, rain. Your attachment history is your growth ring record. The tight rings of difficult years are not flaws — they are proof of survival.',
      poetry: `You are not behind.\nYou are not broken.\nYou are mid-spiral,\nrising through a season\nyou have visited before —\nbut this time,\nyou see it from above.`,
      microPractice: 'Journal for 5 minutes each Sunday: "What did my attachment system do this week? What did I do in response?" This builds metacognitive awareness — the capacity to observe your own patterns, which Kegan identifies as the hallmark of developmental growth.',
      therapyModels: ['Integral Theory (Ken Wilber)', 'Orders of Consciousness (Robert Kegan)', 'Psychosocial Development (Erik Erikson)', 'Spiral Dynamics (Beck & Cowan)', 'Ego Development (Jane Loevinger)'],
      developmentalStage: `Attachment development maps beautifully onto Kegan's Orders of Consciousness. At Order 2 (Imperial Mind), attachment is purely instrumental — "What can this person do for me?" At Order 3 (Socialized Mind), attachment becomes identity-fusing — "I am who my partner needs me to be." At Order 4 (Self-Authoring Mind), attachment becomes chosen — "I commit to you from a place of fullness, not need." At Order 5 (Self-Transforming Mind), attachment becomes fluid — "We are two rivers that chose to merge, and the merging creates something neither could be alone."

Ken Wilber's Integral model adds the crucial insight that development unfolds across multiple lines simultaneously. You might be cognitively at Order 4 but emotionally at Order 3 — which is exactly why smart people still get triggered by attachment fears. The work is not to think your way out but to develop the emotional line to match your cognitive one.

Spiral Dynamics offers another lens: at Purple/Red (egocentric), attachment is about survival and power. At Blue (conformist), it is about duty and loyalty. At Orange (achievement), it is about finding the "right" partner. At Green (pluralistic), it is about mutual growth. At Teal (integral), it is about two whole people choosing interdependence. Each level transcends and includes the one before it.

Loevinger's ego development research shows that the capacity for genuine intimacy (the Autonomous stage, E8) requires the ability to tolerate ambiguity, hold paradox, and integrate conflicting needs. Your attachment work is literally building this capacity.`,
      simpleMetaphor: 'Your attachment style is like learning to drive — first it\'s terrifying and takes all your focus, then one day it\'s automatic. Right now you\'re just learning to check the mirrors.',
    },

    relational: {
      quotes: [
        '"When you love someone, you do not love them all the time, in exactly the same way, from moment to moment." — Anne Morrow Lindbergh, Gift from the Sea',
        '"All real living is meeting." — Martin Buber, I and Thou',
        '"In every couple there is a pursuer and a withdrawer. Neither is the problem. The cycle is the problem." — Sue Johnson',
        '"Love is not something we give or get; it is something that we nurture and grow." — bell hooks, All About Love',
        '"We are born in relationship, we are wounded in relationship, and we can be healed in relationship." — Harville Hendrix',
      ],
      archetypes: ['The Lover', 'The Anima/Animus', 'The Divine Couple'],
      ecoPsychology: 'In ecology, two organisms in close relationship develop what biologists call "co-regulation" — each organism\'s nervous system begins to sync with the other. Your attachment patterns are not just yours. They live in the space between you.',
      poetry: `Your partner is not your therapist.\nYour partner is not your parent.\nYour partner is the person\nwho chose to walk beside you\nwhile you learn\nthat love does not require\ndisappearing.`,
      microPractice: 'Once this week, tell your partner: "When I get [anxious/distant], it\'s not about you. It\'s an old alarm going off. What I actually need is [specific request]." This turns implicit attachment bids into explicit ones, which Gottman\'s research shows dramatically increases partner responsiveness.',
      therapyModels: ['Imago Therapy (Harville Hendrix)', 'PACT (Stan Tatkin)', 'Gottman Method', 'EFT (Sue Johnson)', 'Relational Psychoanalysis'],
      developmentalStage: `Harville Hendrix's Imago theory proposes that we unconsciously select partners who match our "Imago" — a composite image of our early caretakers. This is not pathology; it is the psyche's attempt to finish unfinished business. Your partner triggers your attachment wounds not because they are wrong for you, but because they are precisely right — they activate the exact places where healing is possible.

Stan Tatkin's PACT approach emphasizes that couples are a two-person psychological system. Your attachment style doesn't just affect you — it shapes the micro-moments of your partner's nervous system hundreds of times a day. When you withdraw, their cortisol spikes. When you pursue anxiously, their autonomic system goes into defensive mode. Understanding this creates compassion: neither of you is doing this on purpose. You are two nervous systems learning to dance.

Martin Buber distinguished between "I-It" relationships (where the other is an object, a means to an end) and "I-Thou" relationships (where two subjects meet in genuine presence). Secure attachment is the biological foundation of I-Thou relating. The work of earning security is the work of learning to say "Thou" — to see your partner not as a source of safety or a threat to autonomy, but as a whole, mysterious other whom you can never fully know, and who chose to be here anyway.`,
      simpleMetaphor: 'Your partner isn\'t pressing your buttons — they\'re just standing near a control panel that was installed before they got here.',
    },

    simple: {
      quotes: [
        '"The beginning of love is to let those we love be perfectly themselves." — Thomas Merton',
        '"We accept the love we think we deserve." — Stephen Chbosky, The Perks of Being a Wallflower',
        '"Vulnerability is the birthplace of connection." — Brené Brown',
        '"Love is a verb." — bell hooks',
        '"Be yourself; everyone else is already taken." — Oscar Wilde',
      ],
      archetypes: ['The Child', 'The Innocent'],
      ecoPsychology: 'Think of attachment like weather. You didn\'t choose the climate you grew up in, but you can learn to dress for it — and maybe even move somewhere sunnier.',
      poetry: `You learned to love\nthe only way you were taught.\nNow you get to learn again.`,
      microPractice: 'Next time you feel that "thing" in your chest — the pull to text 5 times or the urge to shut down — just pause. Count to 10. Then do the opposite of your instinct. If you want to chase, stay still. If you want to hide, take one step forward. Just one.',
      therapyModels: ['Common sense', 'Gottman basics', 'Brené Brown\'s vulnerability research'],
      developmentalStage: 'You\'re basically learning that the scary thing (being real, being seen, asking for what you need) is actually the safe thing. It just doesn\'t feel safe yet because your brain is running on old software. The update is happening. It just takes reps.',
      simpleMetaphor: 'Your attachment style is your love language\'s accent — it\'s not what you\'re saying, it\'s how you\'re saying it, and some people need subtitles.',
    },
  },

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃ DOMAIN 2: INSTRUMENT (Personality — IPIP/Big Five)   ┃
  // ┃ Sensitivity, Social Energy, Openness, Warmth         ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  instrument: {

    soulful: {
      quotes: [
        '"I am large, I contain multitudes." — Walt Whitman, Song of Myself',
        '"The greatest and most important problems of life are all fundamentally insoluble. They can never be solved but only outgrown." — Carl Jung',
        '"One does not become enlightened by imagining figures of light, but by making the darkness conscious." — Carl Jung',
        '"I want to be with those who know secret things or else alone." — Rainer Maria Rilke',
        '"The world breaks everyone, and afterward, many are strong at the broken places." — Ernest Hemingway',
        '"Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it." — Rumi',
        '"I have lived on the lip of insanity, wanting to know reasons, knocking on a door. It opens. I\'ve been knocking from the inside." — Rumi',
      ],
      archetypes: ['The Persona', 'The Shadow', 'The Trickster', 'The Shape-Shifter', 'The Self'],
      ecoPsychology: `Your personality is not a fixed object — it is an ecosystem. Like a forest with its canopy, understory, and root system, your Big Five traits are layers of a living system. Your extraversion is the canopy — what faces the sun, what the world sees first. Your neuroticism is the weather system — the emotional climate that moves through. Your openness is the biodiversity — how many species of thought and feeling can coexist. Your agreeableness is the symbiosis — the cooperative relationships between organisms. And your conscientiousness is the soil structure — the discipline that holds everything in place.

James Hillman, the great archetypal psychologist, insisted we stop treating personality as something to fix and start treating it as something to read — like a landscape. "The soul's code," he wrote, "is the pattern that calls us." Your Big Five profile is not a diagnosis. It is a map of the territory your soul chose to explore.`,
      poetry: `You were not assembled.\nYou grew.\nLike a river that finds its path\nnot by planning\nbut by following\nthe shape of the land.\n\nYour sensitivity is not a flaw —\nit is a depth.\nYour energy is not too much or too little —\nit is yours.\nYour openness is not naivety —\nit is courage.\n\nYou are the instrument\nthe world is playing.`,
      microPractice: 'Spend 2 minutes each evening identifying one moment where your personality trait served you well today — "My sensitivity helped me notice my partner was sad" or "My introversion gave me the quiet I needed to think clearly." This is not self-help fluff; it is trait reappraisal, which research shows increases well-being and self-acceptance (Nezlek & Kuppens, 2008).',
      therapyModels: ['Archetypal Psychology (James Hillman)', 'Jungian Analysis', 'Ecopsychology (Theodore Roszak)', 'Transpersonal Psychology'],
      developmentalStage: 'Jung proposed that the first half of life is about building the Persona — the social mask, the functional personality that gets you through the world. The second half is about discovering the Shadow — everything you pushed aside to build that mask. Your Big Five profile is a map of your Persona. The unlived traits — the ones you scored low on — are the Shadow material where your next growth lives.',
      simpleMetaphor: 'Your personality is the instrument you were given — you didn\'t choose it, but you can learn to play it like a virtuoso.',
    },

    therapeutic: {
      quotes: [
        '"Between stimulus and response there is a space. In that space is our freedom and our power to choose our response." — Viktor Frankl',
        '"The only way out is through." — Robert Frost',
        '"Pain is inevitable. Suffering is optional." — Haruki Murakami (often attributed to Buddhist teaching)',
        '"What we resist, persists." — Carl Jung',
        '"You can\'t stop the waves, but you can learn to surf." — Jon Kabat-Zinn',
        '"No one can make you feel inferior without your consent." — Eleanor Roosevelt',
      ],
      archetypes: ['The Healer', 'The Alchemist', 'The Wise Old Man/Woman'],
      ecoPsychology: 'In CBT terms, your personality traits are the lens through which you interpret the world. High neuroticism means the threat detection system is turned up to 11. High agreeableness means the harmony-maintenance system is always running.',
      poetry: `Your traits are not your prison.\nThey are the walls of a room\nyou can rearrange.`,
      microPractice: 'When a personality trait causes friction (e.g., your introversion clashes with your partner\'s social plans), use the ACT defusion technique: "I notice I\'m having the thought that I can\'t handle this." Noticing the thought is different from believing it.',
      therapyModels: ['CBT (Aaron Beck)', 'ACT (Steven Hayes)', 'DBT (Marsha Linehan)', 'IFS (Richard Schwartz)', 'Schema Therapy (Jeffrey Young)', 'Gestalt Therapy'],
      developmentalStage: `CBT (Aaron Beck) maps personality traits to core beliefs and automatic thoughts. High neuroticism correlates with negative cognitive schemas: "The world is dangerous," "I am not enough," "Something bad is about to happen." These are not character flaws — they are learned interpretations that were adaptive once and now need updating.

ACT (Steven Hayes) offers a radical reframe: the goal is not to change your personality but to change your relationship to it. Psychological flexibility means you can have high sensitivity AND still take bold action. You can feel the fear AND move toward what matters. The six ACT processes — defusion, acceptance, present moment awareness, self-as-context, values, committed action — are specifically designed for people whose personality traits create internal noise.

IFS (Richard Schwartz) sees personality traits not as monolithic but as systems of parts. Your "neuroticism" might actually be a vigilant protector part that learned to scan for danger early. Your "introversion" might be an exile that retreats when overwhelmed. When you access Self energy — the calm, curious, compassionate core that IFS posits is always there beneath the parts — you can relate to each trait with wisdom rather than judgment.

DBT (Marsha Linehan) adds the crucial concept of dialectics: you can be sensitive AND strong. You can be introverted AND deeply connected. Two seemingly opposite things can both be true. This resolves the personality shame that many people carry — the feeling that who they are is fundamentally wrong.

Schema Therapy identifies 18 early maladaptive schemas that correspond to personality patterns. High neuroticism with low agreeableness may reflect a Mistrust/Abuse schema. High agreeableness with high neuroticism may reflect a Subjugation schema. Naming the schema takes it from identity ("I am anxious") to pattern ("I have a pattern of vigilance that made sense once").`,
      simpleMetaphor: 'Your personality traits are like the EQ settings on a stereo — some frequencies are turned up loud and some are quiet, but you can adjust the mix.',
    },

    practical: {
      quotes: [
        '"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Will Durant (summarizing Aristotle)',
        '"Motivation is what gets you started. Habit is what keeps you going." — Jim Ryun',
        '"The best time to plant a tree was twenty years ago. The second best time is now." — Chinese proverb',
        '"Tiny changes, remarkable results." — James Clear',
        '"Behavior is a function of the person in their environment." — Kurt Lewin',
      ],
      archetypes: ['The Builder', 'The Craftsperson'],
      ecoPsychology: 'Nature doesn\'t fight its own tendencies — a river doesn\'t try to flow uphill. Work WITH your personality, not against it.',
      poetry: `Don't fight the current.\nLearn to steer.`,
      microPractice: `THE ONE STEP: Identify your most problematic trait-in-context (the trait that causes the most friction in your relationship right now). Design ONE environment change, not a willpower change.

High sensitivity? Create a 20-minute decompression buffer between work and partner time. Stack it: "After I park the car, I sit for 3 minutes and breathe before going inside."

Low social energy? Pre-schedule one "social yes" per week so your partner doesn't have to ask every time. Put it on the calendar Sunday night.

High openness clashing with a structured partner? Designate "adventure day" (Saturday) and "routine day" (Sunday) so both systems get fed.

Low agreeableness causing conflict? The 5:1 rule. For every critical thing you say, offer five appreciations. Not because you\'re wrong, but because the ratio determines whether your partner can hear you.

Remember: you're not changing who you are. You're designing systems that let who you are work better in partnership.`,
      therapyModels: ['Atomic Habits (James Clear)', 'Tiny Habits (BJ Fogg)', 'Behavioral Activation', 'Environmental Design'],
      developmentalStage: 'In the Stages of Change model, the most common mistake with personality work is jumping from Contemplation ("I know I\'m too sensitive") to Action ("I\'ll just stop being sensitive") without Preparation ("How do I design my environment to work with my sensitivity?"). Environment design is the bridge.',
      simpleMetaphor: 'Don\'t try to turn a cat into a dog. Just get the cat a really good scratching post.',
    },

    developmental: {
      quotes: [
        '"The subject of one stage becomes the object of the next." — Robert Kegan',
        '"What is now proved was once only imagined." — William Blake',
        '"The only journey is the one within." — Rainer Maria Rilke',
        '"In the middle of the journey of our life, I came to myself in a dark wood, where the direct way was lost." — Dante Alighieri',
        '"We shall not cease from exploration, and the end of all our exploring will be to arrive where we started and know the place for the first time." — T. S. Eliot',
      ],
      archetypes: ['The Hero', 'The Sage', 'The Self'],
      ecoPsychology: 'Just as ecosystems move through succession — from bare rock to lichen to forest — personality develops through stages of increasing complexity. You don\'t skip stages. You grow through them.',
      poetry: `You are not the same person\nwho started this sentence.\nGrowth is that quiet.\nGrowth is that constant.`,
      microPractice: 'Once a month, revisit your Big Five scores and ask: "Which trait is asking for more room right now?" Growth is not balanced — it comes in seasons. Honor the season you\'re in.',
      therapyModels: ['Integral Theory (Ken Wilber)', 'Constructive Developmental Theory (Robert Kegan)', 'Spiral Dynamics (Beck & Cowan)', 'Ego Development (Jane Loevinger)'],
      developmentalStage: `Ken Wilber's Integral Theory offers the most comprehensive framework for understanding personality development. Personality traits are not fixed — they develop through stages, and each stage brings new capacities.

At the Conformist stage (Loevinger's E4), personality is experienced as identity — "I AM introverted" — and any threat to the trait feels like a threat to the self. At the Self-Aware stage (E5), you begin to notice your personality patterns — "I tend to be introverted" — creating a sliver of space between you and the trait. At the Conscientious stage (E6), you can work with your traits intentionally — "I use my introversion strategically." At the Individualistic stage (E7), you hold personality lightly — "Introversion is one of many modes I have." At the Autonomous stage (E8), you can flex between poles — "I can be introverted or extraverted depending on what the moment asks."

Spiral Dynamics adds that different value systems relate to personality differently. At Blue (conformist), personality is destiny — you are what your type says you are. At Orange (achievement), personality is a tool to optimize. At Green (pluralistic), all personality types are equally valid. At Teal (integral), personality is a fluid expression of consciousness that changes with context.

Carol Gilligan's work on the ethics of care reveals a gendered dimension: women often develop agreeableness as a survival strategy in patriarchal systems, not as an authentic trait. The developmental move is from "I should be agreeable" (conventional) to "I choose when to be agreeable and when to be fierce" (post-conventional). This is not selfishness — it is moral development.`,
      simpleMetaphor: 'Think of personality development like learning to cook — first you follow the recipe exactly, then you start improvising, and eventually you don\'t need the recipe at all.',
    },

    relational: {
      quotes: [
        '"In the best of all possible worlds, the two people in a relationship would be different enough to be interesting and similar enough to be compatible." — Stan Tatkin',
        '"The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed." — Carl Jung',
        '"To say that I am made in the image of God is to say that love is the reason for my existence." — Thomas Merton',
        '"Love does not consist of gazing at each other, but in looking outward together in the same direction." — Antoine de Saint-Exupéry',
        '"We don\'t see things as they are, we see them as we are." — Anaïs Nin',
      ],
      archetypes: ['The Anima/Animus', 'The Syzygy', 'The Divine Couple'],
      ecoPsychology: 'In ecology, the most resilient ecosystems have the most biodiversity. The same is true of couples: your personality differences are not problems to solve but diversity that makes the system stronger.',
      poetry: `You are not too much.\nYou are not too little.\nYou are exactly the amount\nthat someone chose\nand keeps choosing.`,
      microPractice: 'This week, ask your partner: "What\'s one thing about my personality that you find endearing but never tell me about?" Listen without deflecting. This is Gottman\'s "Love Map" building in action.',
      therapyModels: ['PACT (Stan Tatkin)', 'Gottman Method', 'Imago Therapy (Harville Hendrix)', 'EFT (Sue Johnson)'],
      developmentalStage: `Your partner's personality is not an obstacle — it is the curriculum. Harville Hendrix's Imago theory proposes that we are unconsciously drawn to partners whose personality traits both complement and challenge our own. The introvert marries the extravert. The highly sensitive person partners with the thick-skinned one. This is not an accident — it is the psyche's attempt to recover the lost parts of itself.

Stan Tatkin's PACT framework emphasizes that personality differences create "threat" at the neurobiological level. Your partner's high openness may trigger your need for stability. Your introversion may trigger their fear of disconnection. The key insight: these triggers are not personal. They are two nervous systems with different settings trying to co-regulate.

In Buber's language, the I-Thou moment between different personalities is when you stop trying to make your partner more like you and instead become curious about who they actually are. "What is it like to be you right now?" is the most powerful question in any relationship. It transforms personality difference from a problem into a portal.

Gottman's research shows that 69% of relationship conflicts are perpetual — rooted in fundamental personality differences that will never fully resolve. The key is not resolution but dialogue. The couples who thrive are not the ones who agree — they are the ones who can talk about their differences with humor, affection, and respect. Forever.`,
      simpleMetaphor: 'You and your partner are different instruments in the same band — the magic is in the harmony, not in playing the same note.',
    },

    simple: {
      quotes: [
        '"Be yourself; everyone else is already taken." — Oscar Wilde',
        '"Knowing yourself is the beginning of all wisdom." — Aristotle',
        '"Your vibe attracts your tribe." — common saying',
        '"Don\'t try to be someone else\'s version of perfect." — Unknown',
        '"Normal is just a setting on the dryer." — Patton Oswalt',
      ],
      archetypes: ['The Innocent', 'The Jester'],
      ecoPsychology: 'You\'re a specific kind of animal. Some animals are built for speed, some for endurance, some for camouflage. Know what kind of animal you are and stop trying to be a different one.',
      poetry: `You\'re not broken.\nYou\'re just... specific.`,
      microPractice: 'Tell your partner one thing about yourself that you usually hide or downplay. Just one. See what happens. Spoiler: they probably already knew.',
      therapyModels: ['Basic self-awareness', 'Brené Brown', 'Common sense'],
      developmentalStage: 'Here\'s the thing: your personality is like your height. You can wear different shoes, but you\'re still going to be the same height. The goal isn\'t to change your personality — it\'s to stop apologizing for it and start using it. The sensitive person who learns to use their sensitivity? Unstoppable. The introvert who designs their life around their energy? Happy.',
      simpleMetaphor: 'Your personality is your operating system — iOS and Android both work great, they\'re just different, and forcing one to act like the other causes crashes.',
    },
  },

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃ DOMAIN 3: NAVIGATION (EQ — SSEIT)                   ┃
  // ┃ Perception, Self-Regulation, Other-Support, Use      ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  navigation: {

    soulful: {
      quotes: [
        '"The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart." — Helen Keller',
        '"Knowing your own darkness is the best method for dealing with the darknesses of other people." — Carl Jung',
        '"The soul always knows what to do to heal itself. The challenge is to silence the mind." — Caroline Myss',
        '"I do not want to be the leader. I refuse to be the leader. I want to live darkly and richly in my femaleness." — Anaïs Nin',
        '"Attention is the rarest and purest form of generosity." — Simone Weil',
        '"The curious paradox is that when I accept myself just as I am, then I can change." — Carl Rogers',
        '"In the depth of winter, I finally learned that within me there lay an invincible summer." — Albert Camus',
      ],
      archetypes: ['The Oracle', 'The Empath', 'The Wise Old Woman', 'The Shaman', 'The Self'],
      ecoPsychology: `Emotional intelligence is the weather-reading capacity of the soul. Indigenous peoples and traditional sailors developed an extraordinary ability to read the sky — not through instruments but through deep, embodied attention. A subtle change in wind, a shift in cloud color, the behavior of birds. Your EQ is this same capacity turned inward and relational. You read the atmospheric pressure of a room. You sense the approaching storm in a silence that lasts a beat too long.

Ecopsychology reminds us that this capacity is ancient — far older than language, older than thought. Before we had words for feelings, we had bodies that felt them. The gut that tightens before danger. The chest that opens in safety. The throat that closes when truth is being suppressed. Your emotional intelligence is not a cognitive skill you learned in a classroom. It is an inheritance from every ancestor who survived by reading the emotional weather of their world.`,
      poetry: `There is a knowing\nthat lives below the neck.\nIt does not argue.\nIt does not explain.\nIt simply knows —\nthe way water knows\nwhich way is down.\n\nTrust that knowing.\nIt has been keeping you alive\nlong before you had\nwords for what it sees.`,
      microPractice: 'Three times today, pause and name the emotion present in your body — not the story, just the sensation. "Tightness in chest. That might be anxiety." This builds what Daniel Siegel calls "mindsight" — the capacity to see your own inner world with clarity and compassion. Stack it onto transitions: arriving at work, sitting down for a meal, getting into bed.',
      therapyModels: ['Jungian Analysis', 'Archetypal Psychology (James Hillman)', 'Ecopsychology', 'Focusing (Eugene Gendlin)', 'Transpersonal Psychology'],
      developmentalStage: 'Jung described the process of individuation as learning to listen to the messages that arise from the unconscious — through dreams, through symptoms, through the body. Your emotional intelligence is the channel through which the unconscious speaks. High EQ perception means you receive these messages clearly. The developmental task is learning to decode them without being overwhelmed by their intensity.',
      simpleMetaphor: 'Your emotional intelligence is like having a built-in weather station for feelings — yours and everyone else\'s.',
    },

    therapeutic: {
      quotes: [
        '"Name it to tame it." — Daniel Siegel',
        '"Emotion, which is suffering, ceases to be suffering as soon as we form a clear and precise picture of it." — Baruch Spinoza',
        '"The goal of therapy is not to eliminate negative emotions but to develop a new relationship with them." — Steven Hayes',
        '"Feelings are much like waves. We can\'t stop them from coming, but we can choose which ones to surf." — Jonatan Mårtensson',
        '"What is not brought to consciousness comes to us as fate." — Carl Jung',
      ],
      archetypes: ['The Alchemist', 'The Healer', 'The Translator'],
      ecoPsychology: 'Emotions are data, not directives. Like a smoke alarm, they tell you something is happening. The skill is learning which alarms are real fires and which are burnt toast.',
      poetry: `Feel it.\nName it.\nLet it pass through.\nYou are not the storm.\nYou are the sky.`,
      microPractice: 'Use the "RAIN" technique (Tara Brach): Recognize the emotion, Allow it to be there, Investigate with kindness, Non-identify ("This is a feeling, not a fact"). Practice it once daily with a mild emotion to build the muscle before you need it for a big one.',
      therapyModels: ['DBT (Marsha Linehan)', 'ACT (Steven Hayes)', 'EFT (Sue Johnson)', 'Gestalt Therapy', 'AEDP (Diana Fosha)', 'Focusing (Eugene Gendlin)', 'Polyvagal Theory (Stephen Porges)', 'Somatic Experiencing (Peter Levine)'],
      developmentalStage: `DBT (Marsha Linehan) breaks emotional intelligence into four learnable skills: Mindfulness (observing emotions without reactivity), Distress Tolerance (surviving emotional storms without making them worse), Emotion Regulation (understanding and modulating emotional intensity), and Interpersonal Effectiveness (using emotions to navigate relationships skillfully). These are not personality traits — they are skills, and skills can be trained.

Gestalt therapy (Fritz Perls) emphasizes that emotional intelligence requires completing the "contact cycle" — allowing an emotion to arise, be fully experienced, and then naturally recede. Most people interrupt this cycle: they suppress the emotion before it peaks, or they hold onto it after it would naturally fade. Both patterns create emotional residue that accumulates over time.

AEDP (Diana Fosha) distinguishes between "red signal" affects (anxiety, shame, guilt — which signal you to stop) and "green signal" affects (interest, joy, tenderness — which signal you to go toward). Many people have their signals crossed: they feel anxiety when they should feel excitement, or shame when they should feel pride. Therapy involves reconnecting the right signals to the right experiences.

Polyvagal theory (Porges) reveals that emotional perception is not just cognitive — it is a full-body neurobiological event. Your vagus nerve constantly scans for cues of safety and danger (neuroception). High EQ perception means your neuroception is finely tuned. The challenge is distinguishing between accurate neuroception (a real threat) and faulty neuroception (a false alarm triggered by old wounds).

Peter Levine's Somatic Experiencing adds that emotions that were not fully processed become trapped in the body as "incomplete survival responses." That chronic tension in your shoulders, that recurring stomach upset — these may be emotions waiting to be felt and released. The body is the scorecard of your emotional history.`,
      simpleMetaphor: 'EQ is like having subtitles for real life — you can read what people are actually feeling beneath what they\'re actually saying.',
    },

    practical: {
      quotes: [
        '"Between stimulus and response there is a space. In that space is our freedom." — Viktor Frankl',
        '"Emotional intelligence is not the opposite of intelligence, it is not the triumph of heart over head — it is the unique intersection of both." — David Caruso',
        '"The ability to observe without evaluating is the highest form of intelligence." — Jiddu Krishnamurti',
        '"How we spend our days is, of course, how we spend our lives." — Annie Dillard',
        '"You can\'t manage what you can\'t measure." — Peter Drucker',
      ],
      archetypes: ['The Builder', 'The Navigator'],
      ecoPsychology: 'Emotional skills are like muscles — use them daily or they atrophy. The gym for your EQ is every conversation you have.',
      poetry: `Feel. Name. Choose.\nThree steps.\nRepeat daily.\nThat is the whole curriculum.`,
      microPractice: `THE ONE STEP: Build the "6-Second Pause." Between trigger and reaction, there is a 6-second window where your prefrontal cortex can override your amygdala. Practice this:

1. Something triggers you (partner says something, you read a text, a feeling arises)
2. Inhale for 3 seconds through your nose
3. Exhale for 3 seconds through your mouth
4. THEN respond

HABIT STACK: "After I feel a spike of emotion (cue), I take one breath before responding (behavior)." This is the single highest-ROI emotional intelligence skill. Six seconds. The research (Goleman, 2006; Brackett, 2019) shows this one habit changes everything downstream.

ADVANCED: At the end of each day, write down ONE emotional moment and what you did with it. Not to judge — to notice. The tracking itself builds the metacognitive muscle. Use your phone notes. Three sentences max.`,
      therapyModels: ['Emotional Intelligence Framework (Daniel Goleman)', 'Tiny Habits (BJ Fogg)', 'RULER (Marc Brackett)', 'Nonviolent Communication (Marshall Rosenberg)'],
      developmentalStage: 'In the Stages of Change: the 6-Second Pause is your gateway from Contemplation to Action. You don\'t need to understand your entire emotional system. You need one skill, practiced consistently, that creates space between feeling and reaction. Start there. Everything else follows.',
      simpleMetaphor: 'EQ is like learning to drive stick — jerky at first, but once you get it, you have way more control than someone in an automatic.',
    },

    developmental: {
      quotes: [
        '"The mind, once stretched by a new idea, never returns to its original dimensions." — Oliver Wendell Holmes Sr.',
        '"We do not see things as they are. We see them as we are." — The Talmud (often attributed to Anaïs Nin)',
        '"The test of a first-rate intelligence is the ability to hold two opposing ideas in mind at the same time and still retain the ability to function." — F. Scott Fitzgerald',
        '"Consciousness is not a thing but a process." — Ken Wilber',
        '"Each person\'s task in life is to become an increasingly better person." — Leo Tolstoy',
      ],
      archetypes: ['The Sage', 'The Philosopher', 'The Seer'],
      ecoPsychology: 'Emotional development follows the same pattern as ecological succession: simple systems become complex ones, but only when the conditions are right. You cannot rush a forest.',
      poetry: `First, you feel without knowing.\nThen, you know without feeling.\nThen — if you are brave —\nyou feel AND know\nat the same time.\nThat is wisdom.`,
      microPractice: 'Monthly practice: map your emotional range. Write down every distinct emotion you felt this month. Most people can name 5-7. The goal is 20+. The richer your emotional vocabulary, the more precisely you can navigate your inner world (Barrett, 2017).',
      therapyModels: ['Integral Theory (Ken Wilber)', 'Constructive Developmental Theory (Robert Kegan)', 'Ego Development (Jane Loevinger)', 'Emotional Development (Susanne Cook-Greuter)'],
      developmentalStage: `Emotional intelligence develops through clearly mapped stages. At Kegan's Order 2 (Imperial Mind), emotions are experienced as demands — "I am angry, therefore I must act on anger." At Order 3 (Socialized Mind), emotions are experienced through others — "I feel what you feel" (empathy without differentiation). At Order 4 (Self-Authoring Mind), emotions become information — "I notice I am angry, and I choose what to do with that." At Order 5 (Self-Transforming Mind), emotions become fluid, paradoxical, and generative — "I can hold grief and joy simultaneously."

Susanne Cook-Greuter's research on ego development reveals that the highest stages of development are characterized not by emotional control but by emotional fluidity — the ability to move through the full range of human feeling without clinging to any particular state. This looks like equanimity, not numbness.

Fowler's stages of faith, surprisingly, track emotional development closely. At the Mythic-Literal stage, emotions are black and white — good feelings mean good things, bad feelings mean bad things. At the Individuative-Reflective stage, you can hold emotional complexity. At the Conjunctive stage, you can embrace paradox: a loss can feel both devastating and liberating. A relationship can feel both safe and terrifying.

The key developmental insight: emotional intelligence is not about having "good" emotions. It is about increasing your capacity to be present with ALL emotions — yours and others' — without collapsing, controlling, or checking out. Every stage adds bandwidth. You don't lose the previous stage's capacity — you transcend and include it.`,
      simpleMetaphor: 'EQ development is like going from a box of 8 crayons to 64 — same drawing, but way more nuance.',
    },

    relational: {
      quotes: [
        '"Empathy is about finding echoes of another person in yourself." — Mohsin Hamid',
        '"The greatest gift you can give another person is your own emotional presence." — Sue Johnson',
        '"In true dialogue, both sides are willing to change." — Thich Nhat Hanh',
        '"Listening is a magnetic and strange thing, a creative force." — Brenda Ueland',
        '"To love someone is to learn the song in their heart and sing it to them when they have forgotten." — Arne Garborg',
      ],
      archetypes: ['The Empath', 'The Bridge', 'The Anima/Animus'],
      ecoPsychology: 'Two trees growing close together develop intertwined root systems. Your emotional intelligence and your partner\'s form one shared underground network. When one tree is stressed, the other feels it through the roots.',
      poetry: `To feel your feeling\nwithout losing mine —\nthat is the art.\nTo hear your silence\nand not fill it with my noise —\nthat is love.`,
      microPractice: 'This week, practice "emotional mirroring" once: when your partner shares a feeling, reflect it back before responding. "It sounds like you\'re feeling frustrated and unheard." Wait for confirmation. Then respond. This takes 15 seconds and research shows it increases partner satisfaction by 40% (Gottman Institute, 2015).',
      therapyModels: ['EFT (Sue Johnson)', 'Gottman Method', 'PACT (Stan Tatkin)', 'Imago Therapy (Harville Hendrix)', 'Nonviolent Communication (Marshall Rosenberg)'],
      developmentalStage: `Your emotional intelligence does not live in a vacuum — it lives in the space between you and your partner. This is what Daniel Stern called "intersubjectivity" and what Ed Tronick calls the "dyadic expansion of consciousness." Two people who attune to each other's emotional states create a shared emotional field that is larger than either individual.

Sue Johnson's EFT research shows that the most critical moment in a couple's therapy is when one partner can finally hear the other's emotion beneath the behavior. "When you criticize me, you're actually scared I'll leave" — that moment of emotional translation changes everything. Your EQ is the translator.

Harville Hendrix's Imago dialogue process — Mirror, Validate, Empathize — is a structured practice for building relational EQ. It slows down the conversation to the speed of emotion, forcing both partners to actually hear each other rather than just preparing their rebuttals.

The relational insight: high EQ perception without high EQ regulation can be destabilizing for your partner. If you sense every shift in their mood and react to it, they feel surveilled rather than seen. The gift is sensing AND holding — feeling the weather without trying to change it. Your partner needs to feel that you can handle their full emotional range without crumbling or controlling. That is the relational dimension of emotional intelligence.`,
      simpleMetaphor: 'Emotional intelligence in a relationship is like being a good DJ — you read the room, match the energy, and know when to turn it up or bring it down.',
    },

    simple: {
      quotes: [
        '"People will forget what you said, people will forget what you did, but people will never forget how you made them feel." — Maya Angelou',
        '"The most important thing in communication is hearing what isn\'t said." — Peter Drucker',
        '"Be kind, for everyone you meet is fighting a hard battle." — attributed to Ian Maclaren',
        '"Feelings are not facts, but they are real." — common therapeutic saying',
        '"Read the room." — everyone\'s mom',
      ],
      archetypes: ['The Friend', 'The Listener'],
      ecoPsychology: 'EQ is basically having emotional taste buds. Some people can only taste sweet and salty. High-EQ people can taste umami.',
      poetry: `Feelings aren\'t problems.\nThey\'re information.\nThe better you read them,\nthe better you live.`,
      microPractice: 'When someone asks "how are you?" today, give a real answer. Not "fine." Try "I\'m a little anxious about a work thing but mostly good." Watch what happens. People lean in when you\'re real.',
      therapyModels: ['Emotional literacy basics', 'Active listening', 'Common sense empathy'],
      developmentalStage: 'Here\'s the deal: most people are running around with the emotional awareness of a teenager. Not because they\'re dumb, but because no one taught them this stuff. Learning to name your feelings, read other people\'s, and not freak out about either? That\'s basically a superpower. And it\'s learnable. You\'re already further along than you think just by paying attention to this.',
      simpleMetaphor: 'EQ is like having emotional Wi-Fi — low EQ means you\'re always in airplane mode; high EQ means you\'re connected to everything around you.',
    },
  },

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃ DOMAIN 4: STANCE (Differentiation — DSI-R)           ┃
  // ┃ Differentiation, Reactivity, I-Position, Fusion      ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  stance: {

    soulful: {
      quotes: [
        '"The privilege of a lifetime is to become who you truly are." — Carl Jung',
        '"I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration." — Frank Herbert, Dune',
        '"Until you make the unconscious conscious, it will direct your life and you will call it fate." — Carl Jung',
        '"If you bring forth what is within you, what you bring forth will save you. If you do not bring forth what is within you, what you do not bring forth will destroy you." — Gospel of Thomas',
        '"To be nobody but yourself in a world which is doing its best, night and day, to make you everybody else means to fight the hardest battle which any human being can fight." — E. E. Cummings',
        '"The most common form of despair is not being who you are." — Soren Kierkegaard',
        '"Tell me, what is it you plan to do with your one wild and precious life?" — Mary Oliver, The Summer Day',
      ],
      archetypes: ['The Hero', 'The Individuated Self', 'The Warrior', 'The Sovereign', 'The Wise Old Man/Woman'],
      ecoPsychology: `Differentiation is the oak tree's capacity to stand tall in a storm without breaking, while remaining rooted in the same soil as every other tree in the forest. It is not separation — it is the paradox of being fully yourself AND fully connected. In nature, the most resilient organisms are not the ones that isolate themselves from their environment but the ones that maintain their integrity while remaining responsive to their surroundings. A cell with a rigid wall is dead. A cell with no wall is dissolved. A healthy cell has a semi-permeable membrane — it lets the right things in and keeps the wrong things out.

Your differentiation is your psychic membrane. Murray Bowen, who originated this concept, observed that families (like ecosystems) operate as emotional units — anxiety flows through them like weather. The differentiated person can be part of the family system without being consumed by its anxiety. They can feel the wind without being blown over. They can love deeply without losing themselves in the loving.`,
      poetry: `There is a place in you\nthat no storm has touched.\nNot because it is hidden,\nbut because it is bedrock.\n\nFrom this place, you can love\nwithout losing your shape.\nFrom this place, you can bend\nwithout breaking.\n\nThe whole world wants you\nto dissolve.\nThe whole world needs you\nto stand.`,
      microPractice: 'Once today, hold a position that is different from your partner\'s without defending, explaining, or capitulating. Just say: "I see it differently, and I still love you." That is the I-Position made real. It is a single sentence that rewires decades of fusion conditioning.',
      therapyModels: ['Bowen Family Systems', 'Jungian Individuation', 'Existential Therapy', 'Gestalt Therapy', 'Transpersonal Psychology'],
      developmentalStage: 'Jung called this individuation — the process of becoming who you are, distinct from the collective, from the family, from the expectations that shaped you. It is not selfishness. It is the prerequisite for genuine love. You cannot give yourself to another until you have a self to give. This is the heroic journey in its purest form: the departure from the familiar, the encounter with the unknown within, and the return with something to offer.',
      simpleMetaphor: 'Differentiation is like being a lighthouse — you can shine your light without controlling the ships, and you don\'t go dark just because the sea gets rough.',
    },

    therapeutic: {
      quotes: [
        '"The goal of differentiation is not to be separate but to be able to be yourself in the presence of important others." — Murray Bowen',
        '"An emotion is your body\'s reaction to your mind\'s thoughts." — Eckhart Tolle',
        '"The ability to hold contradictory ideas without needing to resolve them is a sign of emotional maturity." — F. Scott Fitzgerald (paraphrased)',
        '"People who are differentiated have opinions and convictions, can take stands on issues, and are comfortable in their own skin." — Roberta Gilbert',
        '"Reactivity is the opposite of responsiveness." — Daniel Siegel',
      ],
      archetypes: ['The Healer', 'The Therapist', 'The Witness'],
      ecoPsychology: 'Differentiation is the nervous system\'s capacity to maintain its own rhythm while being influenced by — but not consumed by — the rhythms around it.',
      poetry: `You are not your reactivity.\nYou are the one who notices\nthe reactivity arising.`,
      microPractice: 'Track your reactivity this week. When you feel a surge of emotion in response to your partner, rate it 1-10. Over time, notice: does the number go down when you name it? (It does. Naming engages the prefrontal cortex and dampens amygdala firing.)',
      therapyModels: ['Bowen Family Systems', 'DBT (Marsha Linehan)', 'ACT (Steven Hayes)', 'IFS (Richard Schwartz)', 'Polyvagal Theory (Stephen Porges)', 'Gestalt Therapy', 'CBT (Aaron Beck)'],
      developmentalStage: `Murray Bowen's Differentiation of Self Scale (0-100) is one of the most powerful clinical frameworks in relationship therapy. At the low end (0-25), people are "fused" — their emotional functioning is dominated by the relationship system. They cannot distinguish their own feelings from their partner's. They react automatically to emotional pressure. At the mid-range (25-60), people can think independently when calm but become reactive under stress. At the higher end (60-75+), people can maintain their own position while remaining emotionally connected — the holy grail of relational maturity.

IFS (Richard Schwartz) offers a complementary map. Low differentiation often involves "blending" — a protector part takes over the system, and you lose access to Self (the calm, curious, compassionate core). High differentiation is the capacity to stay in Self even when parts are activated. The Self doesn't need to banish the reactive parts — it witnesses them, holds them, and chooses from a place of clarity.

DBT provides specific skills for building differentiation: "Opposite Action" (when your emotion urges you to react, do the opposite), "STOP" (Stop, Take a step back, Observe, Proceed mindfully), and "TIPP" (Temperature, Intense exercise, Paced breathing, Progressive relaxation) for managing the physiological intensity of fusion and reactivity.

Polyvagal theory explains WHY differentiation is so hard: when your nervous system detects a threat to the relationship (real or perceived), it shifts from ventral vagal (social engagement) to sympathetic (fight-flight) or dorsal vagal (freeze-collapse). Differentiation requires staying in ventral vagal — the "window of tolerance" — while holding a position that might create relational tension. This is a physiological achievement, not just a cognitive one.

ACT adds the concept of "values-based action under emotional duress." Differentiation means: "I notice I am feeling intense pressure to agree. I also notice that my value of authenticity asks me to express my truth. I choose my values." This is psychological flexibility in its most relational form.`,
      simpleMetaphor: 'Differentiation is the emotional equivalent of having a strong immune system — you can be close to others without catching their emotional colds.',
    },

    practical: {
      quotes: [
        '"The only person you are destined to become is the person you decide to be." — Ralph Waldo Emerson',
        '"You can\'t change what you can\'t face, and you can\'t face what you don\'t know." — James Baldwin (paraphrased)',
        '"An ounce of practice is worth more than tons of preaching." — Mahatma Gandhi',
        '"Do one thing every day that scares you." — Eleanor Roosevelt',
        '"Start where you are. Use what you have. Do what you can." — Arthur Ashe',
      ],
      archetypes: ['The Warrior', 'The Pioneer'],
      ecoPsychology: 'Differentiation is a muscle. It grows through progressive overload — small acts of standing your ground, repeated over time.',
      poetry: `This is not theory.\nThis is Tuesday.\nWhat will you say\nwhen they push\nand you want to fold?`,
      microPractice: `THE ONE STEP: The "I-Position Statement" practice. Once daily, express a preference, opinion, or need using this format:

"I feel [emotion] about [topic]. What I need is [specific request]. I understand you might see it differently."

Start with LOW-STAKES topics. Not the big issues. Start with dinner preferences, weekend plans, what to watch. Build the muscle where the weight is light.

HABIT STACK: "After my partner asks me what I want (cue), I give my actual preference before asking theirs (behavior)." If you habitually say "I don't care, whatever you want," this one change is revolutionary.

WEEKLY UPGRADE: Each week, move the I-Position Statement to slightly higher stakes. Week 1: food preferences. Week 2: social plans. Week 3: financial opinions. Week 4: emotional needs. By month's end, you've built a differentiation practice that goes from easy to meaningful.

THE METRIC: Track how many times per day you say "I don't care" or "whatever you want" when you actually DO have a preference. Goal: cut it in half by next month.`,
      therapyModels: ['Bowen Family Systems', 'Atomic Habits (James Clear)', 'Assertiveness Training', 'Progressive Exposure'],
      developmentalStage: 'In Prochaska\'s Stages of Change: if you\'re reading this, you\'re in Contemplation. The I-Position Statement moves you to Preparation. Doing it once is Action. The progressive stakes approach prevents the common failure of trying to differentiate in a crisis — that\'s like trying to learn to swim during a shipwreck.',
      simpleMetaphor: 'Differentiation is like learning to say "no" to dessert — it\'s not about willpower, it\'s about knowing what you actually want and choosing it.',
    },

    developmental: {
      quotes: [
        '"The self is not something ready-made, but something in continuous formation through choice of action." — John Dewey',
        '"Growth is the only evidence of life." — John Henry Newman',
        '"The creation of something new is not accomplished by the intellect but by the play instinct." — Carl Jung',
        '"What a liberation to realize that the voice in my head is not who I am." — Eckhart Tolle',
        '"Man\'s main task in life is to give birth to himself." — Erich Fromm',
      ],
      archetypes: ['The Hero on the Journey', 'The Sage', 'The Individuated Self'],
      ecoPsychology: 'In nature, differentiation is the process by which a single fertilized cell becomes a complex organism. Each cell maintains its unique function while remaining part of the whole. Becoming yourself doesn\'t mean leaving the ecosystem — it means finding your niche within it.',
      poetry: `The caterpillar does not become a butterfly\nby trying harder to be a caterpillar.\nIt becomes a butterfly\nby dissolving completely\nand trusting the instructions\nwritten in its cells.`,
      microPractice: 'Quarterly review: write a "State of My Self" letter. Where am I fusing? Where am I cutting off? Where am I standing in my truth? How has this changed since last quarter?',
      therapyModels: ['Integral Theory (Ken Wilber)', 'Constructive Developmental Theory (Robert Kegan)', 'Bowen Family Systems', 'Spiral Dynamics (Beck & Cowan)', 'Ego Development (Jane Loevinger)'],
      developmentalStage: `Differentiation maps precisely onto Kegan's developmental orders. At Order 3 (Socialized Mind), you ARE your relationships. Your sense of self is constructed from the expectations, values, and emotions of important others. You cannot separate "what I think" from "what they need me to think." Disagreement feels like annihilation.

The transition from Order 3 to Order 4 (Self-Authoring Mind) IS the process of differentiation. You develop an internal system — your own values, your own assessments, your own compass — that can hold its ground even when the relational system pushes back. This transition is often accompanied by guilt ("I'm being selfish"), anxiety ("They'll leave"), and grief ("The old way of connecting is dying").

At Order 5 (Self-Transforming Mind), differentiation becomes fluid rather than rigid. You can hold your position AND remain genuinely open to being changed by the other. This is Bowen's "functional differentiation" at its highest — not a fortress wall but a living membrane. You are permeable without being dissolvable.

Spiral Dynamics illuminates the cultural dimension: Blue (conformist) cultures reward fusion and punish differentiation ("Don't rock the boat"). Orange (achievement) cultures reward pseudo-differentiation — independence that is actually reactive distancing. Green (pluralistic) cultures can paradoxically pressure toward fusion in the name of harmony. True differentiation (Teal) holds all of these perspectives without being captured by any of them.

Erikson's Intimacy vs. Isolation (Stage 6) requires differentiation as a prerequisite. You cannot achieve genuine intimacy from a fused position — what looks like intimacy is actually enmeshment. The developmental paradox: you must separate in order to truly join.`,
      simpleMetaphor: 'Differentiation is like learning to swim — at first you cling to the pool wall (fusion), then you thrash in the middle (reactivity), then one day you realize you can float on your own AND still enjoy the water with someone else.',
    },

    relational: {
      quotes: [
        '"Intimacy is the capacity to be oneself in the face of another." — Harriet Lerner',
        '"In the best relationships, both people are always becoming." — Esther Perel',
        '"Love is not two people gazing at each other, but two people looking together in the same direction." — Antoine de Saint-Exupéry',
        '"A great relationship is about two things: first, find out the similarities; second, respect the differences." — Unknown',
        '"The question is not whether you will have conflict; the question is whether you will have dialogue." — Harville Hendrix',
      ],
      archetypes: ['The Partner', 'The Mirror', 'The Beloved'],
      ecoPsychology: 'Two trees with intertwined roots can support each other in a storm. But if one tree is completely dependent on the other for structural integrity, both fall when the wind comes. The strongest forests are made of individually rooted trees that share resources underground.',
      poetry: `I want you to stand.\nNot for me.\nNot against me.\nBut in your own truth,\nso that when we meet,\nit is two whole people\nmeeting —\nnot two halves\npretending to be one.`,
      microPractice: 'Have a "differentiation conversation" this week: share one area where you and your partner genuinely disagree, and practice listening without defending, resolving, or merging. The goal is not agreement — it is presence with difference. End with: "Thank you for being different from me."',
      therapyModels: ['Imago Therapy (Harville Hendrix)', 'PACT (Stan Tatkin)', 'Bowen Family Systems', 'EFT (Sue Johnson)', 'Relational-Cultural Theory'],
      developmentalStage: `Your differentiation does not exist in isolation — it exists in dynamic tension with your partner's differentiation. Bowen observed that couples tend to function at the same level of differentiation. If one partner increases their differentiation, the system will initially resist — the partner may escalate, pursue harder, or withdraw further. This is not failure. It is the system reorganizing.

Stan Tatkin's PACT emphasizes that couples need to be "secure-functioning" — which requires differentiation. Secure functioning means: "I can advocate for myself AND protect you at the same time. I can say 'no' without it meaning 'I don't love you.' I can tolerate your distress without rushing to fix it."

The relational impact of low differentiation is profound. When you fuse, your partner loses their partner — they gain a mirror that reflects them but offers no new perspective. When you reactively cut off, your partner loses access to you entirely. Neither extreme creates intimacy.

Martin Buber's I-Thou framework illuminates the relational essence of differentiation. I-Thou relating requires two "I"s — two subjects who can meet in genuine encounter. Without differentiation, you collapse into I-It (where one person is an object serving the other's needs) or We-fusion (where neither person exists as a distinct self). The I-Thou moment is when two differentiated people meet in the space between them — not merged, not separate, but present.`,
      simpleMetaphor: 'Low differentiation is like two people trying to share one parachute — it doesn\'t work, and both end up in trouble. Get your own chute, then enjoy the view together.',
    },

    simple: {
      quotes: [
        '"Be who you are and say what you feel, because those who mind don\'t matter, and those who matter don\'t mind." — Bernard M. Baruch',
        '"No one can make you feel inferior without your consent." — Eleanor Roosevelt',
        '"The only way to do great work is to love what you do." — Steve Jobs',
        '"To thine own self be true." — Shakespeare, Hamlet',
        '"You can\'t pour from an empty cup." — common saying',
      ],
      archetypes: ['The Individual', 'The Rebel (healthy version)'],
      ecoPsychology: 'Differentiation is basically: "I love you AND I\'m my own person." That\'s it. Both at the same time. It sounds simple but it\'s the hardest thing in relationships.',
      poetry: `Love doesn\'t mean\nbecoming the same person.\nIt means choosing each other\nwhile staying yourselves.`,
      microPractice: 'Next time your partner asks "what do you want to do?" and you genuinely have an opinion — say it. Don\'t say "I don\'t mind" when you do mind. Start small. Pizza or sushi. This is how differentiation begins: with honest preferences about dinner.',
      therapyModels: ['Common sense', 'Boundaries basics', 'Healthy relationship 101'],
      developmentalStage: 'Think of it this way: when you were a kid, you needed your parents to tell you who you were. As a teenager, you pushed back against everyone to figure it out. As an adult, the goal is to know who you are AND stay connected to the people you love. That\'s differentiation. Most of us are still somewhere between the teenager stage and the adult stage. That\'s normal. The fact that you\'re thinking about it means you\'re growing.',
      simpleMetaphor: 'Differentiation is like having your own Netflix profile in a shared account — you can still watch together, but your recommendations are yours.',
    },
  },

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃ DOMAIN 5: CONFLICT (DUTCH)                           ┃
  // ┃ Primary Style, Secondary, Yielding, Avoiding,        ┃
  // ┃ Forcing, Problem-Solving                             ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  conflict: {

    soulful: {
      quotes: [
        '"Out beyond ideas of wrongdoing and rightdoing, there is a field. I\'ll meet you there." — Rumi',
        '"The wound is the place where the Light enters you." — Rumi',
        '"Where there is great love, there are always wishes." — Willa Cather',
        '"In the middle of difficulty lies opportunity." — Albert Einstein',
        '"We don\'t see things as they are, we see them as we are." — Anaïs Nin',
        '"Do not be dismayed by the brokenness of the world. All things break. And all things can be mended." — L.R. Knost',
        '"The greatest weapon against stress is our ability to choose one thought over another." — William James',
      ],
      archetypes: ['The Warrior', 'The Peacemaker', 'The Trickster', 'The Shadow', 'The Alchemist'],
      ecoPsychology: `In nature, conflict is not pathology — it is ecology. Predator and prey, fire and forest, river and stone — these opposing forces are what shape the living world. Without the river's persistent pressure, the stone would never become the canyon. Without the fire, the forest would never regenerate. Your conflict style is your ecological strategy for navigating the inevitable friction of two lives pressing against each other.

James Hillman wrote that the soul descends — it goes down into the dark, into the underworld, into the places we would rather avoid. Conflict is one of those descents. When you fight with your partner, you are not failing at love. You are entering the underworld together. The question is not whether you will go there — all couples do — but whether you will return with gold.

The Trickster archetype lives in conflict. Trickster energy disrupts the rigid, shakes the comfortable, breaks open what has calcified. Sometimes the fight that looks destructive is actually Trickster energy breaking a pattern that needed to die. The couples who never fight are often the couples whose growth has stopped — not because they are harmonious, but because they have stopped descending.`,
      poetry: `Every fight is a door.\nMost people try to close it.\nBut the bravest ones\nwalk through —\nand find on the other side\nnot destruction\nbut the room they were afraid to enter:\nthe one where they are\nfinally honest.`,
      microPractice: 'Before your next conflict, set an intention: "I am here to understand, not to win." Write it on a sticky note. Put it on your mirror. The soul work of conflict is not resolution — it is revelation. What is this fight trying to show you about yourself?',
      therapyModels: ['Archetypal Psychology (James Hillman)', 'Jungian Shadow Work', 'Mythopoetic Tradition', 'Ecopsychology'],
      developmentalStage: 'Jung saw conflict — inner and outer — as the engine of individuation. The Shadow is everything you cannot accept about yourself, projected onto the other. When you fight your partner, you are often fighting your own unlived life. The developmental move is from projection ("You are the problem") to ownership ("The problem I see in you is the one I cannot face in myself"). This is not easy. It is the hero\'s descent into the underworld.',
      simpleMetaphor: 'Conflict is like a thunderstorm — it feels dangerous but it clears the air and makes things grow.',
    },

    therapeutic: {
      quotes: [
        '"Every couple has irreconcilable differences. It is how they handle those differences that matters." — John Gottman',
        '"The problem is not the problem. The problem is the way you fight about the problem." — Terry Real',
        '"Behind every criticism is an unmet need." — Marshall Rosenberg',
        '"In the absence of safety, the need for self-protection dominates." — Sue Johnson',
        '"The opposite of a correct statement is a false statement. But the opposite of a profound truth may well be another profound truth." — Niels Bohr',
      ],
      archetypes: ['The Healer', 'The Mediator', 'The Witness'],
      ecoPsychology: 'Conflict is not the enemy of connection. Disconnection is the enemy of connection. Conflict handled well actually deepens attachment bonds.',
      poetry: `It is not the storm that sinks the ship.\nIt is the failure to navigate.`,
      microPractice: 'Use the Gottman "Softened Startup" formula: "I feel [emotion] about [situation]. I need [specific positive request]." Not: "You always..." Not: "You never..." This format reduces escalation by 65% (Gottman Institute research).',
      therapyModels: ['Gottman Method', 'EFT (Sue Johnson)', 'DBT (Marsha Linehan)', 'ACT (Steven Hayes)', 'IFS (Richard Schwartz)', 'Nonviolent Communication (Marshall Rosenberg)', 'Polyvagal Theory (Stephen Porges)', 'PACT (Stan Tatkin)'],
      developmentalStage: `Gottman's "Four Horsemen" framework identifies the four conflict behaviors that predict relationship failure with 93% accuracy: Criticism (attacking character), Contempt (superiority and disgust), Defensiveness (counter-attacking), and Stonewalling (shutting down). Each Horseman has an antidote: Criticism → Gentle Startup, Contempt → Build Culture of Appreciation, Defensiveness → Take Responsibility, Stonewalling → Self-Soothe.

The DUTCH conflict styles (Yielding, Avoiding, Forcing, Problem-Solving, Compromising) map onto deeper psychological strategies:

YIELDING: Often rooted in anxious attachment or a Subjugation schema. The yielder's inner experience: "If I hold my ground, I'll lose the relationship." IFS lens: a protector part collapses to keep the exile (fear of abandonment) safe. Therapeutically, the work is not to stop yielding but to build access to the vulnerable feeling underneath — and express it before the collapse.

AVOIDING: Maps to deactivation strategies in attachment theory. Polyvagal lens: dorsal vagal shutdown under conflict stress. The avoider is not "not caring" — they are physiologically overwhelmed. Stan Tatkin calls them "islands." The therapeutic move: teach the avoider to say "I need a break" (healthy self-regulation) instead of silently disappearing (dysregulated withdrawal). The 20-minute rule: take a break, self-soothe, return.

FORCING: Often maps to counter-dependent attachment or a Dominance/Entitlement schema. IFS lens: a firefighter part mobilizes aggression to protect an exile that feels powerless. The forcer's inner experience is often the OPPOSITE of what they display: underneath the dominance is helplessness. EFT accesses this by slowing down and asking: "What is the softer feeling underneath the anger?"

PROBLEM-SOLVING: Often seen in securely attached individuals or those with high differentiation. But it can also be a defense — intellectualizing emotion to avoid feeling it. The key question: "Are you problem-solving because the problem needs solving, or because the feeling is too much to sit with?"

DBT's Interpersonal Effectiveness module adds specific scripts: DEAR MAN (Describe, Express, Assert, Reinforce, be Mindful, Appear confident, Negotiate) and GIVE (be Gentle, act Interested, Validate, use Easy manner). These are conflict protocols that any couple can learn.`,
      simpleMetaphor: 'Your conflict style is like your driving style — some people slam the brakes, some floor the gas, some swerve to avoid. All of them are trying to survive the same intersection.',
    },

    practical: {
      quotes: [
        '"The single biggest problem in communication is the illusion that it has taken place." — George Bernard Shaw',
        '"Speak when you are angry — and you\'ll make the best speech you\'ll ever regret." — Laurence J. Peter',
        '"Don\'t raise your voice. Improve your argument." — Desmond Tutu',
        '"Win-win is not a technique. It\'s a philosophy." — Stephen Covey',
        '"Clear is kind. Unclear is unkind." — Brené Brown',
      ],
      archetypes: ['The Strategist', 'The Builder'],
      ecoPsychology: 'Conflict is like fire — destructive when uncontrolled, essential when channeled. Learn to build a fireplace, not start a wildfire.',
      poetry: `The rule is simple:\nfight the problem,\nnot each other.`,
      microPractice: `THE ONE STEP: Establish the "Repair Attempt" habit. Gottman's research shows that the #1 predictor of relationship success is not the absence of conflict but the presence of repair attempts — small bids to de-escalate during a fight.

THIS WEEK: Choose a repair phrase that works for you. Options:
- "Can we start over? I didn't mean to come at it that way."
- "I'm getting flooded. Can we take 20 minutes and come back?"
- "I think we're on the same team here."
- "I love you even though this is hard right now."

PRACTICE: Use it once this week during a minor disagreement. Not the big one. A small one. Build the muscle.

THE 5:1 RATIO: Outside of conflict, maintain five positive interactions for every one negative. This is not about being fake — it is about building a relational bank account so that when conflict happens, you have reserves.

THE 20-MINUTE RULE: When either of you is physiologically flooded (heart rate over 100 BPM), take a 20-minute break. Not to stew — to self-soothe. Walk. Breathe. Return. The conversation will be 10x more productive after the nervous system resets.`,
      therapyModels: ['Gottman Method', 'Nonviolent Communication', 'Atomic Habits (James Clear)', 'Conflict Resolution Protocol'],
      developmentalStage: 'In the Stages of Change: most people in conflict are in Precontemplation about their OWN contribution ("They\'re the problem"). The first practical move is getting to Contemplation: "What is MY part in this cycle?" Once you can see your own 50%, you can change it. You cannot change your partner\'s 50%. But changing yours changes the whole dance.',
      simpleMetaphor: 'Fighting well is a skill, like parallel parking — awkward at first, but once you learn the technique, it\'s just a series of small, calm adjustments.',
    },

    developmental: {
      quotes: [
        '"Peace is not the absence of conflict, but the ability to cope with it." — Mahatma Gandhi',
        '"The measure of intelligence is the ability to change." — Albert Einstein',
        '"Growth and comfort do not coexist." — Ginni Rometty',
        '"The only way to make sense out of change is to plunge into it, move with it, and join the dance." — Alan Watts',
        '"Conflict is the beginning of consciousness." — M. Esther Harding',
      ],
      archetypes: ['The Sage', 'The Alchemist', 'The Transformer'],
      ecoPsychology: 'In ecological terms, conflict is a "disturbance event" — like a forest fire. It destroys the existing order but creates space for new growth. Ecosystems that have never experienced disturbance are brittle. Ecosystems that have experienced and adapted to disturbance are resilient.',
      poetry: `The fire does not ask\nif you are ready.\nIt comes.\nAnd in the coming,\nit teaches you\nwhat you are made of.`,
      microPractice: 'After your next conflict, journal: "What developmental stage was I operating from during that fight?" Be honest. Were you the imperial child demanding your way? The socialized pleaser avoiding the tension? The self-authoring adult expressing your truth? No judgment — just tracking.',
      therapyModels: ['Integral Theory (Ken Wilber)', 'Constructive Developmental Theory (Robert Kegan)', 'Spiral Dynamics', 'Ego Development (Jane Loevinger)', 'Ethics of Care (Carol Gilligan)'],
      developmentalStage: `Conflict style develops through stages, and each stage represents a fundamentally different relationship with disagreement:

At Kegan's Order 2 (Imperial Mind): conflict is win/lose. "If you get what you want, I don't get what I want." The other person is an obstacle. This is the toddler's tantrum, the teenager's power struggle, and — more often than we'd like to admit — the adult's default under stress.

At Order 3 (Socialized Mind): conflict is terrifying because it threatens the relationship, and the relationship IS the self. Conflict is avoided, suppressed, or yielded to. The cost: resentment builds underground, like tectonic pressure, until it erupts.

At Order 4 (Self-Authoring Mind): conflict becomes manageable because you have a self that can withstand disagreement. You can advocate for your position while respecting your partner's. Conflict is reframed as negotiation between two valid perspectives.

At Order 5 (Self-Transforming Mind): conflict becomes generative. You can hold your perspective AND genuinely be transformed by your partner's. The ego's need to "win" dissolves. What emerges is a third position that neither person could have reached alone.

Carol Gilligan's ethics of care adds a crucial gender-development dimension. The conventional feminine position is care-at-the-expense-of-self (yielding). The conventional masculine position is justice-at-the-expense-of-care (forcing). The post-conventional position integrates both: "I can care for you AND for myself. I can be just AND tender." This integration is the developmental frontier of conflict.

Spiral Dynamics shows how cultural values shape conflict: Red (power) = dominate. Blue (order) = follow the rules. Orange (achievement) = negotiate rationally. Green (harmony) = seek consensus. Teal (integral) = hold the paradox. Each level is valid in context and insufficient alone.`,
      simpleMetaphor: 'Your conflict style evolves like your taste in music — what worked at 15 doesn\'t work at 35, and that\'s growth, not failure.',
    },

    relational: {
      quotes: [
        '"A good marriage is one in which each partner appoints the other to be the guardian of their solitude." — Rainer Maria Rilke',
        '"We come to love not by finding a perfect person, but by learning to see an imperfect person perfectly." — Sam Keen',
        '"The extent to which two people can bring up and resolve issues is a critical marker of the soundness of a relationship." — John Gottman',
        '"Your partner is not your enemy. Your enemy is the cycle between you." — Sue Johnson',
        '"Conflict is the doorway to deeper intimacy — but only if both people walk through it together." — Harville Hendrix',
      ],
      archetypes: ['The Lover', 'The Bridge', 'The Peaceweaver'],
      ecoPsychology: 'In ecology, the boundary between two ecosystems (the "ecotone") is often the most biodiverse and dynamic area. The boundary between you and your partner during conflict is the ecotone where the most growth happens.',
      poetry: `We are not fighting\nabout the dishes.\nWe are fighting\nabout whether you see me.\nWe are fighting\nabout whether I matter.\nWe are fighting\nabout whether love\nis big enough\nto hold us both.`,
      microPractice: 'After your next conflict, do the "Aftermath" conversation (Gottman): each person shares their subjective reality of the fight without interruption. Start with "I felt..." not "You did..." Validate before problem-solving. This process turns fights into data instead of damage.',
      therapyModels: ['Gottman Method', 'EFT (Sue Johnson)', 'Imago Therapy (Harville Hendrix)', 'PACT (Stan Tatkin)', 'Relational-Cultural Theory'],
      developmentalStage: `Your conflict style doesn't just affect you — it creates your partner's relational experience in real time. Here is what each style typically evokes in the partner:

YIELDING: Your partner feels powerful in the moment but lonely afterward. They wanted a partner, not a subordinate. Over time, yielding creates a dangerous dynamic: your partner can never trust that your "yes" means yes. They lose access to your authentic self.

AVOIDING: Your partner feels abandoned. When you disappear during conflict, their nervous system reads it as danger — not "they need space" but "they're gone." Stan Tatkin describes this as triggering the partner's "separation distress" at a primal level. The avoider's silence screams louder than any words.

FORCING: Your partner feels unsafe. Not necessarily physically — emotionally. When you escalate, dominate, or bulldoze, your partner's nervous system goes into protection mode. They stop being your partner and start being your opponent. Everything they say from that point is defensive, not authentic.

PROBLEM-SOLVING: This is often the healthiest — but when used to bypass emotion, it makes your partner feel unseen. "Let's just figure it out" when they need "I hear you're in pain" creates a particular kind of loneliness.

The I-Thou dimension (Buber): in conflict, couples oscillate between I-It relating (where the partner is an obstacle, a problem, a means to an end) and I-Thou relating (where the partner is a mystery, a subject, a full human being). The repair attempt is the moment you shift from I-It back to I-Thou. "I see you're hurting" is I-Thou in three words.`,
      simpleMetaphor: 'How you fight with your partner is like how you dance — it doesn\'t matter if you step on each other\'s toes sometimes, as long as you keep trying to find the rhythm together.',
    },

    simple: {
      quotes: [
        '"Don\'t go to bed angry. Stay up and fight." — Phyllis Diller',
        '"The goal isn\'t to never fight. The goal is to fight well." — common therapy saying',
        '"A relationship without conflict is a relationship without honesty." — Unknown',
        '"Pick your battles. But also: don\'t pick battles. Pick conversations." — Unknown',
        '"Disagree without being disagreeable." — common saying',
      ],
      archetypes: ['The Honest Friend', 'The Peacemaker'],
      ecoPsychology: 'Fighting is like a sport — there are rules, there are fouls, and the point is not to destroy the other team but to play a good game together.',
      poetry: `Here\'s the thing:\nyou\'re going to fight.\nThe question is whether you fight\nlike enemies\nor like teammates\nwho disagree on strategy.`,
      microPractice: 'Next fight: before you respond, ask yourself one question: "Am I trying to win, or am I trying to understand?" If it\'s "win," take a breath and switch modes. That one question changes everything.',
      therapyModels: ['Common sense', 'Fair fighting rules', 'Basic communication'],
      developmentalStage: 'Here\'s what nobody tells you: every couple fights about the same 3-5 things forever. You\'re not going to "solve" those disagreements. You\'re going to get better at talking about them. The couples who last aren\'t the ones who agree on everything — they\'re the ones who can laugh about the thing they\'ve been arguing about for 20 years.',
      simpleMetaphor: 'Your conflict style is like your texting style — some people send walls of text, some people ghost, some people send one-word replies. All of them are communicating something, just not always what they mean.',
    },
  },

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃ DOMAIN 6: COMPASS (Values)                           ┃
  // ┃ Top Value, Biggest Gap, Alignment, Action Score      ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  compass: {

    soulful: {
      quotes: [
        '"Your vision will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakes." — Carl Jung',
        '"The only people for me are the mad ones, the ones who are mad to live, mad to talk, mad to be saved." — Jack Kerouac, On the Road',
        '"If you don\'t know what you value, you\'ll spend your life doing what other people value." — paraphrase of Thoreau',
        '"Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray." — Rumi',
        '"The things you are passionate about are not random. They are your calling." — Fabienne Fredrickson',
        '"To live is the rarest thing in the world. Most people exist, that is all." — Oscar Wilde',
        '"I went to the woods because I wished to live deliberately, to front only the essential facts of life." — Henry David Thoreau, Walden',
        '"This is what you shall do; Love the earth and sun and the animals." — Walt Whitman',
      ],
      archetypes: ['The Sage', 'The Pilgrim', 'The Seeker', 'The Self', 'The Hero'],
      ecoPsychology: `Values are the magnetic north of the soul. In the natural world, migratory birds carry an internal compass — magnetite crystals in their brains that align with the earth's magnetic field. They don't need a map. They don't need GPS. They carry the direction inside their bodies. Your values are your magnetite. They are the compass written into the deepest structure of who you are.

But here is the ecological truth: a compass is only useful if you follow it. A bird that senses north but flies south is not wrong — it is lost. The gap between your stated values and your lived behavior is the distance between sensing the direction and actually flying toward it. Wendell Berry wrote, "The world is not given by his fathers, but borrowed from his children." Your values are the inheritance you are building. Every choice you make — where you spend your time, your money, your attention — is a line in the will.

Ecopsychology reminds us that values are not just personal preferences — they are expressions of our embeddedness in the larger web of life. When you value connection, you are expressing the relational nature of all living systems. When you value growth, you are expressing the life force that drives every seed toward the sun. Your values are not arbitrary. They are ecological.`,
      poetry: `Somewhere inside you\nthere is a compass\nthat has never been wrong.\nIt does not speak in words.\nIt speaks in longing.\n\nFollow the longing.\nNot the logic.\nNot the fear.\nNot the "should."\n\nThe longing knows\nwhere you belong.`,
      microPractice: 'Each morning, before you open your phone, ask: "What is my deepest value today?" Not your goal. Not your to-do list. Your value. Then make one choice during the day that honors it. One choice. That is a life lived on purpose.',
      therapyModels: ['Jungian Analysis', 'Transpersonal Psychology', 'Ecopsychology (Wendell Berry, Theodore Roszak)', 'Logotherapy (Viktor Frankl)'],
      developmentalStage: 'Jung described the second half of life as the turn toward meaning — away from achievement and toward purpose. Values are the language of this turn. Frankl, who survived Auschwitz, wrote: "Those who have a \'why\' to live, can bear with almost any \'how\'." Your values are your "why." The gap between your values and your behavior is the territory where your next growth lives.',
      simpleMetaphor: 'Your values are like the North Star — they don\'t move, but they tell you where you\'re going.',
    },

    therapeutic: {
      quotes: [
        '"It\'s not what you look at that matters, it\'s what you see." — Henry David Thoreau',
        '"Values are like a compass; they help you find your way when the path is unclear." — Steven Hayes',
        '"The good life is not about feeling good. It is about being willing to feel everything in service of what matters." — Steven Hayes',
        '"People often say that motivation doesn\'t last. Well, neither does bathing — that\'s why we recommend it daily." — Zig Ziglar',
        '"He who has a why to live for can bear almost any how." — Friedrich Nietzsche (often attributed to Viktor Frankl)',
      ],
      archetypes: ['The Guide', 'The Therapist', 'The Compass-Maker'],
      ecoPsychology: 'Values in therapy are the GPS coordinates you enter before the journey. Without them, you can drive perfectly well — but you\'ll arrive somewhere you didn\'t mean to go.',
      poetry: `A value is not a feeling.\nA value is a direction.\nFeelings come and go.\nThe direction holds.`,
      microPractice: 'Write your top 3 values on a card. Carry it in your wallet. Before any significant decision this week, pull it out and ask: "Does this move me toward or away from what matters?" This externalization technique is core ACT practice.',
      therapyModels: ['ACT (Steven Hayes)', 'Logotherapy (Viktor Frankl)', 'Motivational Interviewing (Miller & Rollnick)', 'CBT (Aaron Beck)', 'Schema Therapy (Jeffrey Young)', 'Narrative Therapy'],
      developmentalStage: `ACT (Steven Hayes) places values at the center of psychological health. The hexaflex model shows six processes of psychological flexibility, and values are the compass point that gives direction to all the others. Without values, defusion is just a trick. Without values, acceptance is just passivity. Values transform psychological skills into a meaningful life.

The critical ACT distinction: values are not goals. A goal can be achieved and checked off. A value is a direction — you never "arrive" at kindness or courage or connection. You move toward them, moment by moment, for the rest of your life. The values-action gap is the space between knowing what matters and actually doing it. ACT research shows that closing this gap — even by small amounts — correlates strongly with reduced depression, anxiety, and relationship distress.

Motivational Interviewing (Miller & Rollnick) illuminates the ambivalence that lives in the values-action gap. Most people genuinely value connection AND genuinely avoid vulnerability. They value honesty AND fear conflict. The ambivalence is not hypocrisy — it is the human condition. MI helps people explore both sides without judgment, building "change talk" — the person's own arguments for aligning their behavior with their values.

Schema Therapy adds depth: the values-action gap often reflects early maladaptive schemas. If your childhood installed a Defectiveness/Shame schema, you might deeply value authenticity but consistently hide your true self. The gap is not laziness — it is a protective strategy that once kept you safe. Therapy involves honoring the protection while gently building the capacity to act on the value.

Logotherapy (Frankl) offers the existential perspective: values give life meaning, and meaning is the primary human motivation. When people feel "stuck" in their relationships, it is often not a skills deficit but a meaning deficit. The question is not "How do I fix this?" but "What does this relationship mean to me, and am I living in a way that honors that meaning?"`,
      simpleMetaphor: 'Values are like the destination in your GPS — they don\'t prevent detours, but they always recalculate to bring you back on track.',
    },

    practical: {
      quotes: [
        '"Action expresses priorities." — Mahatma Gandhi',
        '"Tell me what you pay attention to and I will tell you who you are." — Jose Ortega y Gasset',
        '"The key is not to prioritize what\'s on your schedule, but to schedule your priorities." — Stephen Covey',
        '"You are what you do, not what you say you\'ll do." — Carl Jung',
        '"If it\'s important to you, you\'ll find a way. If it\'s not, you\'ll find an excuse." — Jim Rohn',
      ],
      archetypes: ['The Builder', 'The Farmer'],
      ecoPsychology: 'Values without action are like seeds without soil. Plant them in your daily routine or they stay dreams.',
      poetry: `Don\'t tell me what you value.\nShow me your calendar\nand your bank statement.\nI\'ll tell you what you value.`,
      microPractice: `THE ONE STEP: The "Values Audit" — 10 minutes, once a week (Sunday evening).

1. Look at your calendar from the past week.
2. For each major time block, label it with the value it served. (Work meeting = achievement? Date night = connection? Scrolling = avoidance?)
3. Compare the distribution to your stated values.
4. Identify ONE 30-minute block next week where you can replace a low-value activity with a high-value one.

EXAMPLE: If your top value is "Connection" but you spent 0 hours in quality time this week, block 30 minutes for a phone-free walk with your partner. Put it in the calendar. Treat it like a doctor's appointment.

HABIT STACK: "After I do my weekly planning (cue), I do my Values Audit (behavior), and I schedule one values-aligned action (reward)."

THE GAP METRIC: Rate your values-action alignment 1-10 weekly. Track it. The number itself drives change — what gets measured gets managed.`,
      therapyModels: ['ACT (Steven Hayes)', 'Atomic Habits (James Clear)', 'Time Management (Stephen Covey)', 'Behavioral Activation'],
      developmentalStage: 'In Prochaska\'s model: the Values Audit moves you from Contemplation ("I know what matters") to Preparation ("Here\'s what I\'m going to do about it"). One scheduled action moves you to Action. Tracking weekly moves you toward Maintenance. Don\'t skip the Preparation step — it\'s where most people fail.',
      simpleMetaphor: 'Values without action are just Pinterest boards — pretty to look at, but they don\'t change your house.',
    },

    developmental: {
      quotes: [
        '"The creation of a thousand forests is in one acorn." — Ralph Waldo Emerson',
        '"We must be willing to let go of the life we planned so as to have the life that is waiting for us." — Joseph Campbell',
        '"What is necessary to change a person is to change his awareness of himself." — Abraham Maslow',
        '"The arc of the moral universe is long, but it bends toward justice." — Martin Luther King Jr.',
        '"At the center of your being you have the answer; you know who you are and you know what you want." — Lao Tzu',
      ],
      archetypes: ['The Sage', 'The Philosopher', 'The Elder'],
      ecoPsychology: 'Values mature like wine or forests — what you valued at 20 is not wrong, but it deepens, complexifies, and becomes more nuanced with each decade.',
      poetry: `First, you inherited your values.\nThen, you chose them.\nThen, you questioned them.\nThen — if you were brave —\nyou let some of them die\nso the right ones could live.`,
      microPractice: 'Annually, revisit your values and ask: "Which of these are truly mine, and which did I inherit?" Distinguishing chosen values from inherited ones is one of the most powerful developmental moves a person can make.',
      therapyModels: ['Integral Theory (Ken Wilber)', 'Spiral Dynamics (Beck & Cowan)', 'Fowler\'s Stages of Faith', 'Moral Development (Kohlberg/Gilligan)', 'Constructive Developmental Theory (Kegan)'],
      developmentalStage: `Values development is one of the most well-mapped trajectories in developmental psychology.

Kohlberg's moral development: Pre-conventional = values based on reward/punishment ("I value loyalty because disloyalty gets punished"). Conventional = values based on social approval ("I value loyalty because good people are loyal"). Post-conventional = values based on universal principles ("I value loyalty when it serves human flourishing, and I can distinguish loyalty from complicity").

Spiral Dynamics maps value systems to cultural worldviews: Purple (tribal) values belonging and tradition. Red (power) values strength and autonomy. Blue (order) values duty, rules, and sacrifice. Orange (achievement) values success, progress, and rationality. Green (pluralistic) values equality, empathy, and consensus. Yellow/Teal (integral) values flexibility, systemic thinking, and paradox. Turquoise (holistic) values the interconnection of all life.

Fowler's stages of faith track how people relate to their deepest values: at the Synthetic-Conventional stage, values are received from community and authority. At the Individuative-Reflective stage, values are critically examined and personally chosen. At the Conjunctive stage, values become paradoxical — you can hold seemingly contradictory values simultaneously. At the Universalizing stage, values become lived rather than believed — they are not something you have but something you are.

The key developmental insight for couples: partners often operate at different value stages, and this creates friction that looks like a values conflict but is actually a developmental difference. One partner at Blue ("Marriage means duty") and another at Green ("Marriage means mutual growth") are not disagreeing about marriage — they are seeing it from different developmental altitudes. The work is not to agree on one altitude but to understand and respect both.`,
      simpleMetaphor: 'Values are like your music taste — they evolve over time, and the stuff you were SURE about at 18 makes you cringe at 35, but it was real then and it got you here.',
    },

    relational: {
      quotes: [
        '"A great marriage is not when the \'perfect couple\' comes together. It is when an imperfect couple learns to enjoy their differences." — Dave Meurer',
        '"Shared values are the foundation of lasting love. Shared interests are the decoration." — Unknown',
        '"Love does not consist of gazing at each other, but in looking outward together in the same direction." — Antoine de Saint-Exupéry',
        '"The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed." — Carl Jung',
        '"We are most alive when we discover mutuality." — Martin Buber (paraphrased)',
      ],
      archetypes: ['The Co-Pilgrim', 'The Companion', 'The Bridge-Builder'],
      ecoPsychology: 'In ecology, "mutualism" describes two species that benefit from each other\'s existence — like bees and flowers. Shared values are the relational equivalent: the places where your flourishing feeds your partner\'s flourishing and vice versa.',
      poetry: `We don\'t need\nthe same values.\nWe need to know\neach other\'s values\nwell enough\nto tend them\nlike gardens\nnot our own.`,
      microPractice: 'This week, ask your partner: "What matters most to you right now in your life?" Listen for 5 minutes without responding. Then share yours. This is Gottman\'s "Love Map" exercise applied to values. Many couples have not updated each other\'s value maps in years.',
      therapyModels: ['Gottman Method', 'Imago Therapy (Harville Hendrix)', 'PACT (Stan Tatkin)', 'ACT for Couples', 'Narrative Therapy'],
      developmentalStage: `Values alignment in couples is more complex than it appears. Gottman's research shows that shared meaning-making — the sense of a shared life purpose — is the top level of his Sound Relationship House. But "shared" does not mean "identical."

The healthiest couples have what Gottman calls a "shared value system" with room for individual values within it. Think of it as a Venn diagram: the overlapping center is your shared values (connection, growth, family). The non-overlapping circles are individual values (one partner values adventure, the other values stability). Both are honored.

Harville Hendrix's Imago work reveals that values conflicts often mask deeper attachment wounds. When partners fight about values ("You don't care about family!" "You don't care about my career!"), they are often expressing attachment fears ("Are you with me? Do you see me?"). The Imago dialogue — Mirror, Validate, Empathize — cuts through the values content to reach the attachment music underneath.

The relational impact of the values-action gap: when you fail to live your stated values, your partner experiences it as a breach of trust. "You said family matters most to you, but you work every weekend" is not nagging — it is a values-integrity question. Closing your own values-action gap is one of the most powerful things you can do for your partner's sense of safety.

Martin Buber's I-Thou lens: when partners share their deepest values with each other, it is an I-Thou moment — a revelation of the soul. Many couples have never explicitly shared their values with each other. They've assumed. They've projected. The simple act of saying "Here is what I live for" and hearing "Here is what I live for" creates a bridge between two inner worlds.`,
      simpleMetaphor: 'Shared values are like being on the same road trip — you don\'t have to agree on every rest stop, but you need to be heading to the same destination.',
    },

    simple: {
      quotes: [
        '"When you know what\'s important, decisions are easy." — Roy Disney',
        '"Values are like fingerprints. Nobody\'s are the same, but you leave \'em all over everything you do." — Elvis Presley',
        '"It\'s not hard to make decisions when you know what your values are." — Roy Disney',
        '"Live your values or they\'re just words on a wall." — common saying',
        '"What you do speaks so loudly that I cannot hear what you say." — Ralph Waldo Emerson',
      ],
      archetypes: ['The Authentic Self', 'The Straight-Talker'],
      ecoPsychology: 'Values are like your phone\'s home screen — they should be the things you actually use, not the apps that look good but you never open.',
      poetry: `You already know\nwhat matters.\nThe hard part\nis actually doing it.`,
      microPractice: 'Write down your top 3 values on a Post-it. Stick it to your bathroom mirror. Every morning, ask yourself: "Am I going to live these today?" If the answer is "not really," change one thing about your day. Just one.',
      therapyModels: ['Common sense', 'Basic goal-setting', 'Accountability'],
      developmentalStage: 'Here\'s the deal: most people\'s "values" are actually their parents\' values, their culture\'s values, or their Instagram feed\'s values. Figuring out what YOU actually value — not what you\'re supposed to value — is one of the most adult things you can do. And then actually living it? That\'s the whole game.',
      simpleMetaphor: 'Values are like your password — if you forget them, you can\'t access the good stuff in your life.',
    },
  },

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃ DOMAIN 7: FIELD (Field Awareness — RFAS)             ┃
  // ┃ Sensitivity, Boundary Clarity, Pattern Awareness,    ┃
  // ┃ Metacognitive Capacity                               ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  field: {

    soulful: {
      quotes: [
        '"The privilege of a lifetime is being who you are." — Joseph Campbell',
        '"We are not human beings having a spiritual experience. We are spiritual beings having a human experience." — Pierre Teilhard de Chardin',
        '"I said to my soul, be still, and wait without hope, for hope would be hope for the wrong thing." — T. S. Eliot, Four Quartets',
        '"The world is full of magic things, patiently waiting for our senses to grow sharper." — W. B. Yeats',
        '"Between every two pines is a doorway to a new world." — John Muir',
        '"We are here to awaken from the illusion of our separateness." — Thich Nhat Hanh',
        '"There is a crack in everything. That\'s how the light gets in." — Leonard Cohen',
        '"You must have chaos within you to give birth to a dancing star." — Friedrich Nietzsche',
      ],
      archetypes: ['The Shaman', 'The Oracle', 'The Mystic', 'The Great Mother', 'The Self', 'The Anima Mundi'],
      ecoPsychology: `The "field" is the oldest concept in human experience — older than psychology, older than philosophy, older than language itself. Indigenous cultures worldwide describe a felt sense of the living space between beings. The Aboriginal Australian concept of "Dreamtime" — the invisible web of relationship that connects all living things — is a field concept. So is the Lakota "Mitakuye Oyasin" (all my relations) and the Japanese "Ma" (the living space between things).

In ecopsychology, Theodore Roszak described the "ecological unconscious" — the layer of psyche that connects us to the more-than-human world. Your field awareness is this capacity: the ability to sense the living, breathing, feeling space between you and your partner, between you and the room, between you and the world.

John O'Donohue wrote: "The visible world is the first shoreline of the invisible world." Your field awareness is the capacity to sense that second shoreline — to feel what lives between the words, beneath the behavior, behind the eyes. Some people have extraordinary field sensitivity. They walk into a room and immediately sense the emotional weather. They feel a conversation shift before anyone speaks. This is not a parlor trick. It is an ancient human capacity that modern life has dulled in most people — but not in you.

The danger of high field sensitivity without boundary clarity is drowning in the emotional ocean of others. The gift of high field sensitivity with boundary clarity is wisdom — the ability to feel the field without being consumed by it. You become what Clarissa Pinkola Estes calls the "one who knows" — not through study but through sensing.`,
      poetry: `Between you and your beloved\nthere is a third presence.\nNot you. Not them.\nThe space itself — alive.\n\nIt holds your history.\nIt knows your future.\nIt feels everything\nyou are both afraid to say.\n\nTend this space.\nIt is the most sacred ground\nyou will ever stand on.\nIt is where love actually lives.`,
      microPractice: 'Sit with your partner in silence for 3 minutes. No phones, no talking. Just breathe and feel what is between you. After 3 minutes, each share one word for what the field felt like. "Warm." "Heavy." "Alive." "Distant." This is field-reading practice. It builds the muscle of relational perception that most couples never exercise.',
      therapyModels: ['Jungian Analysis', 'Ecopsychology', 'Transpersonal Psychology', 'Somatic Experiencing (Peter Levine)', 'Phenomenology'],
      developmentalStage: 'In Jungian psychology, field awareness corresponds to the activation of the Self archetype — the center of the whole psyche, not just the ego. The Self perceives wholes, patterns, and connections that the ego — focused on survival and identity — cannot see. Field awareness is the ego learning to receive the Self\'s transmissions. It is, in the deepest sense, a spiritual capacity — the soul\'s ability to feel the larger field in which it is embedded.',
      simpleMetaphor: 'Field awareness is like having emotional surround sound — most people hear in stereo, but you can feel the whole room.',
    },

    therapeutic: {
      quotes: [
        '"The body says what words cannot." — Martha Graham',
        '"Safety is created, not found." — Stephen Porges',
        '"We are hardwired to connect with others, it\'s what gives purpose and meaning to our lives." — Brené Brown',
        '"The field between two people is the therapy." — Daniel Stern (paraphrased)',
        '"Relationship is the doorway through which the soul enters the world." — Thomas Moore, Soul Mates',
      ],
      archetypes: ['The Healer', 'The Witness', 'The Container'],
      ecoPsychology: 'In polyvagal terms, the "field" is the neuroceptive space between two nervous systems — each constantly scanning the other for cues of safety and threat.',
      poetry: `The space between you\nis not empty.\nIt is the most populated place\nin your relationship.`,
      microPractice: 'Practice "co-regulation": sit back-to-back with your partner for 2 minutes, matching your breathing rhythms. This synchronizes your autonomic nervous systems — research shows it reduces cortisol in both partners (Field, 2014). It is the simplest, most powerful field-tending practice available.',
      therapyModels: ['Polyvagal Theory (Stephen Porges)', 'Somatic Experiencing (Peter Levine)', 'AEDP (Diana Fosha)', 'EFT (Sue Johnson)', 'Gestalt Therapy', 'IFS (Richard Schwartz)', 'Relational Psychoanalysis', 'Intersubjective Systems Theory (Stolorow)'],
      developmentalStage: `Field awareness, from a therapeutic perspective, is the capacity for what Daniel Stern called "implicit relational knowing" — the nonverbal, procedural knowledge of how to be with another person. It lives below consciousness, in the body, in the micro-expressions, in the millisecond timing of conversational turns.

Polyvagal theory (Porges) provides the neurobiological basis: the ventral vagal complex — the "social engagement system" — constantly monitors the field for prosodic voice tone, facial expression, head gesture, and proximity. High field sensitivity means your social engagement system is finely tuned. Low boundary clarity means your system cannot distinguish between "I am sensing their anxiety" and "I am anxious."

Somatic Experiencing (Peter Levine) emphasizes that the field holds trauma — not just individual trauma but relational trauma, collective trauma, intergenerational trauma. When you sense heaviness in the relational field, you may be sensing the residue of unresolved pain that belongs to neither of you individually but lives in the space between.

AEDP (Diana Fosha) describes the therapeutic relationship — and by extension all relationships — as a "transformational field." When two people are present, attuned, and emotionally available, the field between them becomes a container for processing difficult experiences. Fosha's core principle: "It is not good to be alone with overwhelming experience." The field between you and your partner is the alternative to aloneness. Tending it is the most therapeutic thing you can do.

IFS adds that field sensitivity can be a part, not just a trait. A "caretaker" part may have developed hypervigilant field awareness as a survival strategy — scanning for danger in the relational environment. The work is to unburden this part: to allow field awareness to be a gift rather than a defense. When you sense the field from Self (calm, curious, compassionate) rather than from a protector part (anxious, vigilant, responsible), the information you receive is clearer and does not deplete you.`,
      simpleMetaphor: 'Field awareness is like having emotional Bluetooth — you\'re constantly syncing with the people around you, whether you know it or not.',
    },

    practical: {
      quotes: [
        '"Pay attention to what you pay attention to." — Amy Krouse Rosenthal',
        '"The quality of your life is determined by the quality of your attention." — Chade-Meng Tan',
        '"What you practice grows stronger." — Shauna Shapiro',
        '"Presence is the most precious gift you can give another person." — Marshall Rosenberg',
        '"Small things done consistently create remarkable results." — Robin Sharma',
      ],
      archetypes: ['The Gardener', 'The Tender'],
      ecoPsychology: 'The field between you and your partner is like a garden — it needs daily tending, not annual overhauls. Three minutes of intentional presence is worth more than a weekend retreat.',
      poetry: `Tend the space.\nNot the person.\nThe space.`,
      microPractice: `THE ONE STEP: Create a daily "Field Check-In" — a 90-second ritual that maintains the relational field.

WHEN: After you both arrive home (or first moment together each day).
HOW: Face each other. Eye contact. One question: "What's one thing you're carrying right now?"
Each person answers in one sentence. No fixing. No follow-up required.
DURATION: 90 seconds.

HABIT STACK: "After we're both home and shoes are off (cue), we do our Field Check-In (behavior), and the relationship feels tended (reward)."

WHY THIS WORKS: Gottman's research shows that couples who maintain "turning toward" rituals have 86% relationship satisfaction vs. 33% for couples who don't. The check-in is a micro-ritual that maintains field connection.

ADVANCED: Once weekly, do a 10-minute "State of the Field" conversation. Not problems. Not logistics. Just: "How does the space between us feel right now?" and "What does it need?" This is relational maintenance at the deepest level, and it takes less time than doing the dishes.`,
      therapyModels: ['Gottman Method', 'Tiny Habits (BJ Fogg)', 'Mindful Relating', 'Ritual Design'],
      developmentalStage: 'In the Stages of Change: the daily Field Check-In is the gateway practice. It takes 90 seconds. It requires no skill, no training, no therapist. It simply asks you to show up and be present for 90 seconds a day. If you cannot do 90 seconds, you have a resistance that is worth exploring — not a time problem.',
      simpleMetaphor: 'Tending the relational field is like watering a plant — skip a day and it\'s fine, skip a month and it\'s dead. The habit is more important than the amount.',
    },

    developmental: {
      quotes: [
        '"The intuitive mind is a sacred gift and the rational mind is a faithful servant." — Albert Einstein',
        '"Knowing others is intelligence; knowing yourself is true wisdom." — Lao Tzu',
        '"The real voyage of discovery consists not in seeking new landscapes, but in having new eyes." — Marcel Proust',
        '"We cannot solve our problems with the same thinking we used when we created them." — Albert Einstein',
        '"Consciousness is always open to many possibilities because it involves play." — Julian Jaynes',
      ],
      archetypes: ['The Seer', 'The Sage', 'The Mystic', 'The Self'],
      ecoPsychology: 'Field awareness is perhaps the most developmental of all relational capacities — it requires the ability to perceive systems, not just parts. It is the ecological mind applied to human relationships.',
      poetry: `First, you see the trees.\nThen, you see the forest.\nThen, you see the space\nbetween the trees\nwhere the forest actually lives.`,
      microPractice: 'Biweekly reflection: "What patterns am I noticing in the relational field? Am I naming them or just sensing them? What would it look like to bring one pattern into conversation?"',
      therapyModels: ['Integral Theory (Ken Wilber)', 'Constructive Developmental Theory (Robert Kegan)', 'Systems Theory (Gregory Bateson)', 'Spiral Dynamics', 'Transpersonal Psychology'],
      developmentalStage: `Field awareness maps onto the highest developmental stages across multiple frameworks because it requires a capacity that earlier stages simply cannot generate: the ability to perceive the system you are embedded in while remaining a participant in it.

At Kegan's Order 3 (Socialized Mind), you are embedded in the relational field — you feel it, you are shaped by it, but you cannot see it as a thing separate from yourself. Your partner's mood IS your mood. The field IS your reality.

At Order 4 (Self-Authoring Mind), you can observe the relational field — you notice patterns, name dynamics, see your own contribution. You can say "There is tension between us" rather than just feeling tense. But you tend to relate to the field as an object to be managed.

At Order 5 (Self-Transforming Mind), you can hold the paradox: you are both a participant in the field and an observer of it, simultaneously. You can sense the field without being consumed, contribute to it without controlling it, be changed by it without losing yourself. This is what Kegan calls "the capacity to be subject to one's own self-system."

Ken Wilber's Integral model adds: field awareness requires development across multiple intelligence lines simultaneously — cognitive (to see patterns), emotional (to feel the field), interpersonal (to track others' contributions), and spiritual (to hold the whole with compassion). This is why field awareness feels "advanced" — it is not a single skill but an integration of many.

Gregory Bateson's systems thinking provides the meta-framework: the field is a pattern that connects. It is not a thing but a relationship. It is not located in you or in your partner but in the interaction between you. Bateson called this "the pattern which connects" — the invisible order that organizes all living systems. Your field awareness is your capacity to perceive this pattern. It is, in developmental terms, a movement from first-person perspective (I) to second-person perspective (you) to third-person perspective (it) to what Wilber calls fourth-person perspective — the ability to hold all three simultaneously.`,
      simpleMetaphor: 'Field awareness development is like learning to see 3D images in those Magic Eye books — at first you just see dots, then suddenly the whole hidden picture appears, and you can\'t unsee it.',
    },

    relational: {
      quotes: [
        '"Between stimulus and response, there is a space. In that space lies our growth and our freedom." — Viktor Frankl',
        '"The space between us is not empty. It is full of everything we have ever said to each other." — paraphrase of John O\'Donohue',
        '"In the shelter of each other, the people live." — Irish proverb',
        '"You don\'t develop courage by being happy in your relationships everyday. You develop it by surviving difficult times and challenging adversity." — Epicurus',
        '"We cultivate love when we allow our most vulnerable and powerful selves to be deeply seen and known." — Brené Brown',
      ],
      archetypes: ['The Weaver', 'The Space-Holder', 'The Co-Creator'],
      ecoPsychology: 'In ecology, the space between organisms — the air, the water, the soil — is not empty. It is the medium through which all exchange, communication, and nourishment flows. The relational field between you and your partner is this medium.',
      poetry: `The field between us\nknows things\nwe haven\'t said yet.\nIt holds our silences\nlike a bowl holds water —\ncarefully,\nwith both hands.`,
      microPractice: 'This week, notice one moment when the field between you and your partner shifts — a warming, a cooling, a tightening. Don\'t fix it. Just name it: "Something shifted just now." Naming the field out loud makes the invisible visible and invites your partner into shared awareness of the relational space.',
      therapyModels: ['EFT (Sue Johnson)', 'PACT (Stan Tatkin)', 'Relational Psychoanalysis', 'Intersubjective Systems Theory', 'Imago Therapy (Harville Hendrix)'],
      developmentalStage: `The relational field is where love actually lives. Not in you. Not in your partner. In the space between you. This is not metaphor — it is the finding of every relational therapy tradition.

Sue Johnson's EFT research shows that the quality of the emotional bond between partners — the attachment security of the field — predicts relationship satisfaction better than communication skills, conflict resolution, or personality compatibility. The field is the thing.

Stan Tatkin's PACT couples therapy is built on the principle of the "couple bubble" — the implicit agreement that "we protect each other, we put the relationship first, and we create safety between us." The couple bubble IS the relational field, explicitly tended. When the bubble is intact, both partners can take risks, be vulnerable, and grow. When it is ruptured, both partners go into self-protection mode.

The relational insight about field awareness: one partner often carries the field awareness for the couple. They sense shifts, track emotional weather, notice disconnection. This is a gift AND a burden. If it is unacknowledged, the field-sensing partner can feel lonely — "I am the only one who notices what's happening between us." The practice is to share the field-sensing: to explicitly invite your partner to notice the space between you, not just their own inner world.

Martin Buber's I-Thou framework reaches its fullest expression here. The "Thou" is not just the person across from you — it is the living field between you. When Buber says "All real living is meeting," he means: the field IS the meeting. Tending the field IS tending the love. Not the person. Not yourself. The space between. That is where the sacred lives.`,
      simpleMetaphor: 'The field between you and your partner is like the Wi-Fi in your house — invisible, but when it goes down, nothing works.',
    },

    simple: {
      quotes: [
        '"You know that thing when you walk into a room and you can feel the vibe? That\'s real." — common observation',
        '"The energy you bring into a room matters more than the words you say." — Unknown',
        '"Good vibes only." — every millennial\'s wall decor, but honestly, there\'s something to it',
        '"Pay attention to how people make you feel." — common wisdom',
        '"The vibe is the thing." — common saying',
      ],
      archetypes: ['The Vibe Reader', 'The Empath-in-Training'],
      ecoPsychology: 'You know that feeling when you walk into a room and it just feels... off? Or when you\'re with someone and everything just flows? That\'s the field. It\'s real, it\'s not woo-woo, and learning to read it is a life skill.',
      poetry: `The vibe between you\nis not a mystery.\nIt is the sum\nof a thousand tiny choices:\nto look up or look away,\nto listen or to scroll,\nto reach out or to retreat.\n\nSmall choices.\nBig vibe.`,
      microPractice: 'Tonight, put your phones down for 10 minutes and just be together. That\'s it. No agenda. No conversation required. Just share space. If the vibe feels awkward, that\'s information. If it feels warm, that\'s also information. Start paying attention to it.',
      therapyModels: ['Common sense', 'Mindfulness basics', 'Being present'],
      developmentalStage: 'Here\'s the truth: you already know how to read the field. You do it every day — you walk into parties and immediately sense the vibe, you know when your friend is off before they say anything. The only difference is applying that same skill to your relationship, on purpose. That\'s it. You\'re not learning something new. You\'re learning to use what you\'ve always had.',
      simpleMetaphor: 'The relational field is basically the vibe between you and your partner — and just like any vibe, it takes work to keep it good.',
    },
  },
};
