<?php

namespace App\Http\Controllers;

use App\Exports\ArancelesInternacionExcelExport;
use App\Models\ArancelInternacion;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ArancelInternacionController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search'));

        return $this->filteredQuery($request)
            ->orderBy('categoria')
            ->orderBy('grupo')
            ->orderBy('nombre')
            ->get();
    }

    public function pdf(Request $request)
    {
        $rows = $this->filteredQuery($request)
            ->orderBy('categoria')->orderBy('grupo')->orderBy('nombre')->get();

        return Pdf::loadView('pdf.aranceles_internacion', [
            'rows' => $rows,
            'activeCount' => $rows->where('activo', true)->count(),
            'pricedCount' => $rows->whereNotNull('precio')->count(),
            'search' => trim((string) $request->input('search')),
            'generatedAt' => now()->format('d/m/Y H:i'),
        ])->setPaper('a4', 'landscape')
            ->download('aranceles_internacion_'.now()->format('Ymd_His').'.pdf');
    }

    public function excel(Request $request)
    {
        $rows = $this->filteredQuery($request)
            ->orderBy('categoria')->orderBy('grupo')->orderBy('nombre')->get()->toArray();

        return (new ArancelesInternacionExcelExport(
            $rows,
            trim((string) $request->input('search'))
        ))->download();
    }

    public function store(Request $request)
    {
        return response()->json(ArancelInternacion::create($this->validateData($request)), 201);
    }

    public function update(Request $request, ArancelInternacion $arancelInternacion)
    {
        $arancelInternacion->update($this->validateData($request));

        return response()->json($arancelInternacion);
    }

    public function destroy(ArancelInternacion $arancelInternacion)
    {
        $arancelInternacion->delete();

        return response()->json([
            'message' => 'Arancel eliminado correctamente.',
        ]);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'categoria' => 'required|string|max:100',
            'grupo' => 'nullable|string|max:120',
            'nombre' => 'required|string|max:180',
            'detalle' => 'nullable|string|max:255',
            'tipo_precio' => 'required|string|max:40',
            'precio' => 'nullable|numeric|min:0|max:99999999.99',
            'permite_precio_manual' => 'required|boolean',
            'activo' => 'required|boolean',
        ]);
    }

    private function filteredQuery(Request $request): Builder
    {
        $search = trim((string) $request->input('search'));

        return ArancelInternacion::query()
            ->when($request->boolean('solo_activos'), fn ($query) => $query->where('activo', true))
            ->when($search, fn ($query) => $query->where(function ($subQuery) use ($search) {
                $subQuery->where('nombre', 'like', "%{$search}%")
                    ->orWhere('categoria', 'like', "%{$search}%")
                    ->orWhere('grupo', 'like', "%{$search}%")
                    ->orWhere('detalle', 'like', "%{$search}%");
            }));
    }
}
