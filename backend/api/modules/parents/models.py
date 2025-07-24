# backend/api/modules/parents/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean, JSON, ARRAY, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from api.core.database import Base

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    school_type = Column(String(50))
    website = Column(String(255))
    timezone = Column(String(50), default='Europe/London')
    country = Column(String(100))
    region = Column(String(100))
    status = Column(String(20), default='active')
    subscription_tier = Column(String(50))
    meta_data = Column(JSON, default={})
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="customer")
    parents = relationship("Parent", back_populates="customer")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(50), unique=True, nullable=False)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"))
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255))
    role = Column(String(50))
    status = Column(String(20), default='active')
    last_login = Column(DateTime)
    preferences = Column(JSON, default={})
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    customer = relationship("Customer", back_populates="users")

class Parent(Base):
    __tablename__ = "parents"
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"))
    parent_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255))
    phone = Column(String(50))
    secondary_email = Column(String(255))
    secondary_phone = Column(String(50))
    partner_name = Column(String(255))
    address = Column(JSON)
    status = Column(String(50), default='lead')
    stage = Column(String(50), default='awareness')
    source = Column(String(100))
    source_detail = Column(String(255))
    lead_score = Column(Integer, default=0)
    engagement_score = Column(Integer, default=0)
    risk_score = Column(Integer, default=0)
    preferred_contact_method = Column(String(20))
    preferred_contact_time = Column(String(50))
    language = Column(String(10), default='en')
    tags = Column(ARRAY(Text))
    custom_fields = Column(JSON, default={})
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    first_contact_date = Column(Date)
    last_contact_date = Column(Date)
    
    # Relationships
    customer = relationship("Customer", back_populates="parents")
    children = relationship("Child", back_populates="parent", cascade="all, delete-orphan")
    emails = relationship("Email", back_populates="parent")
    journey_events = relationship("JourneyEvent", back_populates="parent")
    tasks = relationship("Task", back_populates="parent")
    notes = relationship("Note", back_populates="parent")

class Child(Base):
    __tablename__ = "children"
    
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey("parents.id", ondelete="CASCADE"))
    customer_id = Column(String(50), ForeignKey("customers.customer_id"))
    name = Column(String(255), nullable=False)
    dob = Column(Date)
    current_year_group = Column(String(50))
    target_year_group = Column(String(50))
    current_school = Column(String(255))
    interests = Column(Text)
    special_requirements = Column(Text)
    assessment_scores = Column(JSON)
    sibling_ids = Column(ARRAY(Integer))
    notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    parent = relationship("Parent", back_populates="children")

class Email(Base):
    __tablename__ = "emails"
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"))
    parent_id = Column(Integer, ForeignKey("parents.id"))
    email_id = Column(String(255), unique=True)
    thread_id = Column(String(255))
    direction = Column(String(10))
    from_address = Column(String(255))
    to_address = Column(String(255))
    subject = Column(String(500))
    body = Column(Text)
    body_plain = Column(Text)
    sentiment_score = Column(Float)
    sentiment_label = Column(String(20))
    status = Column(String(20), default='unread')
    date_received = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    parent = relationship("Parent", back_populates="emails")

class JourneyEvent(Base):
    __tablename__ = "journey_events"
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"))
    parent_id = Column(Integer, ForeignKey("parents.id"))
    event_type = Column(String(50))
    event_subtype = Column(String(50))
    title = Column(String(255))
    description = Column(Text)
    meta_data = Column(JSON, default={})
    sentiment_before = Column(Float)
    sentiment_after = Column(Float)
    impact_score = Column(Integer)
    created_by = Column(String(50))
    event_date = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    parent = relationship("Parent", back_populates="journey_events")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"))
    parent_id = Column(Integer, ForeignKey("parents.id"))
    assigned_to = Column(String(50), ForeignKey("users.user_id"))
    title = Column(String(255))
    description = Column(Text)
    task_type = Column(String(50))
    priority = Column(String(20), default='normal')
    status = Column(String(20), default='pending')
    due_date = Column(DateTime)
    completed_at = Column(DateTime)
    ai_generated = Column(Boolean, default=False)
    ai_confidence = Column(Float)
    ai_reasoning = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    parent = relationship("Parent", back_populates="tasks")

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"))
    parent_id = Column(Integer, ForeignKey("parents.id"))
    content = Column(Text, nullable=False)
    note_type = Column(String(50), default='general')
    created_by = Column(String(50), ForeignKey("users.user_id"))
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    parent = relationship("Parent", back_populates="notes")
