# backend/api/modules/parents/routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, and_
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from ...core.database import get_db
from . import models, schemas

router = APIRouter(prefix="/api/parents", tags=["parents"])

# Helper function to generate parent ID
def generate_parent_id():
    return f"PARENT-{uuid.uuid4().hex[:8].upper()}"

@router.get("/stats", response_model=schemas.ParentStats)
async def get_parent_stats(
    customer_id: str = Query(..., description="Customer ID"),
    db: Session = Depends(get_db)
):
    """Get statistics about parents for a customer"""
    # Base query for this customer
    base_query = db.query(models.Parent).filter(models.Parent.customer_id == customer_id)
    
    # Total parents
    total_parents = base_query.count()
    
    # By status
    status_counts = db.query(
        models.Parent.status,
        func.count(models.Parent.id)
    ).filter(
        models.Parent.customer_id == customer_id
    ).group_by(models.Parent.status).all()
    
    by_status = {status: count for status, count in status_counts}
    
    # By stage
    stage_counts = db.query(
        models.Parent.stage,
        func.count(models.Parent.id)
    ).filter(
        models.Parent.customer_id == customer_id
    ).group_by(models.Parent.stage).all()
    
    by_stage = {stage: count for stage, count in stage_counts}
    
    # By source
    source_counts = db.query(
        models.Parent.source,
        func.count(models.Parent.id)
    ).filter(
        models.Parent.customer_id == customer_id,
        models.Parent.source.isnot(None)
    ).group_by(models.Parent.source).all()
    
    by_source = {source: count for source, count in source_counts}
    
    # Average lead score
    avg_score = db.query(func.avg(models.Parent.lead_score)).filter(
        models.Parent.customer_id == customer_id
    ).scalar() or 0
    
    # High risk count (risk score > 70)
    high_risk_count = base_query.filter(models.Parent.risk_score > 70).count()
    
    # Recent enquiries (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_enquiries = base_query.filter(
        models.Parent.created_at >= seven_days_ago
    ).count()
    
    # Conversion rate (enrolled / total)
    enrolled_count = by_status.get('enrolled', 0)
    conversion_rate = (enrolled_count / total_parents * 100) if total_parents > 0 else 0
    
    return schemas.ParentStats(
        total_parents=total_parents,
        by_status=by_status,
        by_stage=by_stage,
        by_source=by_source,
        average_lead_score=round(avg_score, 1),
        high_risk_count=high_risk_count,
        recent_enquiries_7d=recent_enquiries,
        conversion_rate=round(conversion_rate, 1)
    )

@router.get("/search", response_model=schemas.ParentListResponse)
async def search_parents(
    customer_id: str = Query(..., description="Customer ID"),
    params: schemas.ParentSearchParams = Depends(),
    db: Session = Depends(get_db)
):
    """Search parents with filters and pagination"""
    query = db.query(models.Parent).filter(models.Parent.customer_id == customer_id)
    
    # Text search
    if params.query:
        search_filter = or_(
            models.Parent.name.ilike(f'%{params.query}%'),
            models.Parent.email.ilike(f'%{params.query}%'),
            models.Parent.phone.ilike(f'%{params.query}%'),
            models.Parent.partner_name.ilike(f'%{params.query}%')
        )
        # Also search in children names
        query = query.outerjoin(models.Child).filter(
            or_(search_filter, models.Child.name.ilike(f'%{params.query}%'))
        ).distinct()
    
    # Filters
    if params.status:
        query = query.filter(models.Parent.status == params.status)
    
    if params.stage:
        query = query.filter(models.Parent.stage == params.stage)
    
    if params.source:
        query = query.filter(models.Parent.source == params.source)
    
    if params.min_lead_score is not None:
        query = query.filter(models.Parent.lead_score >= params.min_lead_score)
    
    if params.max_lead_score is not None:
        query = query.filter(models.Parent.lead_score <= params.max_lead_score)
    
    if params.created_after:
        query = query.filter(models.Parent.created_at >= params.created_after)
    
    if params.created_before:
        query = query.filter(models.Parent.created_at <= params.created_before)
    
    if params.tags:
        for tag in params.tags:
            query = query.filter(models.Parent.tags.contains([tag]))
    
    if params.has_children is not None:
        if params.has_children:
            query = query.join(models.Child).distinct()
        else:
            query = query.outerjoin(models.Child).filter(models.Child.id.is_(None))
    
    # Get total count
    total = query.count()
    
    # Sorting
    sort_column = getattr(models.Parent, params.sort_by, models.Parent.created_at)
    if params.sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column)
    
    # Pagination
    query = query.offset((params.page - 1) * params.per_page).limit(params.per_page)
    
    # Execute query with eager loading
    parents = query.options(
        joinedload(models.Parent.children)
    ).all()
    
    # Calculate pages
    pages = (total + params.per_page - 1) // params.per_page
    
    return schemas.ParentListResponse(
        parents=parents,
        total=total,
        page=params.page,
        per_page=params.per_page,
        pages=pages
    )

@router.get("/{parent_id}", response_model=schemas.ParentWithDetails)
async def get_parent(
    parent_id: int,
    customer_id: str = Query(..., description="Customer ID"),
    db: Session = Depends(get_db)
):
    """Get detailed parent information"""
    parent = db.query(models.Parent).filter(
        models.Parent.id == parent_id,
        models.Parent.customer_id == customer_id
    ).options(
        joinedload(models.Parent.children),
        joinedload(models.Parent.notes),
        joinedload(models.Parent.emails),
        joinedload(models.Parent.journey_events)
    ).first()
    
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Get counts
    email_count = db.query(func.count(models.Email.id)).filter(
        models.Email.parent_id == parent_id
    ).scalar()
    
    task_count = db.query(func.count(models.Task.id)).filter(
        models.Task.parent_id == parent_id,
        models.Task.status != 'completed'
    ).scalar()
    
    # Get recent emails (last 10)
    recent_emails = parent.emails[:10] if parent.emails else []
    
    # Get recent notes (last 5)
    recent_notes = sorted(parent.notes, key=lambda x: x.created_at, reverse=True)[:5]
    
    # Get recent journey events (last 10)
    recent_events = sorted(parent.journey_events, key=lambda x: x.event_date, reverse=True)[:10]
    
    # Create response
    parent_dict = parent.__dict__.copy()
    parent_dict['children'] = parent.children
    parent_dict['recent_emails'] = recent_emails
    parent_dict['recent_notes'] = recent_notes
    parent_dict['journey_events'] = recent_events
    parent_dict['email_count'] = email_count
    parent_dict['task_count'] = task_count
    
    return schemas.ParentWithDetails(**parent_dict)

@router.post("/", response_model=schemas.Parent)
async def create_parent(
    parent: schemas.ParentCreate,
    customer_id: str = Query(..., description="Customer ID"),
    db: Session = Depends(get_db)
):
    """Create a new parent and optionally their children"""
    # Generate parent ID
    parent_id = generate_parent_id()
    
    # Create parent
    db_parent = models.Parent(
        **parent.dict(exclude={'children'}),
        parent_id=parent_id,
        customer_id=customer_id,
        first_contact_date=datetime.utcnow().date(),
        last_contact_date=datetime.utcnow().date()
    )
    db.add(db_parent)
    db.flush()  # Get the ID without committing
    
    # Create children if provided
    for child_data in parent.children:
        db_child = models.Child(
            **child_data.dict(),
            parent_id=db_parent.id,
            customer_id=customer_id
        )
        db.add(db_child)
    
    # Create initial journey event
    journey_event = models.JourneyEvent(
        customer_id=customer_id,
        parent_id=db_parent.id,
        event_type='enquiry',
        event_subtype='api_created',
        title='Parent record created',
        description=f'Parent record created via API',
        impact_score=5,
        created_by='SYSTEM'
    )
    db.add(journey_event)
    
    db.commit()
    db.refresh(db_parent)
    
    return db_parent

@router.put("/{parent_id}", response_model=schemas.Parent)
async def update_parent(
    parent_id: int,
    parent_update: schemas.ParentUpdate,
    customer_id: str = Query(..., description="Customer ID"),
    db: Session = Depends(get_db)
):
    """Update parent information"""
    parent = db.query(models.Parent).filter(
        models.Parent.id == parent_id,
        models.Parent.customer_id == customer_id
    ).first()
    
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    # Update fields
    update_data = parent_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(parent, field, value)
    
    parent.last_contact_date = datetime.utcnow().date()
    
    db.commit()
    db.refresh(parent)
    
    return parent

@router.post("/{parent_id}/children", response_model=schemas.Child)
async def add_child(
    parent_id: int,
    child: schemas.ChildCreate,
    customer_id: str = Query(..., description="Customer ID"),
    db: Session = Depends(get_db)
):
    """Add a child to a parent"""
    parent = db.query(models.Parent).filter(
        models.Parent.id == parent_id,
        models.Parent.customer_id == customer_id
    ).first()
    
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    db_child = models.Child(
        **child.dict(),
        parent_id=parent_id,
        customer_id=customer_id
    )
    db.add(db_child)
    db.commit()
    db.refresh(db_child)
    
    return db_child

@router.post("/{parent_id}/notes", response_model=schemas.Note)
async def add_note(
    parent_id: int,
    note: schemas.NoteCreate,
    customer_id: str = Query(..., description="Customer ID"),
    user_id: str = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """Add a note to a parent"""
    parent = db.query(models.Parent).filter(
        models.Parent.id == parent_id,
        models.Parent.customer_id == customer_id
    ).first()
    
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    db_note = models.Note(
        **note.dict(),
        parent_id=parent_id,
        customer_id=customer_id,
        created_by=user_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    return db_note

@router.delete("/{parent_id}")
async def delete_parent(
    parent_id: int,
    customer_id: str = Query(..., description="Customer ID"),
    db: Session = Depends(get_db)
):
    """Delete a parent and all related data"""
    parent = db.query(models.Parent).filter(
        models.Parent.id == parent_id,
        models.Parent.customer_id == customer_id
    ).first()
    
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    
    db.delete(parent)
    db.commit()
    
    return {"message": "Parent deleted successfully"}
