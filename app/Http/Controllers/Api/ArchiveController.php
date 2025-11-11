<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Archive;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ArchiveController extends Controller
{
    // GET /api/archives?type=students|faculty
    public function index(Request $request)
    {
        $type = $request->query('type');
        $query = Archive::query();
        if ($type) {
            $query->where('resource_type', $type);
        }
        $items = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($items);
    }

    // POST /api/archives - create an archive record (optional route)
    public function store(Request $request)
    {
        $data = $request->validate([
            'resource_type' => 'required|string',
            'resource_id' => 'required|integer',
            'title' => 'nullable|string',
            'file_url' => 'nullable|url',
            'data' => 'nullable|array'
        ]);

        $archive = Archive::create($data);
        return response()->json($archive, 201);
    }

    // POST /api/archives/{id}/restore
    public function restore($id)
    {
        $archive = Archive::findOrFail($id);

        // Basic restoration logic: attempt to un-archive the original resource
        $type = $archive->resource_type;
        $resourceId = $archive->resource_id;

        DB::beginTransaction();
        try {
            if ($type === 'students') {
                DB::table('students')->where('id', $resourceId)->update(['archived' => false]);
            } elseif ($type === 'faculty') {
                DB::table('faculty')->where('id', $resourceId)->update(['archived' => false]);
            }

            // Optionally delete archive record
            $archive->delete();

            DB::commit();
            return response()->json(['message' => 'Restored']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Restore failed', 'error' => $e->getMessage()], 500);
        }
    }

    // GET /api/archives/{id}/download
    public function download($id)
    {
        $archive = Archive::findOrFail($id);

        // Determine source data: prefer explicit data stored in archive, else attempt to look up resource
        $payload = $archive->data ?? [];

        if (empty($payload)) {
            // try to fetch the original resource for common resource types
            try {
                if ($archive->resource_type === 'students') {
                    $student = DB::table('students')->where('id', $archive->resource_id)->first();
                    if ($student) $payload = (array) $student;
                } elseif ($archive->resource_type === 'faculty') {
                    $faculty = DB::table('faculty')->where('id', $archive->resource_id)->first();
                    if ($faculty) $payload = (array) $faculty;
                }
            } catch (\Exception $e) {
                // ignore — we'll proceed with whatever data we have
            }
        }

        // Normalize payload to array and enrich with lookup names where possible
        $payloadArr = is_array($payload) ? $payload : (array) $payload;

        // Department: if we have an id but no name, attempt to look it up
        if (!empty($payloadArr['department_id']) && empty($payloadArr['department_name'])) {
            try {
                $payloadArr['department_name'] = DB::table('departments')->where('id', $payloadArr['department_id'])->value('name') ?? '';
            } catch (\Exception $e) {
                $payloadArr['department_name'] = $payloadArr['department_name'] ?? '';
            }
        }
        // sometimes department might be stored as 'department' id
        if (!empty($payloadArr['department']) && is_numeric($payloadArr['department']) && empty($payloadArr['department_name'])) {
            try {
                $payloadArr['department_name'] = DB::table('departments')->where('id', $payloadArr['department'])->value('name') ?? '';
            } catch (\Exception $e) {
                $payloadArr['department_name'] = $payloadArr['department_name'] ?? '';
            }
        }

        // Course: lookup if id present
        if (!empty($payloadArr['course_id']) && empty($payloadArr['course_name'])) {
            try {
                $payloadArr['course_name'] = DB::table('courses')->where('id', $payloadArr['course_id'])->value('name') ?? '';
            } catch (\Exception $e) {
                $payloadArr['course_name'] = $payloadArr['course_name'] ?? '';
            }
        }
        if (!empty($payloadArr['course']) && is_numeric($payloadArr['course']) && empty($payloadArr['course_name'])) {
            try {
                $payloadArr['course_name'] = DB::table('courses')->where('id', $payloadArr['course'])->value('name') ?? '';
            } catch (\Exception $e) {
                $payloadArr['course_name'] = $payloadArr['course_name'] ?? '';
            }
        }

        // Academic year: if we have id but not name, try to resolve
        if (!empty($payloadArr['academic_year_id']) && empty($payloadArr['academic_year'])) {
            try {
                $payloadArr['academic_year'] = DB::table('academic_years')->where('id', $payloadArr['academic_year_id'])->value('name') ?? $payloadArr['academic_year_id'];
            } catch (\Exception $e) {
                $payloadArr['academic_year'] = $payloadArr['academic_year'] ?? $payloadArr['academic_year_id'] ?? '';
            }
        }

        // Prepare view data with safe defaults
        $viewData = [
            'archive' => $archive,
            'data' => $payloadArr,
        ];

        // Normalize some alternate keys into common names so views can rely on them
        // gender: sometimes stored as 'sex'
        if (empty($payloadArr['gender']) && !empty($payloadArr['sex'])) {
            $payloadArr['gender'] = $payloadArr['sex'];
        }

        // emergency_contact: accept several possible keys
        if (empty($payloadArr['emergency_contact'])) {
            if (!empty($payloadArr['emergency'])) {
                $payloadArr['emergency_contact'] = $payloadArr['emergency'];
            } elseif (!empty($payloadArr['emergency_contact_number'])) {
                $payloadArr['emergency_contact'] = $payloadArr['emergency_contact_number'];
            } elseif (!empty($payloadArr['em_contact'])) {
                $payloadArr['emergency_contact'] = $payloadArr['em_contact'];
            }
        }

        // Choose view depending on resource type
        $viewName = 'archives.download';
        if ($archive->resource_type === 'faculty') {
            $viewName = 'archives.download_faculty';
        }

        // Render PDF using available library (barryvdh/laravel-dompdf preferred)
        // Try the common facade first (wrapped so missing facade won't fatal)
        try {
            if (class_exists('PDF') || class_exists(\Barryvdh\DomPDF\Facade::class)) {
                $pdf = \PDF::loadView($viewName, $viewData);
                $filename = $archive->title ? Str::slug($archive->title) : 'archive';
                return $pdf->download($filename.'.pdf');
            }
        } catch (\Throwable $e) {
            // continue to other fallbacks below
        }

        if (class_exists('Dompdf\\Dompdf')) {
            try {
                $html = view($viewName, $viewData)->render();
                $dom = new \Dompdf\Dompdf();
                $dom->loadHtml($html);
                $dom->setPaper('A4', 'portrait');
                $dom->render();
                $pdfOutput = $dom->output();
                return response($pdfOutput, 200)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename="'.($archive->title ? preg_replace('/[^A-Za-z0-9\-_\.]/', '_', $archive->title) : 'archive').'.pdf"');
            } catch (\Exception $e) {
                return response()->json(['message' => 'Failed to generate PDF: '.$e->getMessage()], 500);
            }
        }

        return response()->json(['message' => 'PDF generation not available. Please install barryvdh/laravel-dompdf or dompdf/dompdf via composer.'], 501);
    }
}
