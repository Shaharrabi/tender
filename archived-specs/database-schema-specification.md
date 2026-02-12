# Database Schema Specification
## Couples Relationship App - Data Persistence Design

**Purpose:** Define complete data model, relationships, and persistence strategy  
**Version:** 1.0  
**Database:** PostgreSQL (primary) + Redis (caching/sessions)  
**ORM Recommendation:** Prisma or TypeORM

---

# TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Entity Relationship Diagram](#2-entity-relationship-diagram)
3. [Core Entities](#3-core-entities)
4. [Assessment Entities](#4-assessment-entities)
5. [Portrait Entities](#5-portrait-entities)
6. [Agent & Session Entities](#6-agent--session-entities)
7. [Partner & Sharing Entities](#7-partner--sharing-entities)
8. [Progress & Growth Entities](#8-progress--growth-entities)
9. [Indexes & Performance](#9-indexes--performance)
10. [Data Lifecycle & Retention](#10-data-lifecycle--retention)
11. [Security & Encryption](#11-security--encryption)
12. [Migration Strategy](#12-migration-strategy)

---

# 1. Overview

## Design Principles

1. **Privacy by Default** - Sensitive data encrypted at rest, minimal exposure
2. **Consent-Driven Sharing** - Partner access requires explicit grants
3. **Audit Trail** - Track data access and modifications
4. **Soft Deletes** - Allow recovery, support GDPR/CCPA requests
5. **Denormalization for Performance** - Cache computed values where appropriate
6. **Versioning** - Portrait and assessment versions tracked

## Database Selection Rationale

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Primary | PostgreSQL | ACID compliance, JSON support, full-text search |
| Cache | Redis | Session storage, rate limiting, real-time features |
| Search | PostgreSQL FTS | Conversation search, pattern matching |
| Files | S3-compatible | Avatar images, exports |

## Schema Conventions

```
NAMING:
- Tables: snake_case, plural (users, assessments)
- Columns: snake_case (created_at, user_id)
- Primary Keys: id (UUID)
- Foreign Keys: {table_singular}_id (user_id, portrait_id)
- Timestamps: created_at, updated_at, deleted_at

TYPES:
- IDs: UUID v4
- Timestamps: TIMESTAMPTZ
- Money: DECIMAL(10,2)
- JSON: JSONB
- Enums: PostgreSQL ENUM types
```

---

# 2. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIPS                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────┐         ┌──────────────────┐         ┌──────────────────┐        │
│  │  users   │────────▶│ user_preferences │         │  partnerships    │        │
│  └────┬─────┘         └──────────────────┘         └────────┬─────────┘        │
│       │                                                      │                  │
│       │ 1:N                                            M:N   │                  │
│       ▼                                                      │                  │
│  ┌──────────────┐                                           │                  │
│  │ assessments  │◀──────────────────────────────────────────┘                  │
│  └────┬─────────┘                                                              │
│       │                                                                         │
│       │ 1:N                                                                     │
│       ▼                                                                         │
│  ┌──────────────────┐                                                          │
│  │assessment_responses│                                                         │
│  └──────────────────┘                                                          │
│       │                                                                         │
│       │ (computed from)                                                         │
│       ▼                                                                         │
│  ┌──────────┐         ┌──────────────────┐         ┌──────────────────┐        │
│  │ portraits│────────▶│ portrait_lenses  │         │ portrait_versions│        │
│  └────┬─────┘         └──────────────────┘         └──────────────────┘        │
│       │                                                                         │
│       │ 1:N                                                                     │
│       ├──────────────────────────────────────────────────┐                     │
│       │                                                   │                     │
│       ▼                                                   ▼                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐             │
│  │ growth_edges │    │anchor_points │    │ negative_cycle_config│             │
│  └──────────────┘    └──────────────┘    └──────────────────────┘             │
│                                                                                 │
│                                                                                 │
│  ┌──────────┐         ┌──────────────────┐         ┌──────────────────┐        │
│  │ sessions │────────▶│    messages      │────────▶│ message_metadata │        │
│  └──────────┘         └──────────────────┘         └──────────────────┘        │
│       │                                                                         │
│       │ 1:1                                                                     │
│       ▼                                                                         │
│  ┌──────────────────┐                                                          │
│  │ session_states   │                                                          │
│  └──────────────────┘                                                          │
│                                                                                 │
│                                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐                             │
│  │ growth_tracking  │────────▶│    milestones    │                             │
│  └──────────────────┘         └──────────────────┘                             │
│                                                                                 │
│                                                                                 │
│  ┌──────────────────┐         ┌──────────────────┐                             │
│  │ partner_shares   │────────▶│  share_access_log│                             │
│  └──────────────────┘         └──────────────────┘                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 3. Core Entities

## 3.1 Users

```sql
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'apple');

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identity
    email               VARCHAR(255) NOT NULL UNIQUE,
    email_verified      BOOLEAN DEFAULT FALSE,
    phone               VARCHAR(20),
    phone_verified      BOOLEAN DEFAULT FALSE,
    
    -- Profile
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100),
    display_name        VARCHAR(100),
    avatar_url          VARCHAR(500),
    timezone            VARCHAR(50) DEFAULT 'UTC',
    locale              VARCHAR(10) DEFAULT 'en-US',
    
    -- Authentication
    password_hash       VARCHAR(255),  -- NULL if OAuth only
    auth_provider       auth_provider NOT NULL DEFAULT 'email',
    auth_provider_id    VARCHAR(255),  -- External ID from OAuth provider
    
    -- Status
    status              user_status NOT NULL DEFAULT 'active',
    last_active_at      TIMESTAMPTZ,
    
    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_step     VARCHAR(50),
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_auth_provider ON users(auth_provider, auth_provider_id);
```

## 3.2 User Preferences

```sql
CREATE TABLE user_preferences (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Preferences
    notifications_enabled       BOOLEAN DEFAULT TRUE,
    push_enabled               BOOLEAN DEFAULT TRUE,
    email_digest_enabled       BOOLEAN DEFAULT TRUE,
    email_digest_frequency     VARCHAR(20) DEFAULT 'weekly',
    daily_checkin_reminder     BOOLEAN DEFAULT FALSE,
    daily_checkin_time         TIME,
    
    -- App Preferences
    theme                      VARCHAR(20) DEFAULT 'system',
    reduce_motion              BOOLEAN DEFAULT FALSE,
    large_text                 BOOLEAN DEFAULT FALSE,
    
    -- Privacy Preferences
    analytics_enabled          BOOLEAN DEFAULT TRUE,
    crash_reporting_enabled    BOOLEAN DEFAULT TRUE,
    
    -- Assessment Preferences
    assessment_auto_advance    BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_preferences UNIQUE (user_id)
);
```

## 3.3 Authentication & Sessions

```sql
CREATE TABLE auth_tokens (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Token Data
    token_hash          VARCHAR(255) NOT NULL,  -- Hashed token
    token_type          VARCHAR(20) NOT NULL,   -- 'access', 'refresh', 'reset', 'verify'
    
    -- Metadata
    device_info         JSONB,
    ip_address          INET,
    user_agent          TEXT,
    
    -- Expiry
    expires_at          TIMESTAMPTZ NOT NULL,
    revoked_at          TIMESTAMPTZ,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_token_type CHECK (token_type IN ('access', 'refresh', 'reset', 'verify'))
);

CREATE INDEX idx_auth_tokens_user ON auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_hash ON auth_tokens(token_hash) WHERE revoked_at IS NULL;
CREATE INDEX idx_auth_tokens_expiry ON auth_tokens(expires_at) WHERE revoked_at IS NULL;
```

---

# 4. Assessment Entities

## 4.1 Assessments

```sql
CREATE TYPE assessment_status AS ENUM (
    'not_started',
    'in_progress', 
    'completed',
    'abandoned'
);

CREATE TABLE assessments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Status
    status              assessment_status NOT NULL DEFAULT 'not_started',
    
    -- Progress Tracking
    current_section     VARCHAR(50),  -- 'attachment', 'personality', etc.
    current_question    INTEGER DEFAULT 0,
    sections_completed  VARCHAR(50)[] DEFAULT '{}',
    
    -- Timing
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    last_activity_at    TIMESTAMPTZ,
    total_time_seconds  INTEGER DEFAULT 0,
    
    -- Version (for instrument updates)
    instrument_version  VARCHAR(20) NOT NULL DEFAULT '1.0',
    
    -- Computed Scores (denormalized for quick access)
    scores              JSONB,  -- Full computed scores after completion
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_sections CHECK (
        sections_completed <@ ARRAY['attachment', 'personality', 'values', 
                                    'emotional_intelligence', 'conflict_style', 
                                    'differentiation']::VARCHAR(50)[]
    )
);

CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(user_id, status);
CREATE INDEX idx_assessments_completed ON assessments(user_id, completed_at DESC);
```

## 4.2 Assessment Responses

```sql
CREATE TABLE assessment_responses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id       UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    
    -- Question Identification
    section             VARCHAR(50) NOT NULL,
    question_id         VARCHAR(20) NOT NULL,  -- e.g., 'ECR_1', 'IPIP_45'
    question_index      INTEGER NOT NULL,
    
    -- Response Data
    response_type       VARCHAR(20) NOT NULL,  -- 'likert', 'text', 'ranking', 'choice'
    response_value      JSONB NOT NULL,        -- Flexible for different types
    
    -- Timing
    response_time_ms    INTEGER,  -- Time to answer
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_response UNIQUE (assessment_id, section, question_id),
    CONSTRAINT valid_section CHECK (
        section IN ('attachment', 'personality', 'values', 
                   'emotional_intelligence', 'conflict_style', 'differentiation')
    )
);

CREATE INDEX idx_responses_assessment ON assessment_responses(assessment_id);
CREATE INDEX idx_responses_section ON assessment_responses(assessment_id, section);

-- Example response_value structures:
-- Likert: {"value": 5}
-- Text: {"text": "I want to be patient and understanding..."}
-- Ranking: {"ranked": ["honesty", "intimacy", "growth", "security", "playfulness"]}
-- Choice: {"selected": "B"}
```

## 4.3 Assessment Section Scores

```sql
CREATE TABLE assessment_section_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id       UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    
    -- Section Identification
    section             VARCHAR(50) NOT NULL,
    
    -- Scores (structure varies by instrument)
    raw_scores          JSONB NOT NULL,
    normalized_scores   JSONB NOT NULL,
    subscale_scores     JSONB,
    percentiles         JSONB,
    
    -- Interpretations
    primary_classification VARCHAR(100),  -- e.g., 'anxious-preoccupied'
    secondary_classification VARCHAR(100),
    
    -- Computation Metadata
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    algorithm_version   VARCHAR(20) NOT NULL,
    
    CONSTRAINT unique_section_score UNIQUE (assessment_id, section)
);

CREATE INDEX idx_section_scores_assessment ON assessment_section_scores(assessment_id);
```

---

# 5. Portrait Entities

## 5.1 Portraits

```sql
CREATE TYPE portrait_status AS ENUM (
    'generating',
    'active',
    'superseded',
    'deleted'
);

CREATE TABLE portraits (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id       UUID NOT NULL REFERENCES assessments(id),
    
    -- Status
    status              portrait_status NOT NULL DEFAULT 'generating',
    version             INTEGER NOT NULL DEFAULT 1,
    
    -- Snapshot Data (denormalized for quick display)
    snapshot            JSONB NOT NULL,
    
    -- Full Portrait Data
    narrative           JSONB,  -- Synthesized narrative sections
    
    -- Generation Metadata
    generated_at        TIMESTAMPTZ,
    generation_time_ms  INTEGER,
    algorithm_version   VARCHAR(20) NOT NULL,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT one_active_portrait_per_user UNIQUE (user_id, status) 
        WHERE status = 'active'
);

CREATE INDEX idx_portraits_user ON portraits(user_id);
CREATE INDEX idx_portraits_active ON portraits(user_id) WHERE status = 'active';
CREATE INDEX idx_portraits_assessment ON portraits(assessment_id);
```

## 5.2 Portrait Lenses

```sql
CREATE TYPE lens_type AS ENUM (
    'attachment_protection',
    'parts_polarities',
    'regulation_window',
    'values_becoming'
);

CREATE TABLE portrait_lenses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portrait_id         UUID NOT NULL REFERENCES portraits(id) ON DELETE CASCADE,
    
    -- Lens Identification
    lens_type           lens_type NOT NULL,
    
    -- Lens Data
    analysis            JSONB NOT NULL,  -- Full lens analysis output
    
    -- Key Insights (denormalized for display)
    key_insights        TEXT[],
    primary_pattern     VARCHAR(200),
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_lens UNIQUE (portrait_id, lens_type)
);

CREATE INDEX idx_lenses_portrait ON portrait_lenses(portrait_id);
```

## 5.3 Growth Edges

```sql
CREATE TYPE growth_edge_status AS ENUM (
    'identified',
    'emerging',
    'practicing',
    'integrating',
    'integrated'
);

CREATE TABLE growth_edges (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portrait_id         UUID NOT NULL REFERENCES portraits(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Identity
    edge_key            VARCHAR(100) NOT NULL,  -- e.g., 'express_needs_directly'
    title               VARCHAR(200) NOT NULL,
    
    -- Content
    pattern_description TEXT NOT NULL,
    protection_function TEXT,
    cost_description    JSONB,  -- {toSelf, toRelationship, toPartner}
    invitation          TEXT NOT NULL,
    
    -- Practices
    daily_practice      TEXT,
    weekly_practice     TEXT,
    in_moment_practice  TEXT,
    
    -- Anchor
    anchor_phrase       TEXT NOT NULL,
    
    -- Status & Progress
    status              growth_edge_status NOT NULL DEFAULT 'identified',
    priority            INTEGER NOT NULL DEFAULT 1,
    
    -- Tracking
    times_mentioned     INTEGER DEFAULT 0,
    last_mentioned_at   TIMESTAMPTZ,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_edge UNIQUE (portrait_id, edge_key)
);

CREATE INDEX idx_growth_edges_user ON growth_edges(user_id);
CREATE INDEX idx_growth_edges_portrait ON growth_edges(portrait_id);
CREATE INDEX idx_growth_edges_status ON growth_edges(user_id, status);
```

## 5.4 Anchor Points

```sql
CREATE TYPE anchor_category AS ENUM (
    'when_activated',
    'when_shutdown',
    'pattern_interrupt',
    'repair_readiness',
    'self_compassion'
);

CREATE TABLE anchor_points (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portrait_id         UUID NOT NULL REFERENCES portraits(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Category
    category            anchor_category NOT NULL,
    
    -- Content
    content             JSONB NOT NULL,  -- Structure varies by category
    
    -- User Customization
    is_saved            BOOLEAN DEFAULT FALSE,  -- User marked as favorite
    user_notes          TEXT,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_anchors_user ON anchor_points(user_id);
CREATE INDEX idx_anchors_portrait ON anchor_points(portrait_id);
CREATE INDEX idx_anchors_saved ON anchor_points(user_id, is_saved) WHERE is_saved = TRUE;
```

## 5.5 Negative Cycle Configuration

```sql
CREATE TYPE cycle_position AS ENUM (
    'pursuer',
    'withdrawer',
    'mixed',
    'flexible'
);

CREATE TABLE negative_cycle_configs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portrait_id         UUID NOT NULL REFERENCES portraits(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Position
    position            cycle_position NOT NULL,
    position_confidence VARCHAR(20) NOT NULL,  -- 'high', 'medium', 'low'
    
    -- Cycle Description
    your_move           TEXT NOT NULL,
    underneath          TEXT NOT NULL,
    partner_experiences TEXT NOT NULL,
    escalation_risk     TEXT,
    
    -- Triggers & De-escalators
    triggers            JSONB NOT NULL,  -- Array of {trigger, yourResponse}
    de_escalators       TEXT[],
    
    -- Repair
    repair_readiness    JSONB,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_cycle_config UNIQUE (portrait_id)
);

CREATE INDEX idx_cycle_config_user ON negative_cycle_configs(user_id);
```

## 5.6 Partner Guide

```sql
CREATE TABLE partner_guides (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portrait_id         UUID NOT NULL REFERENCES portraits(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content Sections
    how_i_work          JSONB NOT NULL,  -- Array of {insight, explanation}
    when_activated      JSONB NOT NULL,  -- {whatHelps, whatDoesntHelp, whatToSay}
    when_shutdown       JSONB NOT NULL,
    repair_attempts     TEXT[],
    core_messages       JSONB NOT NULL,  -- Array of {message}
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_partner_guide UNIQUE (portrait_id)
);

CREATE INDEX idx_partner_guide_user ON partner_guides(user_id);
```

## 5.7 Detected Patterns

```sql
CREATE TABLE detected_patterns (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portrait_id         UUID NOT NULL REFERENCES portraits(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Pattern Identification
    pattern_key         VARCHAR(100) NOT NULL,
    pattern_category    VARCHAR(50) NOT NULL,  -- 'attachment', 'regulation', 'values', etc.
    
    -- Pattern Data
    description         TEXT NOT NULL,
    interpretation      TEXT NOT NULL,
    confidence          VARCHAR(20) NOT NULL,  -- 'high', 'medium', 'low'
    flags               TEXT[],
    
    -- Priority
    is_priority         BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_pattern UNIQUE (portrait_id, pattern_key)
);

CREATE INDEX idx_patterns_portrait ON detected_patterns(portrait_id);
CREATE INDEX idx_patterns_user ON detected_patterns(user_id);
CREATE INDEX idx_patterns_priority ON detected_patterns(user_id, is_priority) WHERE is_priority = TRUE;
```

---

# 6. Agent & Session Entities

## 6.1 Chat Sessions

```sql
CREATE TYPE session_status AS ENUM (
    'active',
    'completed',
    'abandoned'
);

CREATE TYPE conversation_mode AS ENUM (
    'crisis_support',
    'in_the_moment',
    'processing',
    'skill_building',
    'check_in',
    'exploration'
);

CREATE TABLE chat_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portrait_id         UUID REFERENCES portraits(id),
    
    -- Session Info
    title               VARCHAR(200),  -- Auto-generated or user-set
    status              session_status NOT NULL DEFAULT 'active',
    
    -- Mode Tracking
    initial_mode        conversation_mode,
    modes_used          conversation_mode[],
    
    -- Metrics
    message_count       INTEGER DEFAULT 0,
    user_message_count  INTEGER DEFAULT 0,
    agent_message_count INTEGER DEFAULT 0,
    
    -- Timing
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at     TIMESTAMPTZ,
    ended_at            TIMESTAMPTZ,
    duration_seconds    INTEGER,
    
    -- Outcomes
    patterns_identified TEXT[],
    growth_edges_touched TEXT[],
    interventions_used  TEXT[],
    regulation_successful BOOLEAN,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_sessions_active ON chat_sessions(user_id, status) WHERE status = 'active';
CREATE INDEX idx_sessions_recent ON chat_sessions(user_id, last_message_at DESC);
```

## 6.2 Messages

```sql
CREATE TYPE message_role AS ENUM ('user', 'agent', 'system');

CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    role                message_role NOT NULL,
    content             TEXT NOT NULL,
    
    -- Rich Content
    embedded_cards      JSONB,  -- Portrait references, anchors, etc.
    
    -- Ordering
    sequence_number     INTEGER NOT NULL,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Soft delete for user-deleted messages
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_messages_session ON messages(session_id, sequence_number);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_messages_created ON messages(session_id, created_at);

-- Full-text search on message content
CREATE INDEX idx_messages_search ON messages USING gin(to_tsvector('english', content))
    WHERE deleted_at IS NULL;
```

## 6.3 Message Metadata

```sql
CREATE TABLE message_metadata (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id          UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    
    -- State Detection (for agent messages in response to user)
    detected_state      VARCHAR(20),  -- 'activated', 'shutdown', 'in_window', 'mixed'
    state_confidence    VARCHAR(20),
    state_indicators    JSONB,
    
    -- Mode Detection
    detected_mode       conversation_mode,
    
    -- Pattern Recognition
    patterns_recognized JSONB,  -- Array of recognized patterns
    
    -- Interventions
    interventions_used  TEXT[],
    
    -- Safety
    safety_triggered    BOOLEAN DEFAULT FALSE,
    safety_category     VARCHAR(50),
    
    -- Performance
    response_time_ms    INTEGER,
    tokens_used         INTEGER,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_meta ON message_metadata(message_id);
CREATE INDEX idx_message_meta_safety ON message_metadata(safety_triggered) WHERE safety_triggered = TRUE;
```

## 6.4 Session States

```sql
CREATE TABLE session_states (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    
    -- State History
    state_history       JSONB NOT NULL DEFAULT '[]',  -- Array of states over session
    current_state       VARCHAR(20),
    state_transitions   INTEGER DEFAULT 0,
    
    -- Tracking
    topics_discussed    TEXT[],
    insights_made       JSONB,
    
    -- User Engagement
    engagement_level    VARCHAR(20),  -- 'active', 'minimal', 'disengaged'
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_session_state UNIQUE (session_id)
);

CREATE INDEX idx_session_states ON session_states(session_id);
```

---

# 7. Partner & Sharing Entities

## 7.1 Partnerships

```sql
CREATE TYPE partnership_status AS ENUM (
    'pending',
    'active',
    'disconnected'
);

CREATE TABLE partnerships (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Partners (order doesn't matter)
    user_1_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_2_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Status
    status              partnership_status NOT NULL DEFAULT 'pending',
    
    -- Invitation
    invited_by          UUID NOT NULL REFERENCES users(id),
    invite_token        VARCHAR(100),
    invite_sent_at      TIMESTAMPTZ,
    invite_accepted_at  TIMESTAMPTZ,
    
    -- Disconnection
    disconnected_by     UUID REFERENCES users(id),
    disconnected_at     TIMESTAMPTZ,
    disconnection_reason VARCHAR(100),
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT different_users CHECK (user_1_id != user_2_id),
    CONSTRAINT ordered_users CHECK (user_1_id < user_2_id),  -- Canonical ordering
    CONSTRAINT unique_partnership UNIQUE (user_1_id, user_2_id)
);

CREATE INDEX idx_partnerships_user1 ON partnerships(user_1_id);
CREATE INDEX idx_partnerships_user2 ON partnerships(user_2_id);
CREATE INDEX idx_partnerships_active ON partnerships(status) WHERE status = 'active';
CREATE INDEX idx_partnerships_invite ON partnerships(invite_token) WHERE status = 'pending';
```

## 7.2 Partner Shares

```sql
CREATE TYPE share_scope AS ENUM (
    'partner_guide',
    'attachment_style',
    'cycle_position',
    'growth_edges',
    'anchor_points',
    'full_portrait'
);

CREATE TABLE partner_shares (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partnership_id      UUID NOT NULL REFERENCES partnerships(id) ON DELETE CASCADE,
    
    -- Who is sharing with whom
    sharer_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- What is shared
    share_scope         share_scope NOT NULL,
    
    -- Status
    is_active           BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at          TIMESTAMPTZ,
    
    CONSTRAINT unique_share UNIQUE (partnership_id, sharer_id, share_scope)
);

CREATE INDEX idx_shares_partnership ON partner_shares(partnership_id);
CREATE INDEX idx_shares_sharer ON partner_shares(sharer_id);
CREATE INDEX idx_shares_recipient ON partner_shares(recipient_id);
CREATE INDEX idx_shares_active ON partner_shares(recipient_id, is_active) WHERE is_active = TRUE;
```

## 7.3 Share Access Log

```sql
CREATE TABLE share_access_log (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_id            UUID NOT NULL REFERENCES partner_shares(id) ON DELETE CASCADE,
    
    -- Access Details
    accessed_by         UUID NOT NULL REFERENCES users(id),
    access_type         VARCHAR(50) NOT NULL,  -- 'view', 'export', etc.
    
    -- Context
    ip_address          INET,
    user_agent          TEXT,
    
    -- Timestamp
    accessed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_share_access_share ON share_access_log(share_id);
CREATE INDEX idx_share_access_user ON share_access_log(accessed_by);
CREATE INDEX idx_share_access_time ON share_access_log(accessed_at DESC);
```

---

# 8. Progress & Growth Entities

## 8.1 Growth Tracking

```sql
CREATE TABLE growth_tracking (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Overall Stats
    total_sessions      INTEGER DEFAULT 0,
    total_messages      INTEGER DEFAULT 0,
    
    -- Regulation Stats
    activation_episodes INTEGER DEFAULT 0,
    shutdown_episodes   INTEGER DEFAULT 0,
    regulation_successes INTEGER DEFAULT 0,
    
    -- Session Stats
    average_session_length_seconds INTEGER,
    sessions_this_week  INTEGER DEFAULT 0,
    sessions_this_month INTEGER DEFAULT 0,
    
    -- Streaks
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_session_date   DATE,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_growth_tracking UNIQUE (user_id)
);

CREATE INDEX idx_growth_tracking_user ON growth_tracking(user_id);
```

## 8.2 Growth Edge Progress

```sql
CREATE TABLE growth_edge_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    growth_edge_id      UUID NOT NULL REFERENCES growth_edges(id) ON DELETE CASCADE,
    
    -- Occurrence
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_id          UUID REFERENCES chat_sessions(id),
    
    -- Type
    is_success          BOOLEAN NOT NULL,
    
    -- Context
    description         TEXT,
    context             VARCHAR(200),
    
    -- User Notes
    user_reflection     TEXT,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_edge_progress_user ON growth_edge_progress(user_id);
CREATE INDEX idx_edge_progress_edge ON growth_edge_progress(growth_edge_id);
CREATE INDEX idx_edge_progress_time ON growth_edge_progress(user_id, occurred_at DESC);
CREATE INDEX idx_edge_progress_success ON growth_edge_progress(growth_edge_id, is_success);
```

## 8.3 Pattern Occurrences

```sql
CREATE TABLE pattern_occurrences (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pattern_id          UUID NOT NULL REFERENCES detected_patterns(id),
    
    -- Occurrence
    occurred_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_id          UUID REFERENCES chat_sessions(id),
    
    -- Context
    context             VARCHAR(200),
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pattern_occurrences_user ON pattern_occurrences(user_id);
CREATE INDEX idx_pattern_occurrences_pattern ON pattern_occurrences(pattern_id);
CREATE INDEX idx_pattern_occurrences_time ON pattern_occurrences(user_id, occurred_at DESC);
```

## 8.4 Milestones

```sql
CREATE TABLE milestones (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Milestone Definition (could also be a separate table for milestone types)
    milestone_key       VARCHAR(100) NOT NULL,
    name                VARCHAR(200) NOT NULL,
    description         TEXT NOT NULL,
    icon                VARCHAR(50),
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_milestone_key UNIQUE (milestone_key)
);

CREATE TABLE user_milestones (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    milestone_id        UUID NOT NULL REFERENCES milestones(id),
    
    -- Achievement
    achieved_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Context
    session_id          UUID REFERENCES chat_sessions(id),
    context_data        JSONB,
    
    -- User Engagement
    celebrated          BOOLEAN DEFAULT FALSE,
    celebrated_at       TIMESTAMPTZ,
    
    CONSTRAINT unique_user_milestone UNIQUE (user_id, milestone_id)
);

CREATE INDEX idx_user_milestones_user ON user_milestones(user_id);
CREATE INDEX idx_user_milestones_time ON user_milestones(user_id, achieved_at DESC);
```

## 8.5 Daily Check-ins

```sql
CREATE TABLE daily_checkins (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Check-in Data
    checkin_date        DATE NOT NULL,
    mood_rating         INTEGER,  -- 1-10
    relationship_rating INTEGER,  -- 1-10
    
    -- Optional Notes
    notes               TEXT,
    
    -- Growth Edge Practice
    practiced_growth_edge BOOLEAN,
    growth_edge_id      UUID REFERENCES growth_edges(id),
    practice_notes      TEXT,
    
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_daily_checkin UNIQUE (user_id, checkin_date),
    CONSTRAINT valid_mood CHECK (mood_rating BETWEEN 1 AND 10),
    CONSTRAINT valid_relationship CHECK (relationship_rating BETWEEN 1 AND 10)
);

CREATE INDEX idx_checkins_user ON daily_checkins(user_id);
CREATE INDEX idx_checkins_date ON daily_checkins(user_id, checkin_date DESC);
```

---

# 9. Indexes & Performance

## 9.1 Composite Indexes for Common Queries

```sql
-- User's active portrait with lenses
CREATE INDEX idx_portrait_user_active ON portraits(user_id, status) 
    INCLUDE (snapshot) WHERE status = 'active';

-- Recent sessions with message counts
CREATE INDEX idx_sessions_recent_summary ON chat_sessions(user_id, started_at DESC)
    INCLUDE (title, message_count, status);

-- Growth edge tracking aggregation
CREATE INDEX idx_edge_progress_monthly ON growth_edge_progress(growth_edge_id, occurred_at)
    WHERE occurred_at > NOW() - INTERVAL '30 days';

-- Pattern frequency tracking
CREATE INDEX idx_pattern_frequency ON pattern_occurrences(pattern_id, occurred_at DESC);
```

## 9.2 Partial Indexes

```sql
-- Only active partnerships
CREATE INDEX idx_active_partnerships ON partnerships(user_1_id, user_2_id) 
    WHERE status = 'active';

-- Only non-deleted users
CREATE INDEX idx_active_users ON users(email) 
    WHERE deleted_at IS NULL AND status = 'active';

-- Only completed assessments
CREATE INDEX idx_completed_assessments ON assessments(user_id, completed_at DESC)
    WHERE status = 'completed';

-- Only saved anchors
CREATE INDEX idx_saved_anchors ON anchor_points(user_id, category)
    WHERE is_saved = TRUE;
```

## 9.3 JSON Indexes

```sql
-- Index on attachment style in portrait snapshot
CREATE INDEX idx_snapshot_attachment ON portraits 
    USING gin((snapshot->'attachment'));

-- Index on pattern flags
CREATE INDEX idx_pattern_flags ON detected_patterns 
    USING gin(flags);

-- Index on message embedded cards
CREATE INDEX idx_message_cards ON messages 
    USING gin(embedded_cards) WHERE embedded_cards IS NOT NULL;
```

## 9.4 Full-Text Search Indexes

```sql
-- Search across message content
CREATE INDEX idx_messages_fts ON messages 
    USING gin(to_tsvector('english', content))
    WHERE deleted_at IS NULL;

-- Search across session titles
CREATE INDEX idx_sessions_title_fts ON chat_sessions
    USING gin(to_tsvector('english', title))
    WHERE title IS NOT NULL;
```

---

# 10. Data Lifecycle & Retention

## 10.1 Retention Policies

```sql
-- Create retention policy table
CREATE TABLE data_retention_policies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name          VARCHAR(100) NOT NULL UNIQUE,
    retention_days      INTEGER,  -- NULL = forever
    soft_delete_enabled BOOLEAN DEFAULT TRUE,
    hard_delete_after_days INTEGER,  -- After soft delete
    archive_enabled     BOOLEAN DEFAULT FALSE,
    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default policies
INSERT INTO data_retention_policies (table_name, retention_days, hard_delete_after_days) VALUES
    ('auth_tokens', 90, 7),
    ('share_access_log', 365, 30),
    ('message_metadata', NULL, NULL),  -- Keep forever
    ('messages', NULL, 30),  -- Soft delete forever, hard delete 30 days after
    ('daily_checkins', 730, 90),  -- 2 years, then archive
    ('pattern_occurrences', 730, 90);
```

## 10.2 Soft Delete Implementation

```sql
-- Function to soft delete
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with soft delete
CREATE TRIGGER soft_delete_users
    BEFORE UPDATE OF deleted_at ON users
    FOR EACH ROW
    WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();
```

## 10.3 Data Export (GDPR/CCPA)

```sql
-- View for user data export
CREATE VIEW user_data_export AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.created_at,
    (
        SELECT json_agg(a.*)
        FROM assessments a
        WHERE a.user_id = u.id
    ) as assessments,
    (
        SELECT json_agg(p.*)
        FROM portraits p
        WHERE p.user_id = u.id
    ) as portraits,
    (
        SELECT json_agg(s.*)
        FROM chat_sessions s
        WHERE s.user_id = u.id
    ) as sessions,
    (
        SELECT json_agg(m.*)
        FROM messages m
        WHERE m.user_id = u.id
    ) as messages
FROM users u;

-- Function to export user data
CREATE OR REPLACE FUNCTION export_user_data(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT row_to_json(user_data_export)
    INTO result
    FROM user_data_export
    WHERE id = p_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## 10.4 Data Deletion (GDPR Right to Erasure)

```sql
-- Function to anonymize/delete user data
CREATE OR REPLACE FUNCTION delete_user_data(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Soft delete user
    UPDATE users 
    SET 
        deleted_at = NOW(),
        email = 'deleted_' || id || '@deleted.local',
        first_name = 'Deleted',
        last_name = 'User',
        password_hash = NULL,
        phone = NULL
    WHERE id = p_user_id;
    
    -- Remove from partnerships
    UPDATE partnerships
    SET 
        status = 'disconnected',
        disconnected_at = NOW(),
        disconnection_reason = 'account_deleted'
    WHERE user_1_id = p_user_id OR user_2_id = p_user_id;
    
    -- Revoke all shares
    UPDATE partner_shares
    SET 
        is_active = FALSE,
        revoked_at = NOW()
    WHERE sharer_id = p_user_id OR recipient_id = p_user_id;
    
    -- Note: Related data cascades via ON DELETE CASCADE
    -- or is retained for analytics (anonymized)
END;
$$ LANGUAGE plpgsql;
```

---

# 11. Security & Encryption

## 11.1 Encryption at Rest

```sql
-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypted columns approach (for highly sensitive data)
-- Note: Consider application-level encryption for most cases

-- Example: Encrypting assessment responses
ALTER TABLE assessment_responses 
    ADD COLUMN response_value_encrypted BYTEA;

-- Function to encrypt
CREATE OR REPLACE FUNCTION encrypt_response(p_value JSONB, p_key TEXT)
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(p_value::TEXT, p_key);
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt
CREATE OR REPLACE FUNCTION decrypt_response(p_encrypted BYTEA, p_key TEXT)
RETURNS JSONB AS $$
BEGIN
    RETURN pgp_sym_decrypt(p_encrypted, p_key)::JSONB;
END;
$$ LANGUAGE plpgsql;
```

## 11.2 Row-Level Security

```sql
-- Enable RLS on sensitive tables
ALTER TABLE portraits ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own portraits
CREATE POLICY portraits_user_policy ON portraits
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- Policy: Users can see shared portraits
CREATE POLICY portraits_shared_policy ON portraits
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM partner_shares ps
            JOIN partnerships p ON ps.partnership_id = p.id
            WHERE ps.recipient_id = current_setting('app.current_user_id')::UUID
            AND ps.sharer_id = portraits.user_id
            AND ps.is_active = TRUE
            AND ps.share_scope = 'full_portrait'
        )
    );

-- Policy: Users can only see their own messages
CREATE POLICY messages_user_policy ON messages
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);
```

## 11.3 Audit Logging

```sql
CREATE TABLE audit_log (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who
    user_id             UUID REFERENCES users(id),
    ip_address          INET,
    user_agent          TEXT,
    
    -- What
    action              VARCHAR(50) NOT NULL,  -- 'create', 'read', 'update', 'delete'
    table_name          VARCHAR(100) NOT NULL,
    record_id           UUID,
    
    -- Details
    old_values          JSONB,
    new_values          JSONB,
    
    -- When
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_table ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_time ON audit_log(created_at DESC);

-- Trigger function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    ) VALUES (
        current_setting('app.current_user_id', TRUE)::UUID,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_portraits
    AFTER INSERT OR UPDATE OR DELETE ON portraits
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_partner_shares
    AFTER INSERT OR UPDATE OR DELETE ON partner_shares
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

---

# 12. Migration Strategy

## 12.1 Migration Order

```
PHASE 1: Core Infrastructure
1. users
2. user_preferences
3. auth_tokens

PHASE 2: Assessment System
4. assessments
5. assessment_responses
6. assessment_section_scores

PHASE 3: Portrait System
7. portraits
8. portrait_lenses
9. growth_edges
10. anchor_points
11. negative_cycle_configs
12. partner_guides
13. detected_patterns

PHASE 4: Agent System
14. chat_sessions
15. messages
16. message_metadata
17. session_states

PHASE 5: Partner System
18. partnerships
19. partner_shares
20. share_access_log

PHASE 6: Progress System
21. growth_tracking
22. growth_edge_progress
23. pattern_occurrences
24. milestones
25. user_milestones
26. daily_checkins

PHASE 7: Security & Audit
27. audit_log
28. data_retention_policies
29. Row-level security policies
```

## 12.2 Prisma Schema Example

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserStatus {
  active
  suspended
  deleted
}

enum AuthProvider {
  email
  google
  apple
}

model User {
  id              String    @id @default(uuid())
  email           String    @unique
  emailVerified   Boolean   @default(false)
  firstName       String
  lastName        String?
  displayName     String?
  avatarUrl       String?
  timezone        String    @default("UTC")
  locale          String    @default("en-US")
  passwordHash    String?
  authProvider    AuthProvider @default(email)
  authProviderId  String?
  status          UserStatus @default(active)
  lastActiveAt    DateTime?
  onboardingCompleted Boolean @default(false)
  onboardingStep  String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?

  // Relations
  preferences     UserPreference?
  assessments     Assessment[]
  portraits       Portrait[]
  sessions        ChatSession[]
  messages        Message[]
  growthEdges     GrowthEdge[]
  anchorPoints    AnchorPoint[]
  growthTracking  GrowthTracking?
  
  @@map("users")
}

model Assessment {
  id                String   @id @default(uuid())
  userId            String
  status            String   @default("not_started")
  currentSection    String?
  currentQuestion   Int      @default(0)
  sectionsCompleted String[]
  startedAt         DateTime?
  completedAt       DateTime?
  lastActivityAt    DateTime?
  totalTimeSeconds  Int      @default(0)
  instrumentVersion String   @default("1.0")
  scores            Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  responses         AssessmentResponse[]
  sectionScores     AssessmentSectionScore[]
  portrait          Portrait?

  @@map("assessments")
}

model Portrait {
  id                String   @id @default(uuid())
  userId            String
  assessmentId      String   @unique
  status            String   @default("generating")
  version           Int      @default(1)
  snapshot          Json
  narrative         Json?
  generatedAt       DateTime?
  generationTimeMs  Int?
  algorithmVersion  String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  assessment        Assessment @relation(fields: [assessmentId], references: [id])
  lenses            PortraitLens[]
  growthEdges       GrowthEdge[]
  anchorPoints      AnchorPoint[]
  negativeCycle     NegativeCycleConfig?
  partnerGuide      PartnerGuide?
  patterns          DetectedPattern[]

  @@map("portraits")
}

// ... Continue for all entities
```

## 12.3 Initial Seed Data

```sql
-- Seed milestones
INSERT INTO milestones (milestone_key, name, description, icon) VALUES
    ('first_pattern_recognition', 'Pattern Spotter', 'First time recognizing own pattern in the moment', '🎯'),
    ('regulation_success', 'Back to Center', 'Successfully regulated from activated/shutdown state', '🌊'),
    ('cycle_awareness', 'Cycle Breaker', 'Recognized the negative cycle while it was happening', '🔄'),
    ('growth_edge_win', 'Growth in Action', 'Acted differently in a growth edge moment', '🌱'),
    ('consistent_practice', 'Showing Up', '10 sessions of active engagement', '💪'),
    ('pattern_decrease', 'Breaking the Habit', 'A tracked pattern showing decreasing frequency', '📉'),
    ('first_share', 'Opening Up', 'First time sharing with partner', '💝'),
    ('repair_attempt', 'Bridge Builder', 'Made a successful repair attempt', '🌉'),
    ('30_day_streak', 'Committed', '30 day engagement streak', '🔥'),
    ('portrait_complete', 'Self-Aware', 'Completed assessment and received Portrait', '🪞');
```

---

# APPENDIX A: Table Summary

| Table | Description | Rows (Est.) | Size (Est.) |
|-------|-------------|-------------|-------------|
| users | User accounts | 100K | 50MB |
| user_preferences | Settings | 100K | 20MB |
| auth_tokens | Sessions | 500K | 100MB |
| assessments | Assessment records | 150K | 75MB |
| assessment_responses | Individual answers | 42M | 2GB |
| assessment_section_scores | Computed scores | 900K | 500MB |
| portraits | Generated portraits | 100K | 1GB |
| portrait_lenses | Lens analysis | 400K | 500MB |
| growth_edges | User growth edges | 300K | 200MB |
| anchor_points | Personalized anchors | 500K | 300MB |
| chat_sessions | Conversations | 1M | 500MB |
| messages | Chat messages | 20M | 5GB |
| message_metadata | Message analytics | 20M | 3GB |
| partnerships | Partner connections | 50K | 25MB |
| partner_shares | Sharing permissions | 100K | 50MB |
| growth_tracking | Progress data | 100K | 50MB |
| growth_edge_progress | Progress events | 2M | 500MB |
| milestones | Achievement defs | 20 | 1KB |
| user_milestones | User achievements | 500K | 100MB |
| audit_log | Security audit | 50M | 10GB |

---

# APPENDIX B: Redis Schema

```
# Session Management
session:{session_id}                    -> JSON (user session data)
session:user:{user_id}                  -> SET (active session IDs)

# Rate Limiting
ratelimit:api:{user_id}                 -> Counter with TTL
ratelimit:chat:{user_id}                -> Counter with TTL

# Caching
cache:portrait:{user_id}                -> JSON (active portrait snapshot)
cache:growth_edges:{user_id}            -> JSON (active growth edges)
cache:partner:{user_id}                 -> JSON (partner info if connected)

# Real-time
typing:{session_id}                     -> Boolean with short TTL
presence:{user_id}                      -> Timestamp (last seen)

# Job Queues
queue:portrait_generation               -> List (assessment IDs to process)
queue:notification                      -> List (notifications to send)
queue:analytics                         -> List (events to process)

# Feature Flags
feature:{feature_name}                  -> JSON (feature config)
feature:{feature_name}:users            -> SET (enabled user IDs)
```

---

# APPENDIX C: Backup Strategy

```
BACKUP SCHEDULE:
- Full backup: Daily at 3 AM UTC
- Incremental: Every 6 hours
- Transaction logs: Continuous streaming

RETENTION:
- Daily backups: 30 days
- Weekly backups: 12 weeks
- Monthly backups: 12 months

RECOVERY OBJECTIVES:
- RPO (Recovery Point Objective): 1 hour
- RTO (Recovery Time Objective): 4 hours

TESTING:
- Monthly restore test to staging
- Quarterly full DR drill
```

---

*Document Version 1.0*  
*Database Schema Specification for Couples Relationship App*
