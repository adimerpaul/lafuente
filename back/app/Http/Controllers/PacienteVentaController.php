<?php

namespace App\Http\Controllers;

use App\Models\PacienteVenta;
use App\Models\Venta;
use Illuminate\Http\Request;

class PacienteVentaController extends Controller{
    function update(Request $request,$paciente_venta_id){
        $paciente_venta = PacienteVenta::find($paciente_venta_id);
        if (!$paciente_venta) {
            return response()->json(['message' => 'La relación paciente-venta no existe'], 404);
        }

        $venta = Venta::find($paciente_venta->venta_id);
        if (!$venta) {
            return response()->json(['message' => 'La venta no existe'], 404);
        }

        if (!in_array($venta->tipo_venta, ['Internado', 'Interno'])) {
            return response()->json(['message' => 'Solo se puede confirmar pagado interno en ventas de internación'], 422);
        }

        $nuevoValor = (int) $request->input('pagado_interno', 0);
        if ($nuevoValor !== 1) {
            return response()->json(['message' => 'El estado pagado interno solo se puede confirmar en "Sí"'], 422);
        }

        if ((int)$venta->pagado_interno === 1 && $nuevoValor === 0) {
            return response()->json(['message' => 'Una venta ya confirmada como pagada no puede revertirse'], 422);
        }

        $venta->pagado_interno = 1;
        $venta->save();

        return response()->json($venta);
    }
    function store(Request $request){
//        verificar que ecista le venta
        $venta = Venta::find($request->venta_id);
        if(!$venta){
            return response()->json(['message' => 'La venta no existe'], 404);
        }
        $user = $request->user();
        $pacienteVenta = new PacienteVenta();
        $pacienteVenta->paciente_id = $request->paciente_id;
        $pacienteVenta->venta_id = $request->venta_id;
        $pacienteVenta->user_id = $user->id;
        $hora = date('H:i');
        $pacienteVenta->hora = $hora;
        $pacienteVenta->save();
        $venta->paciente_id_ref = $request->paciente_id;
        $venta->save();
        return response()->json($pacienteVenta);
    }
    function destroy(PacienteVenta $paciente_venta){
        $paciente_venta->delete();
        return response()->json($paciente_venta);
    }
}
