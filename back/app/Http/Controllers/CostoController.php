<?php

namespace App\Http\Controllers;

use App\Models\Costo;
use Illuminate\Http\Request;

class CostoController extends Controller
{
    public function index(Request $request)
    {
        $onlyActive = $request->boolean('activo', false);

        return Costo::with('aranceles')
            ->when($onlyActive, fn ($q) => $q->where('activo', true))
            ->orderBy('categoria')
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'     => 'required|string|max:255',
            'categoria'  => 'nullable|string|max:255',
            'icono'      => 'nullable|string|max:100',
            'color'      => 'nullable|string|max:100',
            'activo'     => 'nullable|boolean',
            'orden'      => 'nullable|integer|min:0',
            'arancel_ids' => 'nullable|array',
            'arancel_ids.*' => 'integer|exists:aranceles,id',
        ]);

        $arancelIds = $data['arancel_ids'] ?? [];
        unset($data['arancel_ids']);

        $costo = Costo::create($data);
        $costo->aranceles()->sync($arancelIds);

        return response()->json($costo->load('aranceles'), 201);
    }

    public function update(Request $request, Costo $costo)
    {
        $data = $request->validate([
            'nombre'     => 'required|string|max:255',
            'categoria'  => 'nullable|string|max:255',
            'icono'      => 'nullable|string|max:100',
            'color'      => 'nullable|string|max:100',
            'activo'     => 'nullable|boolean',
            'orden'      => 'nullable|integer|min:0',
            'arancel_ids' => 'nullable|array',
            'arancel_ids.*' => 'integer|exists:aranceles,id',
        ]);

        $arancelIds = $data['arancel_ids'] ?? [];
        unset($data['arancel_ids']);

        $costo->update($data);
        $costo->aranceles()->sync($arancelIds);

        return response()->json($costo->load('aranceles'));
    }

    public function destroy(Costo $costo)
    {
        $costo->delete();

        return response()->json(null, 204);
    }
}
