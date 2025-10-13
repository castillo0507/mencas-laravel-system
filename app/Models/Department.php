<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function faculty()
    {
        return $this->hasMany(Faculty::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}