# MENCAS Admin Dashboard

A comprehensive Laravel-based admin dashboard system for educational institution management.

## Features

### Dashboard Overview
- **Total Statistics**: Students, Faculty, Departments, and Courses count
- **Interactive Charts**: 
  - Student enrollment trends over the years
  - Students per course distribution
  - Faculty per department breakdown
- **Quick Actions**: Direct access to common tasks
- **Recent Reports**: Quick access to generated reports

### Faculty Management
- **Add/Edit/Archive** faculty members
- **Advanced Filtering**: By department and status
- **Search Functionality**: Search by name, email, or employee ID
- **Faculty Information**: Employee ID, contact details, position, salary, department assignment

### Reports System
- **Students by Course**: Enrollment statistics for each course
- **Faculty by Department**: Faculty distribution across departments
- **Enrollment Trends**: Historical enrollment data analysis
- **Export Capabilities**: Generate PDF reports (ready for implementation)

### System Settings
- **Department Management**: Create and manage academic departments
- **Course Management**: Manage courses with department associations
- **Academic Year Management**: Set up and manage academic calendar

### Profile Management
- **Edit Profile**: Update personal information
- **Change Password**: Secure password update functionality
- **Avatar Support**: Profile picture upload (ready for implementation)

## Database Structure

### Tables
- **users**: Admin users with role-based access
- **departments**: Academic departments
- **courses**: Course catalog with department relationships
- **faculty**: Faculty member information
- **students**: Student records
- **enrollments**: Student-course enrollment relationships
- **academic_years**: Academic calendar management

## Installation & Setup

### Prerequisites
- PHP 8.0 or higher
- Composer
- Node.js & NPM
- MySQL or compatible database

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mencas-laravel-app
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**
   - Configure database connection in `.env`
   - Run migrations and seeders:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Compile Assets**
   ```bash
   npm run dev
   ```

7. **Start Development Server**
   ```bash
   php artisan serve
   ```

## Default Login Credentials

- **Email**: admin@mencas.edu
- **Password**: password

## Technologies Used

- **Backend**: Laravel 9.x
- **Frontend**: Bootstrap 5.1.3, Chart.js
- **Database**: MySQL
- **Build Tools**: Laravel Mix, Webpack
- **Icons**: Font Awesome 6.0

## Key Features Implementation

### Authentication
- Custom authentication system with session management
- Role-based access control
- Secure password hashing

### Data Visualization
- Interactive charts using Chart.js
- Real-time statistics dashboard
- Responsive design for all screen sizes

### CRUD Operations
- Full Create, Read, Update, Delete functionality
- Advanced filtering and search capabilities
- Pagination for large datasets

### File Structure
```
app/
├── Http/Controllers/          # All controller classes
├── Models/                    # Eloquent models
database/
├── migrations/                # Database schema
├── seeders/                  # Sample data generators
resources/
├── views/                    # Blade templates
├── css/                      # Stylesheets
└── js/                       # JavaScript files
routes/
└── web.php                   # Application routes
```

## API Endpoints

### Dashboard
- `GET /dashboard` - Main dashboard view

### Faculty Management
- `GET /faculty` - Faculty list with filters
- `POST /faculty` - Create new faculty
- `PUT /faculty/{id}` - Update faculty
- `DELETE /faculty/{id}` - Archive faculty

### Reports
- `GET /reports` - Reports overview
- `GET /reports/students-by-course` - Course enrollment report
- `GET /reports/faculty-by-department` - Department faculty report

### Settings
- `GET /settings/departments` - Department management
- `GET /settings/courses` - Course management
- `GET /settings/academic-years` - Academic year management

## Sample Data

The system includes comprehensive seeders that generate:
- 5 Academic departments
- 15 Courses across departments
- 50 Faculty members with realistic data
- 200 Students with enrollment records
- Historical academic years (2020-2025)
- Random enrollment patterns

## Customization

### Adding New Features
1. Create new migration: `php artisan make:migration create_table_name`
2. Create model: `php artisan make:model ModelName`
3. Create controller: `php artisan make:controller ControllerName`
4. Add routes in `routes/web.php`
5. Create views in `resources/views/`

### Styling Customization
- Modify `resources/views/layouts/app.blade.php` for layout changes
- Update CSS in the layout file or create separate CSS files
- Colors and themes can be customized through CSS variables

## Security Features

- CSRF protection on all forms
- SQL injection prevention through Eloquent ORM
- XSS protection through Blade templating
- Authentication middleware on protected routes
- Password hashing using Laravel's built-in bcrypt

## Performance Optimizations

- Eager loading relationships to prevent N+1 queries
- Pagination for large datasets
- Database indexing on frequently queried columns
- Compiled assets using Laravel Mix

## Future Enhancements

1. **Student Management Module**: Complete CRUD for students
2. **Grade Management**: Grade entry and transcript generation  
3. **Schedule Management**: Class scheduling and timetables
4. **Financial Management**: Fee collection and financial reports
5. **Communication System**: Email notifications and announcements
6. **Mobile App**: React Native mobile application
7. **API Integration**: RESTful API for third-party integrations

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.