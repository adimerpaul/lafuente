<?php

namespace App\Http\Controllers;

use App\Models\FormularioControl;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class FormularioControlController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->get('search', ''));
        $fechaInicio = $request->get('fechaInicio');
        $fechaFin = $request->get('fechaFin');
        $pacienteId = $request->get('paciente_id');
        $userId = $request->get('user_id');

        $items = FormularioControl::with(['paciente', 'user'])
            ->when($pacienteId, fn ($query) => $query->where('paciente_id', $pacienteId))
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
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

    public function generatePdf(FormularioControl $formularioControl)
    {
        $formularioControl->load(['paciente', 'user']);

        $selectedItems = collect($this->controlCatalog())
            ->map(function ($item) use ($formularioControl) {
                $value = data_get($formularioControl->detalle, $item['key']);
                $amount = (float) ($item['prices'][$value] ?? 0);

                if (!$value || $value === 'NO') {
                    return null;
                }

                return [
                    'label' => $item['label'],
                    'value' => $value,
                    'amount' => $amount,
                ];
            })
            ->filter()
            ->values();

        $totalReferencial = (float) $selectedItems->sum('amount');

        $pdf = Pdf::loadView('pdf.formulario_control', [
            'formularioControl' => $formularioControl,
            'selectedItems' => $selectedItems,
            'totalReferencial' => $totalReferencial,
        ])->setPaper('letter');

        return $pdf->stream('formulario_control_'.$formularioControl->id.'.pdf');
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

    private function controlCatalog(): array
    {
        return [
            ['key' => 'caja_vaselina', 'label' => 'Caja vaselinada', 'prices' => ['P' => 10, 'M' => 15, 'G' => 20]],
            ['key' => 'caja_curacion', 'label' => 'Caja de curacion', 'prices' => ['P' => 8, 'M' => 12, 'G' => 16]],
            ['key' => 'caja_sutura', 'label' => 'Caja de sutura', 'prices' => ['P' => 18, 'M' => 24, 'G' => 30]],
            ['key' => 'caja_retiro_uterino', 'label' => 'Caja de retiro de uterino', 'prices' => ['P' => 10, 'M' => 14, 'G' => 18]],
            ['key' => 'caja_retiro_puntos', 'label' => 'Caja de retiro de puntos', 'prices' => ['P' => 10, 'M' => 14, 'G' => 18]],
            ['key' => 'sutura', 'label' => 'Sutura', 'prices' => ['P' => 15, 'M' => 20, 'G' => 25]],
            ['key' => 'uso_tela_adhesiva', 'label' => 'Uso de tela adhesiva', 'prices' => ['P' => 5, 'M' => 7, 'G' => 10]],
            ['key' => 'uso_micropor', 'label' => 'Uso de micropor', 'prices' => ['SI' => 6]],
            ['key' => 'nebulizacion', 'label' => 'Nebulizacion', 'prices' => ['SI' => 20]],
            ['key' => 'glicemia', 'label' => 'Glicemia', 'prices' => ['SI' => 15]],
            ['key' => 'inyectable', 'label' => 'Inyectable', 'prices' => ['IM' => 10, 'EV' => 15, 'SC' => 8]],
            ['key' => 'guantes_dediles', 'label' => 'Guantes (dediles)', 'prices' => ['SI' => 5]],
            ['key' => 'campo_fenestrado', 'label' => 'Campo fenestrado', 'prices' => ['SI' => 10]],
            ['key' => 'colocado_stopper', 'label' => 'Colocado de stopper', 'prices' => ['SI' => 8]],
            ['key' => 'monitor_desfibrilador', 'label' => 'Monitor - desfibrilador', 'prices' => ['SI' => 25]],
            ['key' => 'antisepticos', 'label' => 'Antisepticos', 'prices' => ['SI' => 8]],
            ['key' => 'apositos_extras', 'label' => 'Apositos extras', 'prices' => ['SI' => 7]],
            ['key' => 'torundas_gasa_extras', 'label' => 'Torundas de gasa extras', 'prices' => ['SI' => 7]],
            ['key' => 'gases_extra', 'label' => 'Gases extra', 'prices' => ['SI' => 7]],
            ['key' => 'venda_quemado', 'label' => 'Venda de quemado', 'prices' => ['SI' => 15]],
            ['key' => 'curacion', 'label' => 'Curacion', 'prices' => ['P' => 15, 'M' => 20, 'G' => 30]],
            ['key' => 'suero', 'label' => 'Suero', 'prices' => ['SI' => 25]],
            ['key' => 'aspiracion', 'label' => 'Aspiracion', 'prices' => ['SI' => 20]],
            ['key' => 'sonda', 'label' => 'Sonda', 'prices' => ['SNG' => 18, 'SOG' => 18, 'SV' => 15]],
            ['key' => 'compresas', 'label' => 'Compresas', 'prices' => ['P' => 10, 'M' => 15, 'G' => 20]],
            ['key' => 'yeso', 'label' => 'Yeso', 'prices' => ['SI' => 35]],
            ['key' => 'oxigeno', 'label' => 'Oxigeno', 'prices' => ['SI' => 20]],
            ['key' => 'enema', 'label' => 'Enema', 'prices' => ['SI' => 18]],
            ['key' => 'corbatas', 'label' => 'Corbatas', 'prices' => ['SI' => 10]],
            ['key' => 'algodon', 'label' => 'Algodon', 'prices' => ['SI' => 5]],
        ];
    }
}
