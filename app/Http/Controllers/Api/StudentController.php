<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with(['department', 'course', 'academicYear'])->get();
        return response()->json($students);
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
            'date_of_birth' => 'nullable|date',
            'enrollment_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,suspended',
            'archived' => 'boolean',
            'department_id' => 'required|exists:departments,id',
            'course_id' => 'nullable|exists:courses,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        $student = Student::create($validated);

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
            'date_of_birth' => 'nullable|date',
            'enrollment_date' => 'nullable|date',
            'status' => 'required|in:active,inactive,suspended',
            'archived' => 'boolean',
            'department_id' => 'required|exists:departments,id',
            'course_id' => 'nullable|exists:courses,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        $student->update($validated);

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
}
