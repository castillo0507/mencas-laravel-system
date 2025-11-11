<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty';

    protected $fillable = [
        'employee_id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'phone',
        'gender',
        'position',
        'department_id',
        'is_active',
        'archived',
        'emergency_contact',
        'photo'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'archived' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function getFullNameAttribute()
    {
        $parts = array_filter([
            $this->first_name ?? null,
            $this->middle_name ?? null,
            $this->last_name ?? null,
        ]);

        return implode(' ', $parts);
    }
}