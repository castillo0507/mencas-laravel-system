<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     */
    public function index(Request $request)
    {
        $query = Course::with('department');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by department
        if ($request->has('department_id') && !empty($request->department_id)) {
            $query->where('department_id', $request->department_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === 'active');
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $courses = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $courses->items(),
            'meta' => [
                'current_page' => $courses->currentPage(),
                'from' => $courses->firstItem(),
                'last_page' => $courses->lastPage(),
                'per_page' => $courses->perPage(),
                'to' => $courses->lastItem(),
                'total' => $courses->total(),
            ]
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'department_id' => 'required|exists:departments,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Prepare data and generate a fallback unique code if none provided by the client
        $data = $request->only(['name', 'description', 'department_id', 'is_active']);

        if ($request->filled('code')) {
            $data['code'] = $request->input('code');
        } else {
            // generate a short unique code based on name + timestamp (keeps uniqueness practical)
            $base = preg_replace('/[^A-Za-z0-9]/', '', strtoupper(substr($request->input('name'), 0, 10)));
            $candidate = $base . '-' . time();
            // ensure uniqueness (simple loop, should usually succeed immediately)
            $i = 0;
            while (\App\Models\Course::where('code', $candidate)->exists()) {
                $i++;
                $candidate = $base . '-' . time() . '-' . $i;
                if ($i > 5) break; // safety
            }
            $data['code'] = $candidate;
        }

        // credits are optional now; default to 3 if not provided
        $data['credits'] = $request->input('credits', 3);

        $course = Course::create($data);
        $course->load('department');

        return response()->json([
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    /**
     * Display the specified course.
     */
    public function show($id)
    {
        // Only eager-load enrollments if the table exists to avoid SQL errors on incomplete setups
        $with = ['department'];
        if (Schema::hasTable('enrollments')) {
            $with[] = 'enrollments.student';
        }

        $course = Course::with($with)->findOrFail($id);

        return response()->json([
            'data' => $course
        ]);
    }

    /**
     * Update the specified course.
     */
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'department_id' => 'required|exists:departments,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $course->update($request->all());
        $course->load('department');

        return response()->json([
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    /**
     * Remove the specified course.
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        
        // Check if course has enrollments (only if table exists)
        if (Schema::hasTable('enrollments') && $course->enrollments()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete course with existing enrollments'
            ], 400);
        }

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }
}