<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index(Request $request)
    {
        $query = Department::withCount(['students', 'faculty', 'courses']);

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === 'active');
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $departments = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $departments->items(),
            'meta' => [
                'current_page' => $departments->currentPage(),
                'from' => $departments->firstItem(),
                'last_page' => $departments->lastPage(),
                'per_page' => $departments->perPage(),
                'to' => $departments->lastItem(),
                'total' => $departments->total(),
            ]
        ]);
    }

    /**
     * Store a newly created department.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:departments|max:255',
            'code' => 'required|string|unique:departments|max:10',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $department = Department::create($request->all());

        return response()->json([
            'message' => 'Department created successfully',
            'data' => $department
        ], 201);
    }

    /**
     * Display the specified department.
     */
    public function show($id)
    {
        $department = Department::with(['students', 'faculty', 'courses'])
            ->withCount(['students', 'faculty', 'courses'])
            ->findOrFail($id);

        return response()->json([
            'data' => $department
        ]);
    }

    /**
     * Update the specified department.
     */
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:departments,name,' . $id . '|max:255',
            'code' => 'required|string|unique:departments,code,' . $id . '|max:10',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $department->update($request->all());

        return response()->json([
            'message' => 'Department updated successfully',
            'data' => $department
        ]);
    }

    /**
     * Remove the specified department.
     */
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        
        // Check if department has students, faculty, or courses
        if ($department->students()->count() > 0 || 
            $department->faculty()->count() > 0 || 
            $department->courses()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete department with existing students, faculty, or courses'
            ], 400);
        }

        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully'
        ]);
    }
}