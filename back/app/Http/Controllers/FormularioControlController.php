<?php

namespace App\Http\Controllers;

use App\Models\FormularioControl;
use Illuminate\Http\Request;

class FormularioControlController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->get('search', ''));
        $fechaInicio = $request->get('fechaInicio');
        $fechaFin = $request->get('fechaFin');
        $pacienteId = $request->get('paciente_id');

        $items = FormularioControl::with(['paciente', 'user'])
            ->when($pacienteId, fn ($query) => $query->where('paciente_id', $pacienteId))
            ->when($fechaInicio, fn ($query) => $query->whereDate('fecha', '>=', $fechaInicio))
            ->when($fechaFin, fn ($query) => $query->whereDate('fecha', '<=', $fechaFin))
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('diagnostico', 'like', "%{$search}%")
                        ->orWhere('observaciones', 'like', "%{$search}%")
                        ->orWhereHas('paciente', function ($pacienteQuery) use ($search) {
                            $pacienteQuery->where('nombre', 'like', "%{$search}%")
                                ->orWhere('apellido', 'like', "%{$search}%")
                                ->orWhere('identificacion', 'like', "%{$search}%");
                        })
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('username', 'like', "%{$search}%");
                        });
                });
            })
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        return response()->json($items);
    }

    public function show(FormularioControl $formularioControl)
    {
        return $formularioControl->load(['paciente', 'user']);
    }

    public function store(Request $request)
    {
        $data = $this->validatedData($request);
        $data['user_id'] = $request->user()->id;

        $item = FormularioControl::create($data);

        return response()->json($item->load(['paciente', 'user']), 201);
    }

    public function update(Request $request, FormularioControl $formularioControl)
    {
        $data = $this->validatedData($request);

        $formularioControl->update($data);

        return response()->json($formularioControl->load(['paciente', 'user']));
    }

    public function destroy(FormularioControl $formularioControl)
    {
        $formularioControl->delete();

        return response()->json(null, 204);
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'fecha' => 'required|date',
            'diagnostico' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'detalle' => 'required|array',
            'detalle.caja_vaselina' => 'nullable|in:P,M,G',
            'detalle.caja_curacion' => 'nullable|in:P,M,G',
            'detalle.caja_sutura' => 'nullable|in:P,M,G',
            'detalle.caja_retiro_uterino' => 'nullable|in:P,M,G',
            'detalle.caja_retiro_puntos' => 'nullable|in:P,M,G',
            'detalle.sutura' => 'nullable|in:P,M,G',
            'detalle.uso_tela_adhesiva' => 'nullable|in:P,M,G',
            'detalle.uso_micropor' => 'nullable|in:SI,NO',
            'detalle.nebulizacion' => 'nullable|in:SI,NO',
            'detalle.glicemia' => 'nullable|in:SI,NO',
            'detalle.inyectable' => 'nullable|in:IM,EV,SC',
            'detalle.guantes_dediles' => 'nullable|in:SI,NO',
            'detalle.campo_fenestrado' => 'nullable|in:SI,NO',
            'detalle.colocado_stopper' => 'nullable|in:SI,NO',
            'detalle.monitor_desfibrilador' => 'nullable|in:SI,NO',
            'detalle.antisepticos' => 'nullable|in:SI,NO',
            'detalle.apositos_extras' => 'nullable|in:SI,NO',
            'detalle.torundas_gasa_extras' => 'nullable|in:SI,NO',
            'detalle.gases_extra' => 'nullable|in:SI,NO',
            'detalle.venda_quemado' => 'nullable|in:SI,NO',
            'detalle.curacion' => 'nullable|in:P,M,G',
            'detalle.suero' => 'nullable|in:SI,NO',
            'detalle.aspiracion' => 'nullable|in:SI,NO',
            'detalle.sonda' => 'nullable|in:SNG,SOG,SV',
            'detalle.compresas' => 'nullable|in:P,M,G',
            'detalle.yeso' => 'nullable|in:SI,NO',
            'detalle.oxigeno' => 'nullable|in:SI,NO',
            'detalle.enema' => 'nullable|in:SI,NO',
            'detalle.corbatas' => 'nullable|in:SI,NO',
            'detalle.algodon' => 'nullable|in:SI,NO',
        ]);
    }
}
