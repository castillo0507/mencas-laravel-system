<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FacultyController extends Controller
{
    /**
     * Display a listing of faculty members.
     */
    public function index(Request $request)
    {
        $query = Faculty::with('department');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%");
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

        $faculty = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $faculty->items(),
            'meta' => [
                'current_page' => $faculty->currentPage(),
                'from' => $faculty->firstItem(),
                'last_page' => $faculty->lastPage(),
                'per_page' => $faculty->perPage(),
                'to' => $faculty->lastItem(),
                'total' => $faculty->total(),
            ]
        ]);
    }

    /**
     * Store a newly created faculty member.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|string|unique:faculty',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:faculty',
            'phone' => 'nullable|string|max:20',
            'position' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $faculty = Faculty::create($request->all());
        $faculty->load('department');

        return response()->json([
            'message' => 'Faculty member created successfully',
            'data' => $faculty
        ], 201);
    }

    /**
     * Display the specified faculty member.
     */
    public function show($id)
    {
        $faculty = Faculty::with('department')->findOrFail($id);

        return response()->json([
            'data' => $faculty
        ]);
    }

    /**
     * Update the specified faculty member.
     */
    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|string|unique:faculty,employee_id,' . $id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:faculty,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'position' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $faculty->update($request->all());
        $faculty->load('department');

        return response()->json([
            'message' => 'Faculty member updated successfully',
            'data' => $faculty
        ]);
    }

    /**
     * Remove the specified faculty member.
     */
    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();

        return response()->json([
            'message' => 'Faculty member deleted successfully'
        ]);
    }

    /**
     * Get departments for dropdowns.
     */
    public function getDepartments()
    {
        $departments = Department::where('is_active', true)
            ->select('id', 'name', 'code')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $departments
        ]);
    }
}