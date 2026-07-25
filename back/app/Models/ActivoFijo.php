<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActivoFijo extends Model
{
    use SoftDeletes;

    protected $table = 'activos_fijos';

    protected $fillable = [
        'user_id',
        'codigo',
        'nombre',
        'descripcion',
        'valor',
        'fecha_compra',
        'fecha_fin',
        'depreciacion_mensual',
        'estado',
        'foto',
    ];

    protected $casts = [
        'valor' => 'float',
        'depreciacion_mensual' => 'float',
        'fecha_compra' => 'date:Y-m-d',
        'fecha_fin' => 'date:Y-m-d',
    ];

    protected $hidden = ['deleted_at'];

    protected $appends = [
        'meses_depreciados',
        'depreciacion_acumulada',
        'valor_actual',
    ];

    public function getMesesDepreciadosAttribute(): int
    {
        $inicio = Carbon::parse($this->fecha_compra)->startOfDay();
        $finVidaUtil = Carbon::parse($this->fecha_fin)->startOfDay();
        $fechaCalculo = now()->startOfDay()->min($finVidaUtil);

        if ($fechaCalculo->lessThanOrEqualTo($inicio)) {
            return 0;
        }

        return (int) floor($inicio->diffInMonths($fechaCalculo));
    }

    public function getDepreciacionAcumuladaAttribute(): float
    {
        return round(min(
            (float) $this->valor,
            $this->meses_depreciados * (float) $this->depreciacion_mensual
        ), 2);
    }

    public function getValorActualAttribute(): float
    {
        return round(max(0, (float) $this->valor - $this->depreciacion_acumulada), 2);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function asignaciones()
    {
        return $this->hasMany(ActivoFijoAsignacion::class);
    }

    public function asignacionActual()
    {
        return $this->hasOne(ActivoFijoAsignacion::class)
            ->where('estado', 'Asignado')
            ->latestOfMany();
    }
}
