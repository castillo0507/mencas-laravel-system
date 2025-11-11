<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'first_name',
        'middle_name',
        'last_name',
        'extension_name',
        'email',
        'phone',
        'address',
        'gender',
        'birthplace',
        'date_of_birth',
        'enrollment_date',
        'year_level',
        'status',
        'archived',
        'guardian_name',
        'guardian_contact',
        'emergency_contact',
        'photo',
        'department_id',
        'course_id',
        'academic_year_id',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'archived' => 'boolean',
        // Return date-only strings (YYYY-MM-DD) for API responses so <input type="date"> works reliably
        'date_of_birth' => 'date:Y-m-d',
        'enrollment_date' => 'date:Y-m-d',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
