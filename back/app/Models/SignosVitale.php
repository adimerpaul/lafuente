<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SignosVitale extends Model{
//$table->foreignId('paciente_id')->constrained('pacientes');
//$table->string('estado_general')->nullable();
//$table->integer('fc')->nullable();  // Frecuencia cardíaca
//$table->integer('fr')->nullable();  // Frecuencia respiratoria
//$table->integer('pa')->nullable();  // Presión arterial
//$table->decimal('temperatura', 5, 2)->nullable();
//$table->decimal('peso', 5, 2)->nullable();
//$table->decimal('talla', 5, 2)->nullable();
//$table->decimal('imc', 5, 2)->nullable(); // Índice de Masa Corporal
//$table->integer('spo2')->nullable();
//$table->integer('glasgow')->nullable();
//$table->softDeletes();
    use SoftDeletes, HasFactory;
    protected $table = 'signos_vitales';
    protected $fillable = [
        'paciente_id',
        'estado_general',
        'fc',
        'fr',
        'pa',
        'temperatura',
        'peso',
        'talla',
        'imc',
        'spo2',
        'glasgow',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
    function paciente(){
        return $this->belongsTo(Paciente::class);
    }
}
