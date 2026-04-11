<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class CajaRecepcion extends Model implements Auditable
{
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    public const COST_FIELDS = [
        'costo_atencion_medica',
        'costo_curacion',
        'costo_inyectable',
        'costo_toma_presion',
        'costo_ambulancia',
        'costo_laboratorio',
        'costo_ecografia',
        'costo_uso_consultorio',
        'costo_glicemia',
        'costo_certificado_medico',
        'costo_sutura',
        'costo_antisepticos',
        'costo_cama',
        'costo_compania_noche',
        'costo_uso_ecografia',
        'costo_flebotomia',
        'costo_sonda',
        'costo_farmacia',
        'otros_costos',
    ];

    protected $table = 'caja_recepciones';

    protected $fillable = [
        'fecha',
        'user_id',
        'paciente_id',
        'doctor_id',
        'tipo_movimiento',
        'tipo_documento',
        'tipo_atencion',
        'punto',
        'nombre_factura',
        'numero_ficha',
        'formulario_diagnostico',
        'formulario_detalle',
        'formulario_observaciones',
        'estado_pago',
        'laboratorio_nombre',
        'medico_ecografia',
        'observaciones',
        'qr',
        'efectivo',
        'egreso',
        'recaudado_total',
        'costo_atencion_medica',
        'costo_curacion',
        'costo_inyectable',
        'costo_toma_presion',
        'costo_ambulancia',
        'costo_laboratorio',
        'costo_ecografia',
        'costo_uso_consultorio',
        'costo_glicemia',
        'costo_certificado_medico',
        'costo_sutura',
        'costo_antisepticos',
        'costo_cama',
        'costo_compania_noche',
        'costo_uso_ecografia',
        'costo_flebotomia',
        'costo_sonda',
        'costo_farmacia',
        'otros_costos',
    ];

    protected $casts = [
//        'fecha' => 'date',
        'tipo_documento' => 'integer',
        'punto' => 'integer',
        'formulario_detalle' => 'array',
        'qr' => 'float',
        'efectivo' => 'float',
        'egreso' => 'float',
        'recaudado_total' => 'float',
        'costo_atencion_medica' => 'float',
        'costo_curacion' => 'float',
        'costo_inyectable' => 'float',
        'costo_toma_presion' => 'float',
        'costo_ambulancia' => 'float',
        'costo_laboratorio' => 'float',
        'costo_ecografia' => 'float',
        'costo_uso_consultorio' => 'float',
        'costo_glicemia' => 'float',
        'costo_certificado_medico' => 'float',
        'costo_sutura' => 'float',
        'costo_antisepticos' => 'float',
        'costo_cama' => 'float',
        'costo_compania_noche' => 'float',
        'costo_uso_ecografia' => 'float',
        'costo_flebotomia' => 'float',
        'costo_sonda' => 'float',
        'costo_farmacia' => 'float',
        'otros_costos' => 'float',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'documento_label',
        'recaudado_calculado',
        'saldo_final',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function getDocumentoLabelAttribute(): string
    {
        return (int) $this->tipo_documento === 1 ? 'Factura' : 'Recibo';
    }

    public function getRecaudadoCalculadoAttribute(): float
    {
        return collect(self::COST_FIELDS)->sum(fn ($field) => (float) ($this->{$field} ?? 0));
    }

    public function getSaldoFinalAttribute(): float
    {
        return (float) $this->recaudado_total - (float) $this->costo_farmacia - (float) $this->egreso;
    }
}
