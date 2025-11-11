<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    DashboardController, FacultyController,
    CourseController, DepartmentController, AcademicYearController,
    ProfileController
};
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ArchiveController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication routes (public)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-admin', [AuthController::class, 'registerAdmin']);
Route::get('/admin-exists', [AuthController::class, 'adminExists']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Public endpoints for dropdowns
Route::get('/faculty/departments', [FacultyController::class, 'getDepartments']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/dashboard', [DashboardController::class, 'index']);
});

// Protected API resources
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('students', StudentController::class);
    Route::apiResource('faculty', FacultyController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('academic-years', AcademicYearController::class);
    
    // Archive endpoints (modal UI uses these)
    Route::get('/archives', [ArchiveController::class, 'index']);
    Route::post('/archives', [ArchiveController::class, 'store']);
    Route::post('/archives/{id}/restore', [ArchiveController::class, 'restore']);
    Route::get('/archives/{id}/download', [ArchiveController::class, 'download']);
    // lightweight archive toggles for students and faculty (avoid full-update validation when toggling)
    Route::patch('/students/{id}/archive', [StudentController::class, 'archive']);
    Route::patch('/faculty/{id}/archive', [FacultyController::class, 'archive']);
    
    Route::get('/profile', [ProfileController::class,'show']);
    Route::put('/profile', [ProfileController::class,'update']);
});