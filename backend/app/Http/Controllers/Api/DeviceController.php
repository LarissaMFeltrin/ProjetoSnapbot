<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDeviceRequest;
use App\Http\Requests\UpdateDeviceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $perPage = $request->get('per_page', 15);
        $page = $request->get('page', 1);

        $query = DB::table('devices')
            ->where('user_id', $userId)
            ->whereNull('deleted_at');

        // Filtros
        if ($request->has('in_use')) {
            $query->where('in_use', $request->boolean('in_use'));
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('purchase_date_from')) {
            $query->whereDate('purchase_date', '>=', $request->purchase_date_from);
        }

        if ($request->has('purchase_date_to')) {
            $query->whereDate('purchase_date', '<=', $request->purchase_date_to);
        }

        // Ordenação
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['name', 'location', 'purchase_date', 'in_use', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $total = $query->count();
        $devices = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return response()->json([
            'data' => $devices,
            'current_page' => (int) $page,
            'per_page' => (int) $perPage,
            'total' => $total,
            'last_page' => ceil($total / $perPage),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeviceRequest $request)
    {
        $deviceId = DB::table('devices')->insertGetId([
            'name' => $request->name,
            'location' => $request->location,
            'purchase_date' => $request->purchase_date,
            'in_use' => false,
            'user_id' => $request->user()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $device = DB::table('devices')->where('id', $deviceId)->first();

        return response()->json($device, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $userId = $request->user()->id;

        $device = DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->first();

        if (!$device) {
            return response()->json(['message' => 'Dispositivo não encontrado.'], 404);
        }

        return response()->json($device);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeviceRequest $request, string $id)
    {
        $userId = $request->user()->id;

        $device = DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->first();

        if (!$device) {
            return response()->json(['message' => 'Dispositivo não encontrado.'], 404);
        }

        $updateData = [];
        if ($request->has('name')) {
            $updateData['name'] = $request->name;
        }
        if ($request->has('location')) {
            $updateData['location'] = $request->location;
        }
        if ($request->has('purchase_date')) {
            $updateData['purchase_date'] = $request->purchase_date;
        }

        $updateData['updated_at'] = now();

        DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->update($updateData);

        $device = DB::table('devices')->where('id', $id)->first();

        return response()->json($device);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $userId = $request->user()->id;

        $device = DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->first();

        if (!$device) {
            return response()->json(['message' => 'Dispositivo não encontrado.'], 404);
        }

        // Soft Delete
        DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->update([
                'deleted_at' => now(),
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'Dispositivo excluído com sucesso.'], 200);
    }

    /**
     * Toggle device use status.
     */
    public function toggleUse(Request $request, string $id)
    {
        $userId = $request->user()->id;

        $device = DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->first();

        if (!$device) {
            return response()->json(['message' => 'Dispositivo não encontrado.'], 404);
        }

        $newStatus = !$device->in_use;

        DB::table('devices')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->update([
                'in_use' => $newStatus,
                'updated_at' => now(),
            ]);

        $device = DB::table('devices')->where('id', $id)->first();

        return response()->json($device);
    }
}
