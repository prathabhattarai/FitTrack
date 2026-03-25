# Gym Automation System Blueprint

## Role-based Flow Logic

1. Start
2. Register (member only) or Login (admin/member)
3. Validate credentials using JWT endpoint
4. Read role from token/user payload
5. Redirect:
   - admin -> Admin Dashboard
   - member -> Member Dashboard
6. Perform CRUD/actions
7. Logout -> clear token -> return to login

## Entity Relationship Summary

- User 1:1 AdminProfile
- User 1:1 MemberProfile
- MembershipPlan 1:M MemberProfile
- MemberProfile 1:M Payment
- MembershipPlan 1:M Payment
- MemberProfile 1:M Attendance
- MemberProfile 1:M Booking
- Trainer 1:M Booking
- MemberProfile 1:M WorkoutSchedule
- Trainer 1:M WorkoutSchedule
- WorkoutVideo standalone (content library)

## Backend Deliverables

- models.py with all entities
- serializers.py for auth + all modules
- views.py with CRUD viewsets + BMI API
- urls.py with router and auth endpoints
- mysql_schema.sql for direct SQL representation
- API_ENDPOINTS.md for endpoint list

## Frontend Deliverables (Reference)

- Role-based routes
- Sidebar for admin/member
- Login with role redirect
- Dashboard samples
- API integration service with JWT header
- Theme provider for dark/light mode

## Academic Extension Ideas

- Add charts on admin dashboard using Recharts.
- Add pagination + search query params.
- Add payment gateway simulation (status transitions).
- Add file upload for trainer/member profile pictures.
