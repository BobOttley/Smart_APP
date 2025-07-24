-- Smart Education Platform - Comprehensive Test Data
-- This creates realistic test data for all tables

-- Clear existing data (be careful in production!)
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE audit_log CASCADE;
TRUNCATE TABLE role_permissions CASCADE;
TRUNCATE TABLE scraped_content CASCADE;
TRUNCATE TABLE scraping_jobs CASCADE;
TRUNCATE TABLE personalized_content CASCADE;
TRUNCATE TABLE chatbot_messages CASCADE;
TRUNCATE TABLE chatbot_conversations CASCADE;
TRUNCATE TABLE webhook_logs CASCADE;
TRUNCATE TABLE webhook_configs CASCADE;
TRUNCATE TABLE form_submissions CASCADE;
TRUNCATE TABLE event_registrations CASCADE;
TRUNCATE TABLE school_events CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE billing_events CASCADE;
TRUNCATE TABLE licenses CASCADE;
TRUNCATE TABLE ml_predictions CASCADE;
TRUNCATE TABLE anonymous_interactions CASCADE;
TRUNCATE TABLE ab_tests CASCADE;
TRUNCATE TABLE analytics_events CASCADE;
TRUNCATE TABLE url_mappings CASCADE;
TRUNCATE TABLE knowledge_base CASCADE;
TRUNCATE TABLE notes CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE journey_events CASCADE;
TRUNCATE TABLE email_templates CASCADE;
TRUNCATE TABLE emails CASCADE;
TRUNCATE TABLE children CASCADE;
TRUNCATE TABLE parents CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE customers CASCADE;

-- Insert test customers (schools)
INSERT INTO customers (customer_id, name, school_type, website, country, 
region, subscription_tier, status, onboarded_at) VALUES
('SCHOOL-001', 'St. Mary''s Academy', 'independent', 
'https://stmarys.edu', 'UK', 'London', 'enterprise', 'active', 
'2024-01-15'),
('SCHOOL-002', 'Westfield Preparatory School', 'independent', 
'https://westfieldprep.edu', 'UK', 'Surrey', 'professional', 'active', 
'2024-02-20'),
('SCHOOL-003', 'International School of London', 'international', 
'https://islondon.edu', 'UK', 'London', 'enterprise', 'active', 
'2024-03-10'),
('SCHOOL-004', 'Brighton Grammar School', 'independent', 
'https://brightongrammar.edu', 'UK', 'Brighton', 'starter', 'active', 
'2024-04-05'),
('SCHOOL-005', 'Demo School', 'independent', 'https://demo.edu', 'UK', 
'London', 'enterprise', 'trial', CURRENT_TIMESTAMP);

-- Insert test users (staff members)
INSERT INTO users (user_id, customer_id, email, name, role, status, 
last_login) VALUES
-- St. Mary's Academy staff
('USER-001', 'SCHOOL-001', 'admin@stmarys.edu', 'Sarah Johnson', 'admin', 
'active', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('USER-002', 'SCHOOL-001', 'admissions@stmarys.edu', 'Emma Wilson', 
'staff', 'active', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('USER-003', 'SCHOOL-001', 'registrar@stmarys.edu', 'Michael Brown', 
'staff', 'active', CURRENT_TIMESTAMP - INTERVAL '3 days'),
-- Westfield Prep staff
('USER-004', 'SCHOOL-002', 'head@westfieldprep.edu', 'David Smith', 
'admin', 'active', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('USER-005', 'SCHOOL-002', 'admissions@westfieldprep.edu', 'Lisa Chen', 
'staff', 'active', CURRENT_TIMESTAMP),
-- Demo School staff
('USER-100', 'SCHOOL-005', 'demo@smarteducation.com', 'Demo User', 
'admin', 'active', CURRENT_TIMESTAMP);

-- Insert test parents (mix of stages and statuses)
INSERT INTO parents (customer_id, parent_id, name, email, phone, 
partner_name, status, stage, source, lead_score, engagement_score, 
risk_score, created_at, first_contact_date, last_contact_date, tags) 
VALUES
-- St. Mary's Academy parents
('SCHOOL-001', 'PARENT-001', 'Robert & Jessica Williams', 
'jessica.williams@email.com', '+44 7700 900123', 'Robert Williams', 
'enrolled', 'enrolled', 'website', 95, 90, 5, '2024-01-20', '2024-01-20', 
CURRENT_DATE - INTERVAL '2 days', ARRAY['high-value', 'responsive']),
('SCHOOL-001', 'PARENT-002', 'Michael Thompson', 
'michael.thompson@email.com', '+44 7700 900124', NULL, 'offer_made', 
'evaluation', 'referral', 85, 80, 10, '2024-02-15', '2024-02-15', 
CURRENT_DATE - INTERVAL '1 day', ARRAY['urgent', 'scholarship']),
('SCHOOL-001', 'PARENT-003', 'Sarah & James Chen', 'sarah.chen@email.com', 
'+44 7700 900125', 'James Chen', 'applicant', 'intent', 'event', 75, 85, 
15, '2024-03-10', '2024-03-10', CURRENT_DATE - INTERVAL '3 days', 
ARRAY['international', 'stem-focus']),
('SCHOOL-001', 'PARENT-004', 'Emily Davis', 'emily.davis@email.com', '+44 
7700 900126', NULL, 'warm', 'consideration', 'website', 65, 70, 20, 
'2024-04-05', '2024-04-05', CURRENT_DATE - INTERVAL '5 days', 
ARRAY['single-parent', 'bursary']),
('SCHOOL-001', 'PARENT-005', 'David & Anna Martinez', 
'anna.martinez@email.com', '+44 7700 900127', 'David Martinez', 'lead', 
'interest', 'agent', 45, 50, 30, '2024-05-01', '2024-05-01', CURRENT_DATE 
- INTERVAL '7 days', ARRAY['relocating', 'siblings']),
('SCHOOL-001', 'PARENT-006', 'John Brown', 'john.brown@email.com', '+44 
7700 900128', NULL, 'lost', 'awareness', 'website', 25, 20, 80, 
'2024-01-15', '2024-01-15', '2024-02-01', ARRAY['competitor-enrolled']),
('SCHOOL-001', 'PARENT-007', 'Lisa Anderson', 'lisa.anderson@email.com', 
'+44 7700 900129', NULL, 'lead', 'awareness', 'social_media', 35, 40, 60, 
CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days', 
CURRENT_DATE - INTERVAL '2 days', ARRAY['first-contact']),
('SCHOOL-001', 'PARENT-008', 'Peter & Claire Jones', 
'claire.jones@email.com', '+44 7700 900130', 'Peter Jones', 'warm', 
'consideration', 'referral', 70, 75, 25, '2024-03-20', '2024-03-20', 
CURRENT_DATE - INTERVAL '1 day', ARRAY['visited', 'positive-feedback']),
('SCHOOL-001', 'PARENT-009', 'Mohammed Al-Rashid', 
'mohammed.rashid@email.com', '+44 7700 900131', NULL, 'applicant', 
'evaluation', 'agent', 80, 85, 10, '2024-02-25', '2024-02-25', 
CURRENT_DATE, ARRAY['international', 'premium']),
('SCHOOL-001', 'PARENT-010', 'Sophie Laurent', 'sophie.laurent@email.com', 
'+44 7700 900132', NULL, 'lead', 'interest', 'website', 55, 60, 35, 
CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '10 days', 
CURRENT_DATE - INTERVAL '4 days', ARRAY['french-speaking', 
'arts-interest']);

-- Insert more parents for other schools
INSERT INTO parents (customer_id, parent_id, name, email, phone, status, 
stage, source, lead_score, created_at) VALUES
-- Westfield Prep parents
('SCHOOL-002', 'PARENT-011', 'Alexander & Maria Petrov', 
'maria.petrov@email.com', '+44 7700 900133', 'enrolled', 'enrolled', 
'website', 90, '2024-02-01'),
('SCHOOL-002', 'PARENT-012', 'Richard Taylor', 'richard.taylor@email.com', 
'+44 7700 900134', 'applicant', 'intent', 'event', 75, '2024-03-15'),
('SCHOOL-002', 'PARENT-013', 'Jennifer White', 'jennifer.white@email.com', 
'+44 7700 900135', 'warm', 'consideration', 'referral', 65, '2024-04-10'),
-- Demo School parents
('SCHOOL-005', 'PARENT-100', 'Demo Parent', 'demo.parent@email.com', '+44 
7700 900200', 'lead', 'interest', 'website', 50, CURRENT_TIMESTAMP);

-- Insert children
INSERT INTO children (parent_id, customer_id, name, dob, 
current_year_group, target_year_group, current_school, interests, 
special_requirements) VALUES
-- Williams family children
(1, 'SCHOOL-001', 'Emma Williams', '2015-03-15', 'Year 4', 'Year 5', 
'Local Primary School', 'Swimming, Art, Reading', NULL),
(1, 'SCHOOL-001', 'Oliver Williams', '2017-09-22', 'Year 2', 'Year 3', 
'Local Primary School', 'Football, Lego, Science', 'Mild dyslexia - needs 
reading support'),
-- Thompson child
(2, 'SCHOOL-001', 'Sophie Thompson', '2014-06-10', 'Year 5', 'Year 6', 
'Riverside School', 'Mathematics, Chess, Coding', 'Gifted & Talented 
program candidate'),
-- Chen children
(3, 'SCHOOL-001', 'Lucas Chen', '2016-11-08', 'Year 3', 'Year 4', 
'International School Beijing', 'Languages, Music, Swimming', 'EAL support 
needed'),
(3, 'SCHOOL-001', 'Lily Chen', '2018-04-20', 'Reception', 'Year 1', 
'International School Beijing', 'Dance, Drawing', 'EAL support needed'),
-- Davis child
(4, 'SCHOOL-001', 'Charlotte Davis', '2015-08-30', 'Year 4', 'Year 5', 
'St. Andrews Primary', 'Drama, Creative Writing', NULL),
-- Martinez children
(5, 'SCHOOL-001', 'Carlos Martinez', '2013-12-05', 'Year 6', 'Year 7', 
'Barcelona International', 'Football, Science, Robotics', 'Spanish first 
language'),
(5, 'SCHOOL-001', 'Isabella Martinez', '2016-02-18', 'Year 3', 'Year 4', 
'Barcelona International', 'Art, Dance, Reading', 'Spanish first 
language'),
-- More children for other families
(7, 'SCHOOL-001', 'Zoe Anderson', '2017-07-14', 'Year 2', 'Year 3', NULL, 
'Gymnastics, Music', NULL),
(8, 'SCHOOL-001', 'Thomas Jones', '2015-10-25', 'Year 4', 'Year 5', 
'Village Primary', 'Rugby, Maths, Technology', NULL),
(8, 'SCHOOL-001', 'Grace Jones', '2013-05-12', 'Year 6', 'Year 7', 
'Village Primary', 'Netball, Science, Art', 'Considering scholarship'),
(9, 'SCHOOL-001', 'Amir Al-Rashid', '2014-09-03', 'Year 5', 'Year 6', 
'Dubai British School', 'STEM subjects, Robotics', 'Advanced in 
mathematics'),
(10, 'SCHOOL-001', 'Amelie Laurent', '2016-01-28', 'Year 3', 'Year 4', 
'Lycée Français', 'Ballet, Languages, Art', 'Bilingual French/English');

-- Insert email templates
INSERT INTO email_templates (customer_id, template_id, name, subject, 
body, category, stage, status) VALUES
('SCHOOL-001', 'TMPL-001', 'Initial Enquiry Response', 'Thank you for your 
interest in St. Mary''s Academy', 'Dear {parent_name},\n\nThank you for 
your enquiry about St. Mary''s Academy. We''re delighted to hear of your 
interest in our school.\n\nI''d be happy to discuss how we can support 
{child_name}''s educational journey. Our next open day is on 
{open_day_date}, and I''d love to invite you to visit.\n\nBest 
regards,\n{staff_name}', 'enquiry_response', 'interest', 'active'),
('SCHOOL-001', 'TMPL-002', 'Visit Follow-up', 'Following your visit to St. 
Mary''s Academy', 'Dear {parent_name},\n\nIt was wonderful to meet you and 
{child_name} during your visit yesterday. I hope you found the tour 
informative and enjoyable.\n\n{child_name} seemed particularly interested 
in our {facility_interest}, which is fantastic!\n\nIf you have any 
questions following your visit, please don''t hesitate to reach 
out.\n\nWarm regards,\n{staff_name}', 'follow_up', 'consideration', 
'active'),
('SCHOOL-001', 'TMPL-003', 'Application Reminder', 'Application Deadline 
Reminder - St. Mary''s Academy', 'Dear {parent_name},\n\nI wanted to 
remind you that the application deadline for {academic_year} entry is 
approaching on {deadline_date}.\n\nWe''re very interested in welcoming 
{child_name} to our community. If you need any assistance with the 
application process, please let me know.\n\nBest wishes,\n{staff_name}', 
'reminder', 'intent', 'active');

-- Insert emails (mix of inbound and outbound)
INSERT INTO emails (customer_id, parent_id, email_id, thread_id, 
direction, from_address, to_address, subject, body, sentiment_score, 
sentiment_label, status, date_received, created_at) VALUES
-- Williams family email thread
('SCHOOL-001', 1, 'EMAIL-001', 'THREAD-001', 'inbound', 
'jessica.williams@email.com', 'admissions@stmarys.edu', 'Enquiry about 
Year 5 entry', 'Hello,\n\nWe are looking for a school for our daughter 
Emma who will be entering Year 5 in September. We''ve heard wonderful 
things about St. Mary''s Academy.\n\nCould you please send us information 
about the admissions process and arrange a visit?\n\nBest 
regards,\nJessica Williams', 0.8, 'positive', 'replied', '2024-01-20 
10:30:00', '2024-01-20 10:30:00'),
('SCHOOL-001', 1, 'EMAIL-002', 'THREAD-001', 'outbound', 
'admissions@stmarys.edu', 'jessica.williams@email.com', 'Re: Enquiry about 
Year 5 entry', 'Dear Mrs. Williams,\n\nThank you for your interest in St. 
Mary''s Academy. We would be delighted to welcome you for a 
visit.\n\nI''ve attached our prospectus and the available tour dates for 
this month. Our Year 5 program focuses on developing independent learning 
skills while maintaining our nurturing environment.\n\nWould Tuesday 28th 
January at 10am work for you?\n\nBest regards,\nEmma Wilson\nAdmissions 
Team', 0.9, 'positive', 'read', '2024-01-20 14:15:00', '2024-01-20 
14:15:00'),
('SCHOOL-001', 1, 'EMAIL-003', 'THREAD-001', 'inbound', 
'jessica.williams@email.com', 'admissions@stmarys.edu', 'Re: Enquiry about 
Year 5 entry', 'Perfect! Tuesday 28th works wonderfully for us. We''ll 
bring both Emma and her younger brother Oliver.\n\nLooking forward to 
it!\n\nJessica', 0.9, 'positive', 'read', '2024-01-20 16:45:00', 
'2024-01-20 16:45:00'),

-- Thompson urgent email
('SCHOOL-001', 2, 'EMAIL-004', 'THREAD-002', 'inbound', 
'michael.thompson@email.com', 'admissions@stmarys.edu', 'URGENT: 
Scholarship application query', 'Hi,\n\nMy daughter Sophie is extremely 
gifted in mathematics (top 1% nationally). Do you offer academic 
scholarships for Year 6 entry?\n\nWe need to make a decision by next week 
as we have offers from other schools.\n\nPlease call me urgently on 07700 
900124.\n\nMichael Thompson', 0.6, 'neutral', 'replied', CURRENT_DATE - 
INTERVAL '1 day' + TIME '09:00:00', CURRENT_DATE - INTERVAL '1 day'),

-- Chen family emails
('SCHOOL-001', 3, 'EMAIL-005', 'THREAD-003', 'inbound', 
'sarah.chen@email.com', 'admissions@stmarys.edu', 'International 
relocation - September entry', 'Dear Admissions Team,\n\nWe are relocating 
from Beijing to London in August. Our children Lucas (Year 4) and Lily 
(Year 1) currently attend an international school.\n\nBoth children are 
bilingual (Mandarin/English) but may need some initial language support. 
Could you advise on:\n1. Your EAL support program\n2. The admissions 
process for international families\n3. Whether places are still available 
for September\n\nThank you,\nSarah Chen', 0.7, 'positive', 'replied', 
'2024-03-10 11:20:00', '2024-03-10 11:20:00'),

-- Davis bursary enquiry
('SCHOOL-001', 4, 'EMAIL-006', 'THREAD-004', 'inbound', 
'emily.davis@email.com', 'admissions@stmarys.edu', 'Bursary information 
needed', 'Hello,\n\nI''m a single parent and would love my daughter 
Charlotte to attend St. Mary''s. However, I''m concerned about the 
fees.\n\nDo you offer bursaries or payment plans? Charlotte is a bright 
child who would really benefit from your school.\n\nKind regards,\nEmily 
Davis', 0.5, 'neutral', 'replied', '2024-04-05 15:30:00', '2024-04-05 
15:30:00'),

-- Recent emails
('SCHOOL-001', 7, 'EMAIL-007', 'THREAD-005', 'inbound', 
'lisa.anderson@email.com', 'admissions@stmarys.edu', 'First time parent - 
lots of questions!', 'Hi there!\n\nI''m completely new to the private 
school system and feeling a bit overwhelmed. My daughter Zoe is currently 
in Year 2 at our local state school.\n\nI have SO many questions:\n- What 
makes St. Mary''s different?\n- How do you handle the transition from 
state schools?\n- What are the class sizes?\n- Do you have after-school 
care?\n- What about holidays/childcare?\n\nSorry for all the questions! 
When can we visit?\n\nLisa', 0.6, 'neutral', 'pending', CURRENT_DATE - 
INTERVAL '2 days' + TIME '19:45:00', CURRENT_DATE - INTERVAL '2 days'),

('SCHOOL-001', 8, 'EMAIL-008', 'THREAD-006', 'inbound', 
'claire.jones@email.com', 'admissions@stmarys.edu', 'Following our 
wonderful visit', 'Dear Emma,\n\nThank you so much for the wonderful tour 
yesterday! Both Peter and I were incredibly impressed, and more 
importantly, Thomas and Grace loved it.\n\nGrace is particularly excited 
about your science labs and Thomas can''t stop talking about the rugby 
pitch!\n\nWe''d like to proceed with applications for both children. Could 
you send the application forms?\n\nBest wishes,\nClaire Jones', 0.95, 
'positive', 'replied', CURRENT_DATE - INTERVAL '1 day' + TIME '20:30:00', 
CURRENT_DATE - INTERVAL '1 day');

-- Insert journey events
INSERT INTO journey_events (customer_id, parent_id, event_type, 
event_subtype, title, description, sentiment_before, sentiment_after, 
impact_score, created_by, event_date) VALUES
-- Williams family journey
('SCHOOL-001', 1, 'enquiry', 'website_form', 'Initial website enquiry', 
'Submitted enquiry form for Year 5 entry', NULL, 0.8, 8, 'SYSTEM', 
'2024-01-20 10:30:00'),
('SCHOOL-001', 1, 'email_sent', 'auto_response', 'Automated acknowledgment 
sent', 'Thank you for your enquiry email sent', 0.8, 0.8, 3, 'SYSTEM', 
'2024-01-20 10:31:00'),
('SCHOOL-001', 1, 'email_sent', 'personal', 'Personal response from Emma', 
'Detailed response with tour invitation', 0.8, 0.9, 9, 'USER-002', 
'2024-01-20 14:15:00'),
('SCHOOL-001', 1, 'visit', 'school_tour', 'Family tour completed', 'Toured 
with both children, very positive', 0.9, 0.95, 10, 'USER-002', '2024-01-28 
10:00:00'),
('SCHOOL-001', 1, 'application', 'submitted', 'Application received', 
'Applications for both Emma and Oliver', 0.95, 0.95, 9, 'SYSTEM', 
'2024-02-05 16:20:00'),
('SCHOOL-001', 1, 'offer', 'made', 'Offers extended', 'Places offered to 
both children', 0.95, 1.0, 10, 'USER-002', '2024-02-20 09:00:00'),
('SCHOOL-001', 1, 'enrollment', 'confirmed', 'Enrollment confirmed', 
'Deposits paid, places secured', 1.0, 1.0, 10, 'USER-003', '2024-02-25 
14:30:00'),

-- Thompson journey (urgent)
('SCHOOL-001', 2, 'enquiry', 'email', 'Urgent scholarship enquiry', 
'Parent asking about academic scholarships', NULL, 0.6, 7, 'SYSTEM', 
CURRENT_DATE - INTERVAL '1 day' + TIME '09:00:00'),
('SCHOOL-001', 2, 'call', 'outbound', 'Urgent callback made', 'Called 
parent to discuss scholarship options', 0.6, 0.8, 9, 'USER-002', 
CURRENT_DATE - INTERVAL '1 day' + TIME '11:00:00'),
('SCHOOL-001', 2, 'email_sent', 'follow_up', 'Scholarship information 
sent', 'Detailed scholarship criteria and application sent', 0.8, 0.85, 8, 
'USER-002', CURRENT_DATE - INTERVAL '1 day' + TIME '14:00:00'),

-- Chen family journey
('SCHOOL-001', 3, 'enquiry', 'email', 'International family enquiry', 
'Relocating from Beijing, needs EAL info', NULL, 0.7, 8, 'SYSTEM', 
'2024-03-10 11:20:00'),
('SCHOOL-001', 3, 'email_sent', 'detailed_response', 'EAL program details 
sent', 'Comprehensive response about language support', 0.7, 0.8, 8, 
'USER-002', '2024-03-10 15:45:00'),
('SCHOOL-001', 3, 'call', 'scheduled', 'Video call scheduled', 
'International video tour arranged', 0.8, 0.85, 9, 'USER-002', '2024-03-12 
10:00:00'),
('SCHOOL-001', 3, 'visit', 'virtual_tour', 'Virtual tour completed', 
'Excellent virtual tour, family very engaged', 0.85, 0.9, 9, 'USER-002', 
'2024-03-15 10:00:00'),
('SCHOOL-001', 3, 'application', 'submitted', 'Applications received', 
'Both children applied', 0.9, 0.9, 9, 'SYSTEM', '2024-03-20 08:30:00');

-- Insert tasks
INSERT INTO tasks (customer_id, parent_id, assigned_to, title, 
description, task_type, priority, status, due_date, ai_generated, 
ai_confidence, ai_reasoning) VALUES
-- Urgent tasks
('SCHOOL-001', 2, 'USER-002', 'Send scholarship application to Thompson 
family', 'Mr. Thompson needs scholarship info urgently - competing 
offers', 'send_docs', 'urgent', 'pending', CURRENT_DATE + INTERVAL '1 
day', true, 0.95, 'High-value prospect with urgent deadline, competing 
offers mentioned'),
('SCHOOL-001', 4, 'USER-002', 'Call Emily Davis about bursary options', 
'Single parent concerned about fees - high conversion potential if we can 
help', 'call', 'high', 'pending', CURRENT_DATE + INTERVAL '2 days', true, 
0.88, 'Sentiment analysis shows financial concern is only barrier'),
('SCHOOL-001', 7, 'USER-002', 'Respond to Lisa Anderson questions', 
'First-time parent with many questions - needs reassuring response', 
'follow_up', 'high', 'pending', CURRENT_DATE + INTERVAL '1 day', true, 
0.82, 'New to private education - high touch needed'),

-- Regular tasks
('SCHOOL-001', 3, 'USER-002', 'Prepare EAL assessment for Chen children', 
'Schedule language assessments before September', 'assessment', 'normal', 
'pending', '2024-08-15', false, NULL, NULL),
('SCHOOL-001', 8, 'USER-003', 'Send application forms to Jones family', 
'Very positive visit - strike while iron is hot', 'send_docs', 'high', 
'completed', CURRENT_DATE, true, 0.91, 'Post-visit sentiment very high - 
quick follow-up critical'),
('SCHOOL-001', 9, 'USER-002', 'Schedule assessment for Amir Al-Rashid', 
'Academic assessment needed for Year 6 entry', 'assessment', 'normal', 
'pending', CURRENT_DATE + INTERVAL '7 days', false, NULL, NULL),
('SCHOOL-001', 10, 'USER-002', 'French language tour for Laurent family', 
'Arrange French-speaking guide for visit', 'visit', 'normal', 'pending', 
CURRENT_DATE + INTERVAL '5 days', true, 0.76, 'Language preference noted - 
personalized experience will help');

-- Insert notes
INSERT INTO notes (customer_id, parent_id, content, note_type, created_by, 
created_at) VALUES
('SCHOOL-001', 1, 'Excellent family - both children very polite and 
engaged during visit. Parents asked good questions about our STEM 
program.', 'visit_feedback', 'USER-002', '2024-01-28 11:00:00'),
('SCHOOL-001', 1, 'Deposit received. Family very happy with offers. Mother 
mentioned they chose us over competitor due to our pastoral care 
approach.', 'enrollment', 'USER-003', '2024-02-25 14:45:00'),
('SCHOOL-001', 2, 'Father is MD at tech company. Daughter has won national 
math competitions. Very keen on academic rigor.', 'background', 
'USER-002', CURRENT_DATE - INTERVAL '1 day' + TIME '11:30:00'),
('SCHOOL-001', 3, 'Currently at Beijing British School. Father works for 
multinational, definite relocation in August. Need to ensure smooth 
transition.', 'background', 'USER-002', '2024-03-10 16:00:00'),
('SCHOOL-001', 4, 'Mother is a nurse (NHS). Genuinely interested but 
worried about finances. Worth exploring all bursary options.', 
'financial', 'USER-002', '2024-04-05 16:00:00'),
('SCHOOL-001', 8, 'Children loved Mr. Patterson (Head of Sport). Grace 
spent ages in science lab. Thomas already planning rugby trials!', 
'visit_feedback', 'USER-002', CURRENT_DATE - INTERVAL '1 day' + TIME 
'11:00:00');

-- Insert knowledge base entries
INSERT INTO knowledge_base (customer_id, kb_id, title, content, 
content_type, source_url, category, tags, is_current, approved) VALUES
('SCHOOL-001', 'KB-001', 'School Fees 2024-2025', 'Year 1-2: £15,000 per 
annum\nYear 3-4: £16,500 per annum\nYear 5-6: £17,500 per annum\nYear 7-8: 
£19,000 per annum\n\nPayment plans available. Sibling discount: 10% for 
second child, 15% for third.', 'manual_entry', NULL, 'fees', ARRAY['fees', 
'costs', 'payment'], true, true),
('SCHOOL-001', 'KB-002', 'Bursary Program', 'St. Mary''s Academy offers 
means-tested bursaries up to 100% of fees. Applications assessed on 
financial need and child''s potential contribution to school community. 
Average bursary: 40% of fees.', 'webpage', 
'https://stmarys.edu/bursaries', 'financial_aid', ARRAY['bursary', 
'financial aid', 'scholarships'], true, true),
('SCHOOL-001', 'KB-003', 'Academic Scholarships', 'Academic scholarships 
available for exceptional students:\n- Up to 50% of fees\n- Assessed 
through entrance exams\n- Maintained with consistent academic 
performance\n- Available from Year 5 upward', 'manual_entry', NULL, 
'scholarships', ARRAY['scholarship', 'academic', 'gifted'], true, true),
('SCHOOL-001', 'KB-004', 'EAL Support Program', 'Comprehensive English as 
Additional Language support:\n- Small group sessions\n- One-to-one support 
available\n- Integrated with mainstream curriculum\n- No additional 
charge\n- Average time to full fluency: 18 months', 'webpage', 
'https://stmarys.edu/eal-support', 'support_services', ARRAY['EAL', 'ESL', 
'language support', 'international'], true, true),
('SCHOOL-001', 'KB-005', 'Wrap-around Care', 'Breakfast Club: 7:30am - 
8:30am (£5/day)\nAfter School Care: 3:30pm - 6:00pm (£15/day)\nHoliday 
Club: 8:00am - 6:00pm (£45/day)\n\nAll supervised by qualified staff with 
activities and homework support.', 'manual_entry', NULL, 'childcare', 
ARRAY['childcare', 'after school', 'breakfast club', 'holiday care'], 
true, true);

-- Insert URL mappings
INSERT INTO url_mappings (customer_id, phrase, url, context, priority) 
VALUES
('SCHOOL-001', 'fees', 'https://stmarys.edu/fees', 'general', 10),
('SCHOOL-001', 'bursary', 'https://stmarys.edu/bursaries', 'financial', 
10),
('SCHOOL-001', 'scholarship', 'https://stmarys.edu/scholarships', 
'financial', 10),
('SCHOOL-001', 'open day', 'https://stmarys.edu/visit', 'visit', 10),
('SCHOOL-001', 'uniform', 'https://stmarys.edu/uniform', 'practical', 5),
('SCHOOL-001', 'term dates', 'https://stmarys.edu/calendar', 'practical', 
5);

-- Insert licenses
INSERT INTO licenses (license_id, customer_id, status, plan_id, plan_name, 
billing_cycle, price_amount, currency, user_limit, current_users, 
modules_included, usage_limits, current_usage, trial_ends_at, 
current_period_start, current_period_end) VALUES
('LIC-001', 'SCHOOL-001', 'active', 'enterprise_annual', 'Enterprise', 
'annual', 4999.00, 'GBP', 50, 3, '["inbox", "smart_reply", "crm", 
"analytics", "kb", "events"]', '{"emails_per_month": 50000, "storage_gb": 
500}', '{"emails_this_month": 1250, "storage_gb": 45}', NULL, 
'2024-01-15', '2025-01-15'),
('LIC-002', 'SCHOOL-002', 'active', 'professional_monthly', 
'Professional', 'monthly', 499.00, 'GBP', 10, 2, '["inbox", "smart_reply", 
"crm", "kb"]', '{"emails_per_month": 5000, "storage_gb": 50}', 
'{"emails_this_month": 325, "storage_gb": 8}', NULL, '2024-07-01', 
'2024-08-01'),
('LIC-003', 'SCHOOL-003', 'active', 'enterprise_annual', 'Enterprise', 
'annual', 4999.00, 'GBP', 100, 5, '["inbox", "smart_reply", "crm", 
"analytics", "kb", "events"]', '{"emails_per_month": 100000, "storage_gb": 
1000}', '{"emails_this_month": 2890, "storage_gb": 125}', NULL, 
'2024-03-10', '2025-03-10'),
('LIC-004', 'SCHOOL-004', 'active', 'starter_monthly', 'Starter', 
'monthly', 199.00, 'GBP', 3, 1, '["inbox", "smart_reply"]', 
'{"emails_per_month": 1000, "storage_gb": 10}', '{"emails_this_month": 
145, "storage_gb": 2}', NULL, '2024-07-05', '2024-08-05'),
('LIC-005', 'SCHOOL-005', 'trial', 'enterprise_annual', 'Enterprise 
Trial', 'annual', 0.00, 'GBP', 10, 1, '["inbox", "smart_reply", "crm", 
"analytics", "kb", "events"]', '{"emails_per_month": 1000, "storage_gb": 
10}', '{"emails_this_month": 0, "storage_gb": 0}', CURRENT_DATE + INTERVAL 
'14 days', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days');

-- Insert school events
INSERT INTO school_events (customer_id, event_id, title, description, 
event_type, start_date, end_date, location, capacity, 
current_registrations, target_year_groups, created_by) VALUES
('SCHOOL-001', 'EVENT-001', 'Spring Open Morning', 'Tour the school and 
meet our teachers. Perfect for families considering September 2024 
entry.', 'open_day', CURRENT_DATE + INTERVAL '14 days' + TIME '09:30:00', 
CURRENT_DATE + INTERVAL '14 days' + TIME '12:00:00', 'Main School 
Building', 50, 38, ARRAY['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 
4', 'Year 5', 'Year 6'], 'USER-002'),
('SCHOOL-001', 'EVENT-002', 'Year 7 Taster Day', 'Experience a day in the 
life of a Year 7 student. Includes sample lessons and lunch.', 
'taster_day', CURRENT_DATE + INTERVAL '21 days' + TIME '08:30:00', 
CURRENT_DATE + INTERVAL '21 days' + TIME '15:30:00', 'Senior School', 30, 
22, ARRAY['Year 6'], 'USER-002'),
('SCHOOL-001', 'EVENT-003', 'Scholarship Assessment Day', 'Academic 
scholarship assessments for Year 5 and Year 7 entry.', 'assessment', 
CURRENT_DATE + INTERVAL '28 days' + TIME '09:00:00', CURRENT_DATE + 
INTERVAL '28 days' + TIME '16:00:00', 'Exam Hall', 60, 45, ARRAY['Year 4', 
'Year 6'], 'USER-001');

-- Insert event registrations
INSERT INTO event_registrations (event_id, parent_id, child_ids, 
registration_date, attendance_status) VALUES
(1, 7, ARRAY[9], CURRENT_DATE - INTERVAL '5 days', 'registered'),
(1, 8, ARRAY[10, 11], CURRENT_DATE - INTERVAL '3 days', 'registered'),
(1, 10, ARRAY[13], CURRENT_DATE - INTERVAL '1 day', 'registered'),
(2, 3, ARRAY[4], CURRENT_DATE - INTERVAL '7 days', 'registered'),
(3, 2, ARRAY[3], CURRENT_DATE - INTERVAL '10 days', 'registered'),
(3, 9, ARRAY[12], CURRENT_DATE - INTERVAL '8 days', 'registered');

-- Insert form submissions
INSERT INTO form_submissions (customer_id, submission_id, form_source, 
form_data, parent_id, processing_status, submitted_at, processed_at) 
VALUES
('SCHOOL-001', 'FORM-001', 'website_enquiry', '{"name": "Jessica 
Williams", "email": "jessica.williams@email.com", "phone": "07700900123", 
"child_name": "Emma Williams", "year_group": "Year 5", "message": "Looking 
for Year 5 entry"}', 1, 'processed', '2024-01-20 10:30:00', '2024-01-20 
10:31:00'),
('SCHOOL-001', 'FORM-002', 'event_registration', '{"parent_name": "Lisa 
Anderson", "email": "lisa.anderson@email.com", "event": "Spring Open 
Morning", "children": ["Zoe Anderson"], "dietary": "None"}', 7, 
'processed', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 
days' + INTERVAL '1 hour'),
('SCHOOL-001', 'FORM-003', 'callback_request', '{"name": "New Parent", 
"phone": "07700900999", "preferred_time": "Morning", "urgency": "high", 
"topic": "Fees and bursaries"}', NULL, 'pending', CURRENT_DATE - INTERVAL 
'2 hours', NULL);

-- Insert webhook configs
INSERT INTO webhook_configs (customer_id, webhook_id, name, type, url, 
secret, active, last_triggered, success_count, failure_count) VALUES
('SCHOOL-001', 'WEBHOOK-001', 'Website Form Handler', 'enquiry_form', 
'https://stmarys.edu/api/form-webhook', 'secret_key_123', true, 
CURRENT_DATE - INTERVAL '2 hours', 156, 2),
('SCHOOL-001', 'WEBHOOK-002', 'Calendar Sync', 'event_sync', 
'https://stmarys.edu/api/calendar-webhook', 'secret_key_456', true, 
CURRENT_DATE - INTERVAL '1 day', 45, 0),
('SCHOOL-001', 'WEBHOOK-003', 'Chatbot Integration', 'chatbot', 
'https://stmarys.edu/api/chatbot-webhook', 'secret_key_789', false, 
'2024-06-15', 0, 0);

-- Insert A/B tests
INSERT INTO ab_tests (customer_id, test_id, name, hypothesis, status, 
variants, metrics, start_date, end_date) VALUES
('SCHOOL-001', 'TEST-001', 'Email Subject Line - Urgency', 'Adding 
deadline to subject line will increase open rates', 'completed', '[{"id": 
"control", "name": "Standard subject", "weight": 0.5}, {"id": "variant", 
"name": "Subject with deadline", "weight": 0.5}]', '["open_rate", 
"click_rate", "response_rate"]', '2024-06-01', '2024-06-30'),
('SCHOOL-001', 'TEST-002', 'Welcome Email Personalization', 'Mentioning 
specific child interests will increase engagement', 'running', '[{"id": 
"control", "name": "Generic welcome", "weight": 0.5}, {"id": "variant", 
"name": "Personalized interests", "weight": 0.5}]', '["open_rate", 
"click_rate", "sentiment_change"]', '2024-07-01', NULL);

-- Insert analytics events
INSERT INTO analytics_events (customer_id, parent_id, user_id, event_name, 
event_category, event_data, created_at) VALUES
('SCHOOL-001', 1, 'USER-002', 'email_sent', 'communication', '{"template": 
"TMPL-001", "personalized": true}', '2024-01-20 14:15:00'),
('SCHOOL-001', 1, 'USER-002', 'tour_scheduled', 'engagement', '{"date": 
"2024-01-28", "type": "family_tour"}', '2024-01-20 14:20:00'),
('SCHOOL-001', 2, 'USER-002', 'high_priority_flag', 'automation', 
'{"reason": "scholarship_deadline", "ai_confidence": 0.95}', CURRENT_DATE 
- INTERVAL '1 day'),
('SCHOOL-001', 8, NULL, 'sentiment_improved', 'tracking', '{"from": 0.7, 
"to": 0.95, "after_event": "school_visit"}', CURRENT_DATE - INTERVAL '1 
day');

-- Insert anonymous interactions (for ML training)
INSERT INTO anonymous_interactions (interaction_hash, school_type, region, 
journey_stage, parent_persona, enquiry_month, enquiry_day_of_week, 
initial_sentiment, sentiment_trajectory, outcome, days_to_outcome, 
total_interactions, email_count, visit_count) VALUES
('hash_001', 'independent', 'London', 'enrolled', 'quality_focused', 1, 2, 
0.8, '[0.8, 0.85, 0.9, 0.95, 0.95, 1.0]', 'enrolled', 36, 12, 7, 1),
('hash_002', 'independent', 'London', 'evaluation', 'value_conscious', 3, 
4, 0.6, '[0.6, 0.7, 0.75, 0.8, 0.85]', 'pending', NULL, 8, 5, 1),
('hash_003', 'independent', 'Surrey', 'interest', 'academic_focused', 2, 
1, 0.7, '[0.7, 0.8, 0.85, 0.9]', 'enrolled', 45, 15, 9, 2),
('hash_004', 'independent', 'London', 'awareness', 'first_time_parent', 4, 
5, 0.5, '[0.5, 0.6, 0.65]', 'lost', 21, 5, 3, 0),
('hash_005', 'international', 'London', 'intent', 'international_family', 
3, 3, 0.75, '[0.75, 0.8, 0.85, 0.9]', 'enrolled', 60, 18, 10, 1);

-- Insert sample ML predictions
INSERT INTO ml_predictions (customer_id, parent_id, model_name, 
model_version, prediction_type, prediction_value, confidence, 
features_used, created_at) VALUES
('SCHOOL-001', 2, 'enrollment_predictor', 'v2.1', 
'enrollment_probability', '{"probability": 0.78, "factors": 
["scholarship_interest", "urgency", "competing_offers"]}', 0.85, 
'{"sentiment": 0.6, "urgency_words": 3, "competitor_mentioned": true}', 
CURRENT_DATE - INTERVAL '1 day'),
('SCHOOL-001', 7, 'next_best_action', 'v1.5', 'recommended_action', 
'{"action": "personal_call", "reason": 
"first_time_parent_needs_reassurance"}', 0.82, '{"days_since_contact": 2, 
"questions_asked": 7, "sentiment": 0.6}', CURRENT_DATE),
('SCHOOL-001', 8, 'conversion_predictor', 'v2.1', 'conversion_likelihood', 
'{"likelihood": "very_high", "probability": 0.92}', 0.89, 
'{"visit_sentiment": 0.95, "family_visit": true, "children_engaged": 
true}', CURRENT_DATE - INTERVAL '1 day');

-- Insert notifications
INSERT INTO notifications (customer_id, user_id, type, priority, title, 
message, action_url, created_at, expires_at) VALUES
('SCHOOL-001', 'USER-002', 'task_due', 'high', 'Urgent: Thompson 
scholarship deadline', 'Michael Thompson needs scholarship information 
today - competing offers', '/parents/PARENT-002', CURRENT_DATE, 
CURRENT_DATE + INTERVAL '1 day'),
('SCHOOL-001', 'USER-002', 'parent_at_risk', 'medium', 'Follow up needed: 
Lisa Anderson', 'No response to initial enquiry for 2 days', 
'/parents/PARENT-007', CURRENT_DATE - INTERVAL '1 hour', CURRENT_DATE + 
INTERVAL '2 days'),
('SCHOOL-001', 'USER-001', 'system', 'low', 'Monthly usage report 
available', 'Your July usage report is ready to view', 
'/analytics/reports', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + 
INTERVAL '7 days');

-- Insert audit log entries
INSERT INTO audit_log (customer_id, user_id, action, resource_type, 
resource_id, changes, ip_address, created_at) VALUES
('SCHOOL-001', 'USER-002', 'parent.updated', 'parent', 'PARENT-001', 
'{"status": {"from": "applicant", "to": "enrolled"}}', '192.168.1.100', 
'2024-02-25 14:30:00'),
('SCHOOL-001', 'USER-002', 'email.sent', 'email', 'EMAIL-002', 
'{"template": "TMPL-001", "personalized": true}', '192.168.1.100', 
'2024-01-20 14:15:00'),
('SCHOOL-001', 'USER-001', 'settings.updated', 'system', 'email_config', 
'{"smtp_server": {"from": "old.smtp.com", "to": "new.smtp.com"}}', 
'192.168.1.50', CURRENT_DATE - INTERVAL '7 days');

-- Summary
SELECT 'Data load complete!' as message;
SELECT 'Parents created:' as metric, COUNT(*) as count FROM parents
UNION ALL
SELECT 'Children created:', COUNT(*) FROM children
UNION ALL
SELECT 'Emails created:', COUNT(*) FROM emails
UNION ALL
SELECT 'Journey events created:', COUNT(*) FROM journey_events
UNION ALL
SELECT 'Tasks created:', COUNT(*) FROM tasks
UNION ALL
SELECT 'Knowledge base entries:', COUNT(*) FROM knowledge_base;

