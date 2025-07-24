# backend/api/modules/parents/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

class ParentStatus(str, Enum):
    lead = "lead"
    warm = "warm"
    applicant = "applicant"
    offer_made = "offer_made"
    enrolled = "enrolled"
    lost = "lost"
    alumni = "alumni"

class ParentStage(str, Enum):
    awareness = "awareness"
    interest = "interest"
    consideration = "consideration"
    intent = "intent"
    evaluation = "evaluation"
    enrolled = "enrolled"

# Child Schemas
class ChildBase(BaseModel):
    name: str
    dob: Optional[date] = None
    current_year_group: Optional[str] = None
    target_year_group: Optional[str] = None
    current_school: Optional[str] = None
    interests: Optional[str] = None
    special_requirements: Optional[str] = None

class ChildCreate(ChildBase):
    pass

class ChildUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[date] = None
    current_year_group: Optional[str] = None
    target_year_group: Optional[str] = None
    current_school: Optional[str] = None
    interests: Optional[str] = None
    special_requirements: Optional[str] = None

class Child(ChildBase):
    id: int
    parent_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Note Schemas
class NoteBase(BaseModel):
    content: str
    note_type: str = "general"

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    parent_id: int
    created_by: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Email Summary Schema
class EmailSummary(BaseModel):
    id: int
    subject: Optional[str]
    from_address: str
    direction: str
    sentiment_score: Optional[float]
    sentiment_label: Optional[str]
    date_received: datetime
    status: str
    
    class Config:
        from_attributes = True

# Journey Event Schema
class JourneyEventSummary(BaseModel):
    id: int
    event_type: str
    event_subtype: Optional[str]
    title: str
    description: Optional[str]
    event_date: datetime
    impact_score: Optional[int]
    
    class Config:
        from_attributes = True

# Parent Schemas
class ParentBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    secondary_email: Optional[EmailStr] = None
    secondary_phone: Optional[str] = None
    partner_name: Optional[str] = None
    address: Optional[Dict[str, Any]] = None
    status: ParentStatus = ParentStatus.lead
    stage: ParentStage = ParentStage.awareness
    source: Optional[str] = None
    source_detail: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    preferred_contact_time: Optional[str] = None
    language: str = "en"
    tags: Optional[List[str]] = []
    custom_fields: Optional[Dict[str, Any]] = {}

class ParentCreate(ParentBase):
    children: Optional[List[ChildCreate]] = []

class ParentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    secondary_email: Optional[EmailStr] = None
    secondary_phone: Optional[str] = None
    partner_name: Optional[str] = None
    address: Optional[Dict[str, Any]] = None
    status: Optional[ParentStatus] = None
    stage: Optional[ParentStage] = None
    source: Optional[str] = None
    source_detail: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    preferred_contact_time: Optional[str] = None
    language: Optional[str] = None
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None

class Parent(ParentBase):
    id: int
    parent_id: str
    customer_id: str
    lead_score: int
    engagement_score: int
    risk_score: int
    created_at: datetime
    updated_at: datetime
    first_contact_date: Optional[date]
    last_contact_date: Optional[date]
    
    class Config:
        from_attributes = True

class ParentWithDetails(Parent):
    children: List[Child] = []
    recent_emails: List[EmailSummary] = []
    recent_notes: List[Note] = []
    journey_events: List[JourneyEventSummary] = []
    email_count: int = 0
    task_count: int = 0
    
    class Config:
        from_attributes = True

# Search/Filter Schemas
class ParentSearchParams(BaseModel):
    query: Optional[str] = None
    status: Optional[ParentStatus] = None
    stage: Optional[ParentStage] = None
    min_lead_score: Optional[int] = Field(None, ge=0, le=100)
    max_lead_score: Optional[int] = Field(None, ge=0, le=100)
    tags: Optional[List[str]] = None
    source: Optional[str] = None
    created_after: Optional[date] = None
    created_before: Optional[date] = None
    has_children: Optional[bool] = None
    page: int = Field(1, ge=1)
    per_page: int = Field(20, ge=1, le=100)
    sort_by: str = "created_at"
    sort_order: str = "desc"

class ParentListResponse(BaseModel):
    parents: List[Parent]
    total: int
    page: int
    per_page: int
    pages: int

# Stats Schema
class ParentStats(BaseModel):
    total_parents: int
    by_status: Dict[str, int]
    by_stage: Dict[str, int]
    by_source: Dict[str, int]
    average_lead_score: float
    high_risk_count: int
    recent_enquiries_7d: int
    conversion_rate: float