<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Department;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics and data.
     */
    public function index()
    {
        // Basic statistics
        $stats = [
            'totalStudents' => Student::count(),
            'totalFaculty' => Faculty::count(),
            'totalCourses' => Course::count(),
            'totalDepartments' => Department::count(),
            'activeStudents' => Student::where('status', 'active')->count(),
            'activeFaculty' => Faculty::where('is_active', true)->count(),
            'activeCourses' => Course::where('is_active', true)->count(),
            'activeDepartments' => Department::where('is_active', true)->count(),
        ];

        // Recent activities
        $recentStudents = Student::with('department')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentFaculty = Faculty::with('department')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Recent departments (replacing enrollment data)
        $recentDepartments = Department::withCount(['students', 'faculty', 'courses'])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Department statistics
        $departmentStats = Department::withCount(['students', 'faculty', 'courses'])
            ->where('is_active', true)
            ->orderBy('students_count', 'desc')
            ->limit(10)
            ->get();

        // Monthly student registration trends (replacing enrollment trends)
        $registrationTrends = Student::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Status distribution
        $studentStatusDistribution = Student::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $stats,
                'recentStudents' => $recentStudents,
                'recentFaculty' => $recentFaculty,
                'recentDepartments' => $recentDepartments,
                'departmentStats' => $departmentStats,
                'registrationTrends' => $registrationTrends,
                'studentStatusDistribution' => $studentStatusDistribution,
                // include lists for report filters
                'departments' => Department::select('id','name')->orderBy('name')->get(),
                'courses' => Course::select('id','name','department_id')->orderBy('name')->get(),
                'academic_years' => AcademicYear::select('id','name')->orderBy('name')->get(),
            ]
        ]);
    }
}