<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    protected $fillable = [
        'resource_type',
        'resource_id',
        'title',
        'file_url',
        'data'
    ];

    protected $casts = [
        'data' => 'array'
    ];
}
