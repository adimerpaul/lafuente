<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Paciente extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'pacientes';

    protected $fillable = [
        'nombre',
        'apellido',
        'fecha_nacimiento',
        'identificacion',
        'edad',
        'sexo',
        'estado_civil',
        'tipo_paciente',
        'direccion',
        'telefono',
        'fecha_creacion',
        'user_id',
        'estado_internacion',
        'fecha_alta',
        'alta_user_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'nombre_completo',
    ];

    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }

    public function historialMedicos()
    {
        return $this->hasMany(HistorialMedico::class);
    }

    public function signosVitales()
    {
        return $this->hasMany(SignosVitale::class);
    }

    public function antecedentesFamiliares()
    {
        return $this->hasMany(AntecedentesFamiliare::class);
    }

    public function habitosPersonales()
    {
        return $this->hasMany(HabitosPersonale::class);
    }

    public function recetas()
    {
        return $this->hasMany(Receta::class);
    }

    public function diagnosticos()
    {
        return $this->hasMany(Diagnostico::class);
    }

    public function ventas()
    {
        return $this->belongsToMany(Venta::class, 'paciente_ventas')
            ->withPivot('user_id', 'fecha', 'hora')
            ->withTimestamps();
    }

    public function pacienteVentas()
    {
        return $this->hasMany(PacienteVenta::class);
    }

    public function cobros()
    {
        return $this->hasMany(Cobro::class);
    }

    public function facturas()
    {
        return $this->hasMany(Factura::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }

    public function cajaRecepciones()
    {
        return $this->hasMany(CajaRecepcion::class);
    }

    public function formulariosControl()
    {
        return $this->hasMany(FormularioControl::class);
    }

    public function registroUser()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function altaUser()
    {
        return $this->belongsTo(User::class, 'alta_user_id');
    }

    public function altas()
    {
        return $this->hasMany(PacienteAlta::class)->orderByDesc('fecha_hora');
    }

    public function internaciones()
    {
        return $this->hasMany(Internacion::class)->orderByDesc('fecha_inicio');
    }

    public function internacionActiva()
    {
        return $this->hasOne(Internacion::class)->where('estado', 'Activa')->latestOfMany('fecha_inicio');
    }
}
