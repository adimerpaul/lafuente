<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('caja_recepciones', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->foreignId('doctor_id')->nullable()->constrained('doctores');
            $table->string('tipo_movimiento')->default('Ingreso');
            $table->unsignedTinyInteger('tipo_documento')->default(0)->comment('0 recibo, 1 factura');
            $table->string('tipo_atencion')->nullable();
            $table->unsignedTinyInteger('punto')->default(0);
            $table->string('nombre_factura')->nullable();
            $table->string('numero_ficha')->nullable();
            $table->string('estado_pago')->default('Ahora');
            $table->string('laboratorio_nombre')->nullable();
            $table->string('medico_ecografia')->nullable();
            $table->text('observaciones')->nullable();
            $table->decimal('qr', 10, 2)->default(0);
            $table->decimal('efectivo', 10, 2)->default(0);
            $table->decimal('recaudado_total', 10, 2)->default(0);
            $table->decimal('costo_atencion_medica', 10, 2)->default(0);
            $table->decimal('costo_curacion', 10, 2)->default(0);
            $table->decimal('costo_inyectable', 10, 2)->default(0);
            $table->decimal('costo_toma_presion', 10, 2)->default(0);
            $table->decimal('costo_ambulancia', 10, 2)->default(0);
            $table->decimal('costo_laboratorio', 10, 2)->default(0);
            $table->decimal('costo_ecografia', 10, 2)->default(0);
            $table->decimal('costo_uso_consultorio', 10, 2)->default(0);
            $table->decimal('costo_glicemia', 10, 2)->default(0);
            $table->decimal('costo_certificado_medico', 10, 2)->default(0);
            $table->decimal('costo_sutura', 10, 2)->default(0);
            $table->decimal('costo_antisepticos', 10, 2)->default(0);
            $table->decimal('costo_cama', 10, 2)->default(0);
            $table->decimal('costo_compania_noche', 10, 2)->default(0);
            $table->decimal('costo_uso_ecografia', 10, 2)->default(0);
            $table->decimal('costo_flebotomia', 10, 2)->default(0);
            $table->decimal('costo_sonda', 10, 2)->default(0);
            $table->decimal('costo_farmacia', 10, 2)->default(0);
            $table->decimal('otros_costos', 10, 2)->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caja_recepciones');
    }
};
