<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Paciente extends Model{
    use SoftDeletes,HasFactory;
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
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    protected $appends = [
        'nombre_completo',
    ];

    public function getNombreCompletoAttribute(): string{
        return "{$this->nombre} {$this->apellido}";
    }
    public function historialMedicos(){
        return $this->hasMany(HistorialMedico::class);
    }
    public function signosVitales(){
        return $this->hasMany(SignosVitale::class);
    }
    public function antecedentesFamiliares(){
        return $this->hasMany(AntecedentesFamiliare::class);
    }
    public function habitosPersonales(){
        return $this->hasMany(HabitosPersonale::class);
    }
    public function recetas(){
        return $this->hasMany(Receta::class);
    }
    public function diagnosticos(){
        return $this->hasMany(Diagnostico::class);
    }
    function ventas(){
        return $this->belongsToMany(Venta::class, 'paciente_ventas')
            ->withPivot('user_id', 'fecha', 'hora')
            ->withTimestamps();
    }
    function pacienteVentas(){
        return $this->hasMany(PacienteVenta::class);
    }
    function cobros(){
        return $this->hasMany(Cobro::class);
    }
    function facturas(){
        return $this->hasMany(Factura::class);
    }
    function pagos(){
        return $this->hasMany(Pago::class);
    }
}
