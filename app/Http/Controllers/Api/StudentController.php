<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Archive;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StudentController extends Controller
{
    public function index()
    {
        // Support filtering, pagination and exclude archived by default
        $request = request();
        $query = Student::with(['department', 'course', 'academicYear']);

        // Search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by course
        if ($request->has('course_id') && $request->course_id !== '') {
            $query->where('course_id', $request->course_id);
        }

        // Filter by department
        if ($request->has('department_id') && $request->department_id !== '') {
            $query->where('department_id', $request->department_id);
        }

        // Filter by year level (if the students table has year_level)
        if ($request->has('year_level') && $request->year_level !== '') {
            $query->where('year_level', $request->year_level);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Archived filter: by default exclude archived items. Use ?archived=1 to fetch archived only, ?archived=0 to fetch only non-archived.
        if ($request->has('archived')) {
            if ($request->archived == '1' || $request->archived === 1 || $request->archived === true) {
                $query->where('archived', true);
            } else {
                // archived=0 or falsy -> only non-archived
                $query->where(function ($q) {
                    $q->whereNull('archived')->orWhere('archived', false);
                });
            }
        } else {
            // Default: hide archived records
            $query->where(function ($q) {
                $q->whereNull('archived')->orWhere('archived', false);
            });
        }

        $perPage = $request->get('per_page', 15);
        $students = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $students->items(),
            'meta' => [
                'current_page' => $students->currentPage(),
                'from' => $students->firstItem(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'to' => $students->lastItem(),
                'total' => $students->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'extension_name' => 'nullable|string|max:50',
            'email' => 'required|email|unique:students,email',
            'phone' => 'nullable|string|max:15',
            'year_level' => 'nullable|in:1,2,3,4',
            'address' => 'nullable|string|max:1000',
            'gender' => 'nullable|in:male,female,other',
            'birthplace' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'enrollment_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,suspended',
            'archived' => 'boolean',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_contact' => 'nullable|string|max:50',
            'emergency_contact' => 'nullable|string|max:50',
            'photo' => 'nullable|image|max:4096',
            'department_id' => 'required|exists:departments,id',
            'course_id' => 'nullable|exists:courses,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

    // Handle photo upload (store and add to validated data) before intersecting with actual columns
    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('students', 'public');
        $validated['photo'] = '/storage/' . $path;
    }

    // Default academic_year_id to the active academic year if available and not provided
    if ((empty($validated['academic_year_id']) || $validated['academic_year_id'] === null) && Schema::hasTable('academic_years')) {
        // try to pick the active one
        $active = DB::table('academic_years')->where('active', true)->orWhere('is_active', true)->first();
        if ($active) {
            $validated['academic_year_id'] = $active->id;
        }
    }

    // Only persist columns that exist in the students table to avoid SQL errors
    $columns = Schema::getColumnListing('students');
    $data = array_intersect_key($validated, array_flip($columns));

    $student = Student::create($data);

        return response()->json([
            'message' => 'Student added successfully.',
            'data' => $student->load(['department', 'course', 'academicYear']),
        ], 201);
    }

    public function show($id)
    {
        $student = Student::with(['department', 'course', 'academicYear'])->findOrFail($id);
        return response()->json($student);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id,' . $id,
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'extension_name' => 'nullable|string|max:50',
            'email' => 'required|email|unique:students,email,' . $id,
            'phone' => 'nullable|string|max:15',
            'year_level' => 'nullable|in:1,2,3,4',
            'address' => 'nullable|string|max:1000',
            'gender' => 'nullable|in:male,female,other',
            'birthplace' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'enrollment_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,suspended',
            'archived' => 'boolean',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_contact' => 'nullable|string|max:50',
            'emergency_contact' => 'nullable|string|max:50',
            'photo' => 'nullable|image|max:4096',
            'department_id' => 'required|exists:departments,id',
            'course_id' => 'nullable|exists:courses,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        // Handle photo upload (multipart form with _method=PUT)
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('students', 'public');
            $validated['photo'] = '/storage/' . $path;
        }

    // Only update columns that exist in the students table
    $columns = Schema::getColumnListing('students');
    $data = array_intersect_key($validated, array_flip($columns));

    $student->update($data);

        return response()->json([
            'message' => 'Student updated successfully.',
            'data' => $student->load(['department', 'course', 'academicYear']),
        ]);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully.']);
    }

    /**
     * Partially update archived flag (used by frontend to toggle archive state)
     */
    public function archive(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'archived' => 'required|boolean',
        ]);

        DB::beginTransaction();
        try {
            // Only update archived column if it exists in the table
            if (Schema::hasColumn('students', 'archived')) {
                $student->update(['archived' => $validated['archived']]);
            }

            if ($validated['archived']) {
                // create archive record if not exists
                Archive::firstOrCreate([
                    'resource_type' => 'students',
                    'resource_id' => $student->id,
                ], [
                    'title' => trim(($student->first_name ?? '') . ' ' . ($student->last_name ?? '')) ?: null,
                    'data' => $student->toArray(),
                ]);
            } else {
                // remove any archive records for this resource when unarchiving
                Archive::where('resource_type', 'students')
                    ->where('resource_id', $student->id)
                    ->delete();
            }

            DB::commit();

            return response()->json([
                'message' => 'Student archive state updated',
                'data' => $student,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Archive update failed', 'error' => $e->getMessage()], 500);
        }
    }
}
