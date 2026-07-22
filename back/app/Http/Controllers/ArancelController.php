<?php

namespace App\Http\Controllers;

use App\Models\Arancel;
use Illuminate\Http\Request;

class ArancelController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->get('search', ''));

        return Arancel::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('categoria', 'like', "%{$search}%")
                        ->orWhere('nombre', 'like', "%{$search}%")
                        ->orWhere('presentacion', 'like', "%{$search}%");
                });
            })
            ->orderBy('categoria')
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', Arancel::class);

        $data = $request->validate([
            'codigo' => 'required|string|max:255|unique:aranceles,codigo',
            'categoria' => 'nullable|string|max:255',
            'nombre' => 'required|string|max:255',
            'presentacion' => 'nullable|string|max:255',
            'precio' => 'required|numeric|min:0',
            'orden' => 'nullable|integer|min:0',
            'activo' => 'nullable|boolean',
        ]);

        $arancel = Arancel::create($data);

        return response()->json($arancel, 201);
    }

    public function update(Request $request, Arancel $arancel)
    {
//        $this->authorize('update', $arancel);

        $data = $request->validate([
            'categoria' => 'nullable|string|max:255',
            'nombre' => 'required|string|max:255',
            'presentacion' => 'nullable|string|max:255',
            'precio' => 'required|numeric|min:0',
            'orden' => 'nullable|integer|min:0',
            'activo' => 'nullable|boolean',
        ]);

        $arancel->update($data);

        return response()->json($arancel, 200);
    }

    public function destroy(Arancel $arancel)
    {
        $this->authorize('delete', $arancel);

        $arancel->delete();

        return response()->json(null, 204);
    }
}
