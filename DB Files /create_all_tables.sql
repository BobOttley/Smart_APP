-- Drop tables if they exist (for clean slate)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS scraped_content CASCADE;
DROP TABLE IF EXISTS scraping_jobs CASCADE;
DROP TABLE IF EXISTS personalized_content CASCADE;
DROP TABLE IF EXISTS chatbot_messages CASCADE;
DROP TABLE IF EXISTS chatbot_conversations CASCADE;
DROP TABLE IF EXISTS webhook_logs CASCADE;
DROP TABLE IF EXISTS webhook_configs CASCADE;
DROP TABLE IF EXISTS form_submissions CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS school_events CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS billing_events CASCADE;
DROP TABLE IF EXISTS licenses CASCADE;
DROP TABLE IF EXISTS ml_predictions CASCADE;
DROP TABLE IF EXISTS anonymous_interactions CASCADE;
DROP TABLE IF EXISTS ab_tests CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS url_mappings CASCADE;
DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS journey_events CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS emails CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create tables
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    school_type VARCHAR(50),
    website VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'Europe/London',
    country VARCHAR(100),
    region VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    subscription_tier VARCHAR(50),
    onboarded_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    secondary_email VARCHAR(255),
    secondary_phone VARCHAR(50),
    partner_name VARCHAR(255),
    address JSONB,
    status VARCHAR(50) DEFAULT 'lead',
    stage VARCHAR(50) DEFAULT 'awareness',
    source VARCHAR(100),
    source_detail VARCHAR(255),
    lead_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    risk_score INTEGER DEFAULT 0,
    preferred_contact_method VARCHAR(20),
    preferred_contact_time VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_contact_date DATE,
    last_contact_date DATE
);

CREATE TABLE children (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    name VARCHAR(255) NOT NULL,
    dob DATE,
    current_year_group VARCHAR(50),
    target_year_group VARCHAR(50),
    current_school VARCHAR(255),
    interests TEXT,
    special_requirements TEXT,
    assessment_scores JSONB,
    sibling_ids INTEGER[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    email_id VARCHAR(255) UNIQUE,
    thread_id VARCHAR(255),
    direction VARCHAR(10),
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    cc_addresses TEXT[],
    subject VARCHAR(500),
    body TEXT,
    body_plain TEXT,
    sentiment_score DECIMAL(3,2),
    sentiment_label VARCHAR(20),
    categories TEXT[],
    intent VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'unread',
    replied_at TIMESTAMP,
    response_time_minutes INTEGER,
    template_used VARCHAR(100),
    personalization_data JSONB,
    ab_test_variant VARCHAR(50),
    created_by VARCHAR(50),
    date_sent TIMESTAMP,
    date_received TIMESTAMP,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    template_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    subject VARCHAR(500),
    body TEXT,
    category VARCHAR(50),
    stage VARCHAR(50),
    trigger_conditions JSONB,
    personalization_fields TEXT[],
    performance_metrics JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journey_events (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    event_type VARCHAR(50),
    event_subtype VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    sentiment_before DECIMAL(3,2),
    sentiment_after DECIMAL(3,2),
    impact_score INTEGER,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    assigned_to VARCHAR(50) REFERENCES users(user_id),
    title VARCHAR(255),
    description TEXT,
    task_type VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3,2),
    ai_reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    content TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general',
    created_by VARCHAR(50) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE knowledge_base (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    kb_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500),
    content TEXT,
    content_type VARCHAR(50),
    source_url VARCHAR(500),
    category VARCHAR(100),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    version INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT TRUE,
    approved BOOLEAN DEFAULT TRUE,
    approved_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_verified TIMESTAMP
);

CREATE TABLE url_mappings (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    phrase VARCHAR(255),
    url VARCHAR(500),
    context VARCHAR(100),
    priority INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    user_id VARCHAR(50),
    event_name VARCHAR(100),
    event_category VARCHAR(50),
    event_data JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ab_tests (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    test_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    hypothesis TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    variants JSONB,
    metrics JSONB,
    targeting_rules JSONB,
    results JSONB,
    winner VARCHAR(50),
    confidence_level DECIMAL(3,2),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE anonymous_interactions (
    id SERIAL PRIMARY KEY,
    interaction_hash VARCHAR(64) UNIQUE NOT NULL,
    school_type VARCHAR(50),
    region VARCHAR(100),
    journey_stage VARCHAR(50),
    parent_persona VARCHAR(100),
    enquiry_month INTEGER,
    enquiry_day_of_week INTEGER,
    initial_sentiment DECIMAL(3,2),
    sentiment_trajectory JSONB,
    touchpoint_sequence JSONB,
    response_times JSONB,
    concerns JSONB,
    interests JSONB,
    outcome VARCHAR(50),
    days_to_outcome INTEGER,
    conversion_factors JSONB,
    loss_factors JSONB,
    total_interactions INTEGER,
    email_count INTEGER,
    call_count INTEGER,
    visit_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ml_predictions (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    model_name VARCHAR(100),
    model_version VARCHAR(20),
    prediction_type VARCHAR(50),
    prediction_value JSONB,
    confidence DECIMAL(3,2),
    features_used JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE licenses (
    id SERIAL PRIMARY KEY,
    license_id VARCHAR(100) UNIQUE NOT NULL,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    status VARCHAR(20) DEFAULT 'active',
    plan_id VARCHAR(50),
    plan_name VARCHAR(100),
    billing_cycle VARCHAR(20),
    price_amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'GBP',
    user_limit INTEGER,
    current_users INTEGER DEFAULT 0,
    modules_included JSONB,
    usage_limits JSONB,
    current_usage JSONB DEFAULT '{}',
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    trial_ends_at TIMESTAMP,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE billing_events (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    event_type VARCHAR(50),
    stripe_event_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2),
    currency VARCHAR(3),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    document_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    type VARCHAR(50),
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    uploaded_by VARCHAR(50) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE school_events (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    event_type VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location VARCHAR(255),
    capacity INTEGER,
    current_registrations INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT TRUE,
    registration_deadline TIMESTAMP,
    target_year_groups TEXT[],
    metadata JSONB DEFAULT '{}',
    webhook_sync BOOLEAN DEFAULT FALSE,
    external_id VARCHAR(255),
    created_by VARCHAR(50) REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES school_events(id),
    parent_id INTEGER REFERENCES parents(id),
    child_ids INTEGER[],
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(20) DEFAULT 'registered',
    notes TEXT
);

CREATE TABLE form_submissions (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    submission_id VARCHAR(100) UNIQUE NOT NULL,
    form_source VARCHAR(100),
    form_data JSONB,
    extracted_data JSONB,
    parent_id INTEGER REFERENCES parents(id),
    processing_status VARCHAR(20) DEFAULT 'pending',
    processing_error TEXT,
    submitted_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhook_configs (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    webhook_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    type VARCHAR(50),
    url VARCHAR(500),
    secret VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    headers JSONB DEFAULT '{}',
    retry_config JSONB DEFAULT '{"max_retries": 3, "backoff_multiplier": 
2}',
    last_triggered TIMESTAMP,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhook_logs (
    id SERIAL PRIMARY KEY,
    webhook_id INTEGER REFERENCES webhook_configs(id),
    request_id VARCHAR(100),
    payload JSONB,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot_conversations (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    conversation_id VARCHAR(100) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES parents(id),
    session_id VARCHAR(255),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    escalated BOOLEAN DEFAULT FALSE,
    escalation_reason VARCHAR(255),
    sentiment_score DECIMAL(3,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES chatbot_conversations(id),
    message_type VARCHAR(20),
    message TEXT,
    intent VARCHAR(100),
    entities JSONB,
    confidence DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personalized_content (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    parent_id INTEGER REFERENCES parents(id),
    content_type VARCHAR(50),
    template_id VARCHAR(100),
    personalization_data JSONB,
    generated_content TEXT,
    content_url VARCHAR(500),
    engagement_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE scraping_jobs (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    job_id VARCHAR(100) UNIQUE NOT NULL,
    url VARCHAR(500),
    scraper_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    pages_scraped INTEGER DEFAULT 0,
    pages_failed INTEGER DEFAULT 0,
    error_log TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scraped_content (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES scraping_jobs(id),
    url VARCHAR(500),
    title VARCHAR(500),
    content TEXT,
    content_hash VARCHAR(64),
    metadata JSONB DEFAULT '{}',
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    role VARCHAR(50),
    resource VARCHAR(100),
    actions TEXT[],
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, role, resource)
);

CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    user_id VARCHAR(50),
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(customer_id),
    user_id VARCHAR(50) REFERENCES users(user_id),
    type VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'normal',
    title VARCHAR(255),
    message TEXT,
    action_url VARCHAR(500),
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_customer ON users(customer_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_parents_customer ON parents(customer_id);
CREATE INDEX idx_parents_email ON parents(email);
CREATE INDEX idx_parents_status ON parents(status);
CREATE INDEX idx_parents_stage ON parents(stage);
CREATE INDEX idx_parents_created ON parents(created_at);
CREATE INDEX idx_children_parent ON children(parent_id);
CREATE INDEX idx_children_customer ON children(customer_id);
CREATE INDEX idx_emails_customer ON emails(customer_id);
CREATE INDEX idx_emails_parent ON emails(parent_id);
CREATE INDEX idx_emails_thread ON emails(thread_id);
CREATE INDEX idx_emails_date ON emails(date_received);
CREATE INDEX idx_emails_sentiment ON emails(sentiment_score);
CREATE INDEX idx_templates_customer ON email_templates(customer_id);
CREATE INDEX idx_templates_category ON email_templates(category);
CREATE INDEX idx_journey_customer ON journey_events(customer_id);
CREATE INDEX idx_journey_parent ON journey_events(parent_id);
CREATE INDEX idx_journey_date ON journey_events(event_date);
CREATE INDEX idx_journey_type ON journey_events(event_type);
CREATE INDEX idx_tasks_customer ON tasks(customer_id);
CREATE INDEX idx_tasks_parent ON tasks(parent_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_notes_parent ON notes(parent_id);
CREATE INDEX idx_kb_customer ON knowledge_base(customer_id);
CREATE INDEX idx_kb_category ON knowledge_base(category);
CREATE INDEX idx_kb_current ON knowledge_base(is_current);
CREATE INDEX idx_url_customer ON url_mappings(customer_id);
CREATE INDEX idx_url_phrase ON url_mappings(phrase);
CREATE INDEX idx_analytics_customer ON analytics_events(customer_id);
CREATE INDEX idx_analytics_parent ON analytics_events(parent_id);
CREATE INDEX idx_analytics_event ON analytics_events(event_name);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);
CREATE INDEX idx_ab_customer ON ab_tests(customer_id);
CREATE INDEX idx_ab_status ON ab_tests(status);
CREATE INDEX idx_anon_school_type ON anonymous_interactions(school_type);
CREATE INDEX idx_anon_outcome ON anonymous_interactions(outcome);
CREATE INDEX idx_anon_persona ON anonymous_interactions(parent_persona);
CREATE INDEX idx_ml_customer ON ml_predictions(customer_id);
CREATE INDEX idx_ml_parent ON ml_predictions(parent_id);
CREATE INDEX idx_ml_type ON ml_predictions(prediction_type);
CREATE INDEX idx_licenses_customer ON licenses(customer_id);
CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_period_end ON licenses(current_period_end);
CREATE INDEX idx_billing_customer ON billing_events(customer_id);
CREATE INDEX idx_billing_type ON billing_events(event_type);
CREATE INDEX idx_documents_customer ON documents(customer_id);
CREATE INDEX idx_documents_parent ON documents(parent_id);
CREATE INDEX idx_events_customer ON school_events(customer_id);
CREATE INDEX idx_events_date ON school_events(start_date);
CREATE INDEX idx_events_type ON school_events(event_type);
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_parent ON event_registrations(parent_id);
CREATE INDEX idx_forms_customer ON form_submissions(customer_id);
CREATE INDEX idx_forms_status ON form_submissions(processing_status);
CREATE INDEX idx_forms_date ON form_submissions(submitted_at);
CREATE INDEX idx_webhooks_customer ON webhook_configs(customer_id);
CREATE INDEX idx_webhooks_type ON webhook_configs(type);
CREATE INDEX idx_webhook_logs_webhook ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_date ON webhook_logs(created_at);
CREATE INDEX idx_chatbot_customer ON chatbot_conversations(customer_id);
CREATE INDEX idx_chatbot_parent ON chatbot_conversations(parent_id);
CREATE INDEX idx_chatbot_msg_conversation ON 
chatbot_messages(conversation_id);
CREATE INDEX idx_personalized_customer ON 
personalized_content(customer_id);
CREATE INDEX idx_personalized_parent ON personalized_content(parent_id);
CREATE INDEX idx_personalized_type ON personalized_content(content_type);
CREATE INDEX idx_scraping_customer ON scraping_jobs(customer_id);
CREATE INDEX idx_scraping_status ON scraping_jobs(status);
CREATE INDEX idx_scraped_job ON scraped_content(job_id);
CREATE INDEX idx_scraped_processed ON scraped_content(processed);
CREATE INDEX idx_audit_customer ON audit_log(customer_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_date ON audit_log(created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Composite indexes
CREATE INDEX idx_parents_customer_status ON parents(customer_id, status);
CREATE INDEX idx_emails_parent_date ON emails(parent_id, date_received 
DESC);
CREATE INDEX idx_journey_parent_date ON journey_events(parent_id, 
event_date DESC);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON 
email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON 
knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_school_events_updated_at BEFORE UPDATE ON 
school_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhook_configs_updated_at BEFORE UPDATE ON 
webhook_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'All tables created successfully!';
END $$;
