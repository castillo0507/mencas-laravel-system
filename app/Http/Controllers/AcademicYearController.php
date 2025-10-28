<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 1000);
        $query = AcademicYear::query()->orderByDesc('is_current')->orderByDesc('created_at');

        // If client wants all results, return as array
        if ($perPage === 0) {
            $data = $query->get();
            return response()->json(['data' => $data]);
        }

        $paginated = $query->paginate(min(max($perPage, 1), 1000));
        return response()->json([
            'data' => $paginated->items(),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'from' => $paginated->firstItem(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'to' => $paginated->lastItem(),
                'total' => $paginated->total(),
            ]
        ]);
    }

    /**
     * Store a newly created academic year.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'year' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_current' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // If this year is marked current, unset other current flags
        if (!empty($data['is_current'])) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        // Backwards-compatibility: some existing schemas use `name` and `active` columns.
        if (isset($data['year'])) {
            $data['name'] = $data['year'];
        }
        $data['is_active'] = $data['is_active'] ?? true;
        $data['active'] = $data['is_active'];

        $ay = AcademicYear::create($data);

        return response()->json(['message' => 'Academic year created successfully', 'data' => $ay], 201);
    }

    /**
     * Display the specified academic year.
     */
    public function show($id)
    {
        $ay = AcademicYear::find($id);
        if (!$ay) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json(['data' => $ay]);
    }

    /**
     * Update the specified academic year.
     */
    public function update(Request $request, $id)
    {
        $ay = AcademicYear::find($id);
        if (!$ay) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'year' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_current' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if (!empty($data['is_current'])) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        // Backwards-compatibility: populate legacy columns if present
        if (isset($data['year'])) {
            $data['name'] = $data['year'];
        }
        $data['is_active'] = $data['is_active'] ?? ($ay->is_active ?? true);
        $data['active'] = $data['is_active'];

        $ay->update($data);

        return response()->json(['message' => 'Academic year updated successfully', 'data' => $ay]);
    }

    /**
     * Remove the specified academic year.
     */
    public function destroy($id)
    {
        $ay = AcademicYear::find($id);
        if (!$ay) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $ay->delete();

        return response()->json(['message' => 'Academic year deleted successfully']);
    }
}