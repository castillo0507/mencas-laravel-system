<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index()
    {
        // Mock data for now - replace with actual model when needed
        $academicYears = [
            [
                'id' => 1,
                'year' => '2024-2025',
                'start_date' => '2024-09-01',
                'end_date' => '2025-06-30',
                'is_current' => true,
                'is_active' => true
            ],
            [
                'id' => 2,
                'year' => '2023-2024',
                'start_date' => '2023-09-01',
                'end_date' => '2024-06-30',
                'is_current' => false,
                'is_active' => true
            ]
        ];

        return response()->json([
            'data' => $academicYears,
            'meta' => [
                'current_page' => 1,
                'from' => 1,
                'last_page' => 1,
                'per_page' => 15,
                'to' => count($academicYears),
                'total' => count($academicYears),
            ]
        ]);
    }

    /**
     * Store a newly created academic year.
     */
    public function store(Request $request)
    {
        // Mock response
        return response()->json([
            'message' => 'Academic year created successfully',
            'data' => [
                'id' => 3,
                'year' => $request->year,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'is_current' => false,
                'is_active' => true
            ]
        ], 201);
    }

    /**
     * Display the specified academic year.
     */
    public function show($id)
    {
        return response()->json([
            'data' => [
                'id' => $id,
                'year' => '2024-2025',
                'start_date' => '2024-09-01',
                'end_date' => '2025-06-30',
                'is_current' => true,
                'is_active' => true
            ]
        ]);
    }

    /**
     * Update the specified academic year.
     */
    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => 'Academic year updated successfully',
            'data' => [
                'id' => $id,
                'year' => $request->year,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'is_current' => $request->is_current ?? false,
                'is_active' => $request->is_active ?? true
            ]
        ]);
    }

    /**
     * Remove the specified academic year.
     */
    public function destroy($id)
    {
        return response()->json([
            'message' => 'Academic year deleted successfully'
        ]);
    }
}