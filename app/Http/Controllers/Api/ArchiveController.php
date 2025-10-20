<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Archive;
use Illuminate\Support\Facades\DB;

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
}
